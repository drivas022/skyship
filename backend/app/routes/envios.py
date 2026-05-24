from flask import Blueprint, request, jsonify
from app.database import db
from app.models.envio import Envio
from app.models.tracking import TrackingEnvio
from app.utils.decorators import token_required
from flask_jwt_extended import get_jwt_identity

envios_bp = Blueprint('envios', __name__)

@envios_bp.route('', methods=['GET'])
@token_required
def get_mis_envios():
    """Obtener envíos del usuario autenticado"""
    try:
        current_user_id = int(get_jwt_identity())
        
        envios = Envio.query.filter_by(user_id=current_user_id).order_by(Envio.fecha_creacion.desc()).all()
        
        return jsonify([envio.to_dict() for envio in envios]), 200
        
    except Exception as e:
        return jsonify({'message': f'Error al obtener envíos: {str(e)}'}), 500

@envios_bp.route('', methods=['POST'])
@token_required
def crear_envio():
    """Crear nuevo envío"""
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()
        
        # Validar campos requeridos
        if not data.get('destino'):
            return jsonify({'message': 'El destino es requerido'}), 400
        
        if not data.get('costo'):
            return jsonify({'message': 'El costo es requerido'}), 400
        
        # Generar código de guía único
        codigo_guia = Envio.generar_codigo_guia()
        
        # Asegurar que sea único
        while Envio.query.filter_by(codigo_guia=codigo_guia).first():
            codigo_guia = Envio.generar_codigo_guia()
        
        # Crear envío
        nuevo_envio = Envio(
            user_id=current_user_id,
            codigo_guia=codigo_guia,
            destino=data['destino'],
            ciudad_destino=data.get('ciudad_destino'),
            departamento_destino=data.get('departamento_destino'),
            pais_destino=data.get('pais_destino', 'Guatemala'),
            peso=data.get('peso'),
            dimensiones=data.get('dimensiones'),
            descripcion=data.get('descripcion'),
            costo=data['costo'],
            estado='pendiente',
            notas=data.get('notas')
        )
        
        db.session.add(nuevo_envio)
        db.session.flush()  # Para obtener el ID sin hacer commit
        
        # Crear entrada de tracking inicial
        tracking = TrackingEnvio(
            envio_id=nuevo_envio.id,
            estado='pendiente',
            ubicacion='Ciudad de Guatemala',
            descripcion='Envío creado y en espera de recolección',
            created_by=current_user_id
        )
        
        db.session.add(tracking)
        db.session.commit()
        
        return jsonify({
            'message': 'Envío creado exitosamente',
            'envio': nuevo_envio.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error al crear envío: {str(e)}'}), 500

@envios_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_envio(id):
    """Obtener detalle de un envío específico con tracking"""
    try:
        current_user_id = int(get_jwt_identity())
        
        envio = Envio.query.get(id)
        
        if not envio:
            return jsonify({'message': 'Envío no encontrado'}), 404
        
        # Verificar que el envío pertenece al usuario
        if envio.user_id != current_user_id:
            return jsonify({'message': 'No tienes permiso para ver este envío'}), 403
        
        # Incluir tracking
        envio_dict = envio.to_dict()
        envio_dict['tracking'] = [t.to_dict() for t in envio.tracking]
        
        return jsonify(envio_dict), 200
        
    except Exception as e:
        return jsonify({'message': f'Error al obtener envío: {str(e)}'}), 500