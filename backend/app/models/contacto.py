from app.database import db
from datetime import datetime

class Contacto(db.Model):
    __tablename__ = 'contactos'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    correo = db.Column(db.String(255), nullable=False)
    telefono = db.Column(db.String(20), nullable=False)
    mensaje = db.Column(db.Text, nullable=False)
    estado = db.Column(db.String(50), default='nuevo')
    respondido_por = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'))
    respondido_en = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'correo': self.correo,
            'telefono': self.telefono,
            'mensaje': self.mensaje,
            'estado': self.estado,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }