from app import create_app
from app.database import db
# punto de entrada
app = create_app()

if __name__ == '__main__':
    #with app.app_context():
        #db.create_all()  # Crear tablas si no existen
    app.run(host='0.0.0.0', port=8000, debug=True)