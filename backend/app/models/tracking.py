from app.database import db
from datetime import datetime

class TrackingEnvio(db.Model):
    __tablename__ = 'tracking_envios'
    
    id = db.Column(db.Integer, primary_key=True)
    envio_id = db.Column(db.Integer, db.ForeignKey('envios.id', ondelete='CASCADE'), nullable=False)
    estado = db.Column(db.String(50), nullable=False)
    ubicacion = db.Column(db.String(255))
    descripcion = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'envio_id': self.envio_id,
            'estado': self.estado,
            'ubicacion': self.ubicacion,
            'descripcion': self.descripcion,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }