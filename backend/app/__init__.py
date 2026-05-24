from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from app.config import Config
from app.database import db

bcrypt = Bcrypt()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Inicializar extensiones
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    # Configurar CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config['FRONTEND_URL'],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Registrar blueprints (rutas)
    from app.routes.auth import auth_bp
    from app.routes.envios import envios_bp
    from app.routes.admin import admin_bp
    from app.routes.contacto import contacto_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(envios_bp, url_prefix='/api/envios')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(contacto_bp, url_prefix='/api/contacto')
    
    return app