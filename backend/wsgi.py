from app import create_app

application = create_app()
app = application

# Configuración WSGI para despliegue en producción con Gunicorn