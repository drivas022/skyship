from flask import Blueprint, request, jsonify
from app.database import db
from app.models.contacto import Contacto
from app.utils.validators import validar_email, validar_telefono

# Ruta pública - POST /api/contacto (formulario de contacto)

contacto_bp = Blueprint('contacto', __name__)

@contacto_bp.route('', methods=['POST'])
def crear_contacto():
    """Guardar mensaje de contacto"""
    try:
        data = request.get_json()
        
        # Validar campos requeridos
        required_fields = ['nombre', 'correo', 'telefono', 'mensaje']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'message': f'El campo {field} es requerido'}), 400
        
        # Validar email
        if not validar_email(data['correo']):
            return jsonify({'message': 'Email inválido'}), 400
        
        # Validar teléfono
        if not validar_telefono(data['telefono']):
            return jsonify({'message': 'Teléfono inválido'}), 400
        
        # Validar mensaje
        if len(data['mensaje'].strip()) < 10:
            return jsonify({'message': 'El mensaje debe tener al menos 10 caracteres'}), 400
        
        # Crear contacto
        nuevo_contacto = Contacto(
            nombre=data['nombre'],
            correo=data['correo'],
            telefono=data['telefono'],
            mensaje=data['mensaje']
        )
        
        db.session.add(nuevo_contacto)
        db.session.commit()
        
        return jsonify({
            'message': 'Mensaje enviado exitosamente',
            'contacto': nuevo_contacto.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error al enviar mensaje: {str(e)}'}), 500