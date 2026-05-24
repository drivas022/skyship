from app.database import db
from datetime import datetime
import random
import string

class Envio(db.Model):
    __tablename__ = 'envios'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    codigo_guia = db.Column(db.String(50), unique=True, nullable=False)
    
    # Destino
    destino = db.Column(db.String(255), nullable=False)
    ciudad_destino = db.Column(db.String(100))
    departamento_destino = db.Column(db.String(100))
    pais_destino = db.Column(db.String(100), default='Guatemala')
    
    # Detalles
    peso = db.Column(db.Numeric(10, 2))
    dimensiones = db.Column(db.String(50))
    descripcion = db.Column(db.Text)
    
    # Costo
    costo = db.Column(db.Numeric(10, 2), nullable=False)
    
    # Estado
    estado = db.Column(db.String(50), default='pendiente')
    
    # Fechas
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_entrega_estimada = db.Column(db.Date)
    fecha_entrega_real = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Notas
    notas = db.Column(db.Text)
    notas_admin = db.Column(db.Text)
    
    # Relación con tracking
    tracking = db.relationship('TrackingEnvio', backref='envio', lazy=True, cascade='all, delete-orphan')
    
    @staticmethod
    def generar_codigo_guia():
        """Generar código de guía único formato: SKY-YYYYMMDD-XXXXX"""
        fecha = datetime.now().strftime('%Y%m%d')
        numero = ''.join(random.choices(string.digits, k=5))
        return f'SKY-{fecha}-{numero}'
    
    def to_dict(self):
        """Convertir a diccionario"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'usuario_nombre': self.usuario.nombre if self.usuario else None,
            'codigo_guia': self.codigo_guia,
            'destino': self.destino,
            'ciudad_destino': self.ciudad_destino,
            'departamento_destino': self.departamento_destino,
            'pais_destino': self.pais_destino,
            'peso': float(self.peso) if self.peso else None,
            'dimensiones': self.dimensiones,
            'descripcion': self.descripcion,
            'costo': float(self.costo),
            'estado': self.estado,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None,
            'fecha_entrega_estimada': self.fecha_entrega_estimada.isoformat() if self.fecha_entrega_estimada else None,
            'fecha_entrega_real': self.fecha_entrega_real.isoformat() if self.fecha_entrega_real else None,
            'notas': self.notas
        }