from flask import Blueprint, request, jsonify
from app.database import db
from app.models.user import User
from app.models.envio import Envio
from app.models.tracking import TrackingEnvio
from app import bcrypt
from app.utils.decorators import admin_required
from flask_jwt_extended import get_jwt_identity
from sqlalchemy import func, extract

admin_bp = Blueprint('admin', __name__)

# ============================================
# DASHBOARD - ESTADÍSTICAS
# ============================================
@admin_bp.route('/dashboard', methods=['GET'])
@admin_required
def get_dashboard_stats():
    """Obtener estadísticas para el dashboard admin"""
    try:
        # Total de envíos
        total_envios = Envio.query.count()
        
        # Total de usuarios
        total_usuarios = User.query.filter_by(rol='cliente').count()
        
        # Envíos por estado
        envios_pendientes = Envio.query.filter_by(estado='pendiente').count()
        envios_en_transito = Envio.query.filter_by(estado='en_transito').count()
        envios_entregados = Envio.query.filter_by(estado='entregado').count()
        envios_cancelados = Envio.query.filter_by(estado='cancelado').count()
        
        # Envíos por mes (últimos 6 meses)
        envios_por_mes = db.session.query(
            extract('month', Envio.fecha_creacion).label('mes'),
            extract('year', Envio.fecha_creacion).label('año'),
            func.count(Envio.id).label('total')
        ).group_by('mes', 'año').order_by('año', 'mes').limit(6).all()
        
        # Envíos por departamento
        envios_por_region = db.session.query(
            Envio.departamento_destino,
            func.count(Envio.id).label('total')
        ).filter(Envio.departamento_destino.isnot(None)).group_by(
            Envio.departamento_destino
        ).order_by(func.count(Envio.id).desc()).limit(10).all()
        
        return jsonify({
            'totalEnvios': total_envios,
            'totalUsuarios': total_usuarios,
            'enviosPendientes': envios_pendientes,
            'enviosEnTransito': envios_en_transito,
            'enviosEntregados': envios_entregados,
            'enviosCancelados': envios_cancelados,
            'enviosPorMes': [
                {'mes': int(e.mes), 'año': int(e.año), 'total': e.total} 
                for e in envios_por_mes
            ],
            'enviosPorRegion': [
                {'region': e.departamento_destino or 'Sin especificar', 'total': e.total} 
                for e in envios_por_region
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error al obtener estadísticas: {str(e)}'}), 500

# ============================================
# GESTIÓN DE ENVÍOS (ADMIN)
# ============================================
@admin_bp.route('/envios', methods=['GET'])
@admin_required
def get_all_envios():
    """Obtener todos los envíos (admin)"""
    try:
        envios = Envio.query.order_by(Envio.fecha_creacion.desc()).all()
        return jsonify([envio.to_dict() for envio in envios]), 200
        
    except Exception as e:
        return jsonify({'message': f'Error al obtener envíos: {str(e)}'}), 500

@admin_bp.route('/envios/<int:id>', methods=['PUT'])
@admin_required
def update_envio(id):
    """Actualizar envío (admin)"""
    try:
        current_user_id = int(get_jwt_identity())
        envio = Envio.query.get(id)
        
        if not envio:
            return jsonify({'message': 'Envío no encontrado'}), 404
        
        data = request.get_json()
        
        # Actualizar campos
        if 'destino' in data:
            envio.destino = data['destino']
        if 'ciudad_destino' in data:
            envio.ciudad_destino = data['ciudad_destino']
        if 'departamento_destino' in data:
            envio.departamento_destino = data['departamento_destino']
        if 'costo' in data:
            envio.costo = data['costo']
        if 'notas_admin' in data:
            envio.notas_admin = data['notas_admin']
        
        # Si se actualiza el estado, crear entrada de tracking
        if 'estado' in data and data['estado'] != envio.estado:
            estado_anterior = envio.estado
            envio.estado = data['estado']
            
            # Crear entrada de tracking
            tracking = TrackingEnvio(
                envio_id=envio.id,
                estado=data['estado'],
                ubicacion=data.get('ubicacion', 'Ciudad de Guatemala'),
                descripcion=f'Estado actualizado de {estado_anterior} a {data["estado"]}',
                created_by=current_user_id
            )
            db.session.add(tracking)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Envío actualizado exitosamente',
            'envio': envio.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error al actualizar envío: {str(e)}'}), 500

@admin_bp.route('/envios/<int:id>', methods=['DELETE'])
@admin_required
def delete_envio(id):
    """Eliminar envío (admin)"""
    try:
        envio = Envio.query.get(id)
        
        if not envio:
            return jsonify({'message': 'Envío no encontrado'}), 404
        
        db.session.delete(envio)
        db.session.commit()
        
        return jsonify({'message': 'Envío eliminado exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error al eliminar envío: {str(e)}'}), 500

# ============================================
# GESTIÓN DE USUARIOS (ADMIN)
# ============================================
@admin_bp.route('/usuarios', methods=['GET'])
@admin_required
def get_all_usuarios():
    """Obtener todos los usuarios (admin)"""
    try:
        usuarios = User.query.all()
        return jsonify([user.to_dict() for user in usuarios]), 200
        
    except Exception as e:
        return jsonify({'message': f'Error al obtener usuarios: {str(e)}'}), 500

@admin_bp.route('/usuarios/<int:id>', methods=['PUT'])
@admin_required
def update_usuario(id):
    """Actualizar usuario (admin)"""
    try:
        usuario = User.query.get(id)
        
        if not usuario:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        data = request.get_json()
        
        # Actualizar campos
        if 'nombre' in data:
            usuario.nombre = data['nombre']
        if 'correo' in data:
            # Verificar que el correo no esté en uso por otro usuario
            existing_user = User.query.filter_by(correo=data['correo']).first()
            if existing_user and existing_user.id != id:
                return jsonify({'message': 'El correo ya está en uso'}), 400
            usuario.correo = data['correo']
        if 'telefono' in data:
            usuario.telefono = data['telefono']
        if 'direccion' in data:
            usuario.direccion = data['direccion']
        if 'rol' in data:
            usuario.rol = data['rol']
        if 'activo' in data:
            usuario.activo = data['activo']
        
        # Si se envía nueva contraseña
        if 'password' in data and data['password']:
            usuario.password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        db.session.commit()
        
        return jsonify({
            'message': 'Usuario actualizado exitosamente',
            'usuario': usuario.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error al actualizar usuario: {str(e)}'}), 500

@admin_bp.route('/usuarios/<int:id>', methods=['DELETE'])
@admin_required
def delete_usuario(id):
    """Eliminar usuario (admin)"""
    try:
        current_user_id = int(get_jwt_identity())
        
        # No permitir que un admin se elimine a sí mismo
        if current_user_id == id:
            return jsonify({'message': 'No puedes eliminar tu propio usuario'}), 400
        
        usuario = User.query.get(id)
        
        if not usuario:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        db.session.delete(usuario)
        db.session.commit()
        
        return jsonify({'message': 'Usuario eliminado exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error al eliminar usuario: {str(e)}'}), 500