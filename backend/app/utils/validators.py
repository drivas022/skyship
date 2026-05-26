import re

# Validadores de email, teléfono y contraseña

def validar_email(email):
    """Validar formato de email"""
    patron = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(patron, email) is not None

def validar_telefono(telefono):
    """Validar formato de teléfono (permite +, números, espacios, guiones)"""
    patron = r'^[+0-9\s-]{8,20}$'
    return re.match(patron, telefono) is not None

def validar_password(password):
    """Validar que la contraseña tenga al menos 6 caracteres"""
    return len(password) >= 6