import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import os

def enviar_respuesta_contacto(destinatario, nombre, mensaje_original, respuesta_admin, admin_nombre):
    """
    Envía un correo de respuesta a un contacto usando Gmail
    """
    try:
        # Cargar configuración desde .env
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', 587))
        smtp_user = os.getenv('SMTP_USER')
        smtp_password = os.getenv('SMTP_PASSWORD')
        smtp_from_name = os.getenv('SMTP_FROM_NAME', 'SkyShip Express')
        
        # Validar que existan las credenciales
        if not smtp_user or not smtp_password:
            print("❌ ERROR: Faltan credenciales SMTP en .env")
            print("   Configura SMTP_USER y SMTP_PASSWORD")
            return False
        
        # Crear mensaje
        mensaje = MIMEMultipart('alternative')
        mensaje['Subject'] = 'Re: Tu consulta en SkyShip Express'
        mensaje['From'] = f'{smtp_from_name} <{smtp_user}>'
        mensaje['To'] = destinatario
        
        # HTML del correo
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #111111; color: white; padding: 20px; text-align: center; }}
                .content {{ background: #f8f8f6; padding: 20px; margin: 20px 0; }}
                .original {{ background: white; padding: 15px; border-left: 3px solid #6b6b6b; margin: 20px 0; }}
                .response {{ background: white; padding: 15px; border-left: 3px solid #111111; margin: 20px 0; }}
                .footer {{ text-align: center; color: #6b6b6b; font-size: 12px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>SKYSHIP EXPRESS</h1>
                </div>
                
                <div class="content">
                    <p>Hola {nombre},</p>
                    <p>Hemos recibido tu consulta y queremos responderte:</p>
                    
                    <div class="original">
                        <strong>Tu mensaje:</strong>
                        <p>{mensaje_original}</p>
                    </div>
                    
                    <div class="response">
                        <strong>Nuestra respuesta:</strong>
                        <p>{respuesta_admin}</p>
                    </div>
                    
                    <p>Si tienes más preguntas, no dudes en contactarnos nuevamente.</p>
                    <p>Atentamente,<br><strong>{admin_nombre}</strong><br>Equipo SkyShip Express</p>
                </div>
                
                <div class="footer">
                    <p>SkyShip Express - Premium Courier Service</p>
                    <p>Este correo fue enviado el {datetime.now().strftime('%d/%m/%Y a las %H:%M')}</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Adjuntar HTML
        html_part = MIMEText(html_content, 'html')
        mensaje.attach(html_part)
        
        # Enviar correo usando Gmail
        print(f"📧 Conectando a Gmail ({smtp_server}:{smtp_port})...")
        
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.set_debuglevel(1)  # Ver detalles de la conexión
            server.starttls()  # Iniciar conexión segura
            
            print(f"🔐 Autenticando con {smtp_user}...")
            server.login(smtp_user, smtp_password)
            
            print(f"✉️ Enviando correo a {destinatario}...")
            server.send_message(mensaje)
        
        print("=" * 50)
        print(f"✅ CORREO ENVIADO EXITOSAMENTE")
        print(f"   Destinatario: {destinatario}")
        print(f"   Asunto: Re: Tu consulta en SkyShip Express")
        print("=" * 50)
        
        return True
        
    except smtplib.SMTPAuthenticationError:
        print("=" * 50)
        print("❌ ERROR DE AUTENTICACIÓN")
        print("   - Verifica que SMTP_USER sea tu correo de Gmail")
        print("   - Verifica que SMTP_PASSWORD sea la contraseña de aplicación")
        print("=" * 50)
        return False
        
    except smtplib.SMTPException as e:
        print("=" * 50)
        print(f"❌ ERROR SMTP: {str(e)}")
        print("=" * 50)
        return False
        
    except Exception as e:
        print("=" * 50)
        print(f"❌ ERROR GENERAL: {str(e)}")
        print("=" * 50)
        return False