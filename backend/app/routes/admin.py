from flask import Blueprint, request, jsonify
from app.database import db
from app.models.user import User
from app.models.envio import Envio
from app.models.tracking import TrackingEnvio
from app import bcrypt
from app.utils.decorators import admin_required
from flask_jwt_extended import get_jwt_identity
from sqlalchemy import func, extract
from datetime import datetime, timedelta

admin_bp = Blueprint('admin', __name__)

# ============================================
# DASHBOARD - ESTADÍSTICAS
# ============================================
@admin_bp.route('/dashboard', methods=['GET'])
@admin_required
def get_dashboard_stats():
    """Obtener estadísticas mejoradas para el dashboard admin"""
    try:
        # ========================================
        # KPIS BÁSICOS
        # ========================================
        total_envios = Envio.query.count()
        total_usuarios = User.query.filter_by(rol='cliente').count()
        
        # Envíos por estado
        envios_pendientes = Envio.query.filter_by(estado='pendiente').count()
        envios_en_transito = Envio.query.filter_by(estado='en_transito').count()
        envios_entregados = Envio.query.filter_by(estado='entregado').count()
        envios_cancelados = Envio.query.filter_by(estado='cancelado').count()
        
        # ========================================
        # KPIS FINANCIEROS
        # ========================================
        # Ingresos totales
        ingresos_totales = db.session.query(
            func.sum(Envio.costo)
        ).scalar() or 0
        
        # Ingreso promedio por envío
        ingreso_promedio = db.session.query(
            func.avg(Envio.costo)
        ).scalar() or 0
        
        # Tasa de entrega (%)
        tasa_entrega = (envios_entregados / total_envios * 100) if total_envios > 0 else 0
        
        # ========================================
        # ENVÍOS POR MES (últimos 12 meses)
        # ========================================
        envios_por_mes = db.session.query(
            extract('month', Envio.fecha_creacion).label('mes'),
            extract('year', Envio.fecha_creacion).label('año'),
            func.count(Envio.id).label('total'),
            func.sum(Envio.costo).label('ingresos')
        ).group_by('mes', 'año').order_by('año', 'mes').limit(12).all()
        
        # Formatear envíos por mes
        meses_nombres = {
            1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun',
            7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic'
        }
        
        envios_mes_formateado = [
            {
                'mes': meses_nombres[int(e.mes)],
                'año': int(e.año),
                'total': e.total,
                'ingresos': float(e.ingresos) if e.ingresos else 0
            } 
            for e in envios_por_mes
        ]
        
        # ========================================
        # ENVÍOS POR DEPARTAMENTO (Top 10)
        # ========================================
        envios_por_region = db.session.query(
            Envio.departamento_destino,
            func.count(Envio.id).label('total'),
            func.sum(Envio.costo).label('ingresos')
        ).filter(
            Envio.departamento_destino.isnot(None)
        ).group_by(
            Envio.departamento_destino
        ).order_by(
            func.count(Envio.id).desc()
        ).limit(10).all()
        
        envios_region_formateado = [
            {
                'region': e.departamento_destino or 'Sin especificar',
                'total': e.total,
                'ingresos': float(e.ingresos) if e.ingresos else 0
            }
            for e in envios_por_region
        ]
        
        # ========================================
        # DISTRIBUCIÓN POR ESTADO (para gráfica dona)
        # ========================================
        distribucion_estados = [
            {'estado': 'Pendiente', 'value': envios_pendientes},
            {'estado': 'En Tránsito', 'value': envios_en_transito},
            {'estado': 'Entregado', 'value': envios_entregados},
            {'estado': 'Cancelado', 'value': envios_cancelados}
        ]
        
        # ========================================
        # TOP 5 CLIENTES
        # ========================================
        top_clientes = db.session.query(
            User.nombre,
            User.correo,
            func.count(Envio.id).label('total_envios'),
            func.sum(Envio.costo).label('total_gastado')
        ).join(
            Envio, User.id == Envio.user_id
        ).group_by(
            User.id, User.nombre, User.correo
        ).order_by(
            func.count(Envio.id).desc()
        ).limit(5).all()
        
        top_clientes_formateado = [
            {
                'nombre': c.nombre,
                'correo': c.correo,
                'total_envios': c.total_envios,
                'total_gastado': float(c.total_gastado) if c.total_gastado else 0
            }
            for c in top_clientes
        ]
        
        # ========================================
        # COMPARACIÓN MES ACTUAL VS ANTERIOR
        # ========================================
        hoy = datetime.now()
        inicio_mes_actual = hoy.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        inicio_mes_anterior = (inicio_mes_actual - timedelta(days=1)).replace(day=1)
        
        envios_mes_actual = Envio.query.filter(
            Envio.fecha_creacion >= inicio_mes_actual
        ).count()
        
        envios_mes_anterior = Envio.query.filter(
            Envio.fecha_creacion >= inicio_mes_anterior,
            Envio.fecha_creacion < inicio_mes_actual
        ).count()
        
        # Calcular cambio porcentual
        cambio_envios = 0
        if envios_mes_anterior > 0:
            cambio_envios = ((envios_mes_actual - envios_mes_anterior) / envios_mes_anterior) * 100
        
        # Ingresos mes actual vs anterior
        ingresos_mes_actual = db.session.query(
            func.sum(Envio.costo)
        ).filter(
            Envio.fecha_creacion >= inicio_mes_actual
        ).scalar() or 0
        
        ingresos_mes_anterior = db.session.query(
            func.sum(Envio.costo)
        ).filter(
            Envio.fecha_creacion >= inicio_mes_anterior,
            Envio.fecha_creacion < inicio_mes_actual
        ).scalar() or 0
        
        cambio_ingresos = 0
        if ingresos_mes_anterior > 0:
            cambio_ingresos = ((ingresos_mes_actual - ingresos_mes_anterior) / ingresos_mes_anterior) * 100
        
        # ========================================
        # RESPUESTA COMPLETA
        # ========================================
        return jsonify({
            # KPIs Básicos
            'totalEnvios': total_envios,
            'totalUsuarios': total_usuarios,
            'enviosPendientes': envios_pendientes,
            'enviosEnTransito': envios_en_transito,
            'enviosEntregados': envios_entregados,
            'enviosCancelados': envios_cancelados,
            
            # KPIs Financieros
            'ingresosTotales': float(ingresos_totales),
            'ingresoPromedio': float(ingreso_promedio),
            'tasaEntrega': round(tasa_entrega, 1),
            
            # Comparación Mensual
            'enviosMesActual': envios_mes_actual,
            'enviosMesAnterior': envios_mes_anterior,
            'cambioEnvios': round(cambio_envios, 1),
            'ingresosMesActual': float(ingresos_mes_actual),
            'ingresosMesAnterior': float(ingresos_mes_anterior),
            'cambioIngresos': round(cambio_ingresos, 1),
            
            # Gráficas
            'enviosPorMes': envios_mes_formateado,
            'enviosPorRegion': envios_region_formateado,
            'distribucionEstados': distribucion_estados,
            'topClientes': top_clientes_formateado
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
        current_user_id = get_jwt_identity()
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
        current_user_id = get_jwt_identity()
        
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
    
    # ============================================
# GESTIÓN DE CONTACTOS (ADMIN)
# ============================================
@admin_bp.route('/contactos', methods=['GET'])
@admin_required
def get_all_contactos():
    """Obtener todos los mensajes de contacto"""
    try:
        from app.models.contacto import Contacto
        
        contactos = Contacto.query.order_by(Contacto.created_at.desc()).all()
        
        return jsonify([{
            'id': c.id,
            'nombre': c.nombre,
            'correo': c.correo,
            'telefono': c.telefono,
            'mensaje': c.mensaje,
            'estado': c.estado,
            'respondido_por': c.respondido_por,
            'respondido_en': c.respondido_en.isoformat() if c.respondido_en else None,
            'created_at': c.created_at.isoformat()
        } for c in contactos]), 200
        
    except Exception as e:
        return jsonify({'message': f'Error al obtener contactos: {str(e)}'}), 500

@admin_bp.route('/contactos/<int:id>/responder', methods=['POST'])
@admin_required
def responder_contacto(id):
    """Responder a un mensaje de contacto y enviar email"""
    try:
        from app.models.contacto import Contacto
        from app.utils.email_service import enviar_respuesta_contacto
        from datetime import datetime
        
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        contacto = Contacto.query.get(id)
        if not contacto:
            return jsonify({'message': 'Contacto no encontrado'}), 404
        
        data = request.get_json()
        respuesta = data.get('respuesta')
        
        if not respuesta:
            return jsonify({'message': 'La respuesta es requerida'}), 400
        
        # Enviar correo
        email_enviado = enviar_respuesta_contacto(
            destinatario=contacto.correo,
            nombre=contacto.nombre,
            mensaje_original=contacto.mensaje,
            respuesta_admin=respuesta,
            admin_nombre=current_user.nombre
        )
        
        # Actualizar estado del contacto
        contacto.estado = 'respondido'
        contacto.respondido_por = current_user_id
        contacto.respondido_en = datetime.now()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Respuesta enviada exitosamente',
            'email_enviado': email_enviado,
            'contacto': {
                'id': contacto.id,
                'estado': contacto.estado,
                'respondido_en': contacto.respondido_en.isoformat()
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error al responder contacto: {str(e)}'}), 500

@admin_bp.route('/contactos/<int:id>/marcar-leido', methods=['PUT'])
@admin_required
def marcar_contacto_leido(id):
    """Marcar un contacto como leído"""
    try:
        from app.models.contacto import Contacto
        
        contacto = Contacto.query.get(id)
        if not contacto:
            return jsonify({'message': 'Contacto no encontrado'}), 404
        
        contacto.estado = 'leido'
        db.session.commit()
        
        return jsonify({
            'message': 'Contacto marcado como leído',
            'contacto': {
                'id': contacto.id,
                'estado': contacto.estado
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error al marcar contacto: {str(e)}'}), 500

@admin_bp.route('/contactos/<int:id>', methods=['DELETE'])
@admin_required
def delete_contacto(id):
    """Eliminar un mensaje de contacto"""
    try:
        from app.models.contacto import Contacto
        
        contacto = Contacto.query.get(id)
        if not contacto:
            return jsonify({'message': 'Contacto no encontrado'}), 404
        
        db.session.delete(contacto)
        db.session.commit()
        
        return jsonify({'message': 'Contacto eliminado exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error al eliminar contacto: {str(e)}'}), 500