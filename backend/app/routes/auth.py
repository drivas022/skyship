from flask import Blueprint, request, jsonify
from app.database import db
from app.models.user import User
from app import bcrypt
from app.utils.validators import validar_email, validar_telefono, validar_password
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Registrar nuevo usuario"""
    try:
        data = request.get_json()
        
        # Validar campos requeridos
        required_fields = ['nombre', 'correo', 'telefono', 'direccion', 'password']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'message': f'El campo {field} es requerido'}), 400
        
        # Validar email
        if not validar_email(data['correo']):
            return jsonify({'message': 'Email inválido'}), 400
        
        # Validar teléfono
        if not validar_telefono(data['telefono']):
            return jsonify({'message': 'Teléfono inválido'}), 400
        
        # Validar contraseña
        if not validar_password(data['password']):
            return jsonify({'message': 'La contraseña debe tener al menos 6 caracteres'}), 400
        
        # Verificar si el email ya existe
        if User.query.filter_by(correo=data['correo']).first():
            return jsonify({'message': 'El correo ya está registrado'}), 400
        
        # Hashear contraseña
        password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        # Crear usuario
        nuevo_usuario = User(
            nombre=data['nombre'],
            correo=data['correo'],
            telefono=data['telefono'],
            direccion=data['direccion'],
            password_hash=password_hash,
            rol='cliente'
        )
        
        db.session.add(nuevo_usuario)
        db.session.commit()
        
        # Generar token
        access_token = create_access_token(identity=str(nuevo_usuario.id))
        
        return jsonify({
            'message': 'Usuario registrado exitosamente',
            'token': access_token,
            'user': nuevo_usuario.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error al registrar usuario: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Iniciar sesión"""
    try:
        data = request.get_json()
        
        # Validar campos
        if not data.get('correo') or not data.get('password'):
            return jsonify({'message': 'Correo y contraseña son requeridos'}), 400
        
        # Buscar usuario
        user = User.query.filter_by(correo=data['correo']).first()
        
        if not user:
            return jsonify({'message': 'Credenciales incorrectas'}), 401
        
        # Verificar contraseña
        if not bcrypt.check_password_hash(user.password_hash, data['password']):
            return jsonify({'message': 'Credenciales incorrectas'}), 401
        
        # Verificar si está activo
        if not user.activo:
            return jsonify({'message': 'Usuario inactivo'}), 401
        
        # Generar token
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login exitoso',
            'token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error al iniciar sesión: {str(e)}'}), 500