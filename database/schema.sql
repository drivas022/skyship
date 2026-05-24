-- ============================================
-- BASE DE DATOS: SKYSHIP EXPRESS
-- Proyecto 2 - 1S2026
-- ============================================

-- ============================================
-- TABLA: users
-- ============================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  correo VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  direccion TEXT NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) DEFAULT 'cliente', -- 'cliente' | 'admin'
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: envios (shipments)
-- ============================================
CREATE TABLE envios (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  codigo_guia VARCHAR(50) UNIQUE NOT NULL,
  
  -- Destino
  destino VARCHAR(255) NOT NULL,
  ciudad_destino VARCHAR(100),
  departamento_destino VARCHAR(100),
  pais_destino VARCHAR(100) DEFAULT 'Guatemala',
  
  -- Detalles del paquete
  peso DECIMAL(10, 2), -- en kg
  dimensiones VARCHAR(50), -- "30x20x10 cm"
  descripcion TEXT,
  
  -- Costos
  costo DECIMAL(10, 2) NOT NULL,
  
  -- Estado
  estado VARCHAR(50) DEFAULT 'pendiente', 
  -- 'pendiente', 'en_transito', 'entregado', 'cancelado'
  
  -- Fechas
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_entrega_estimada DATE,
  fecha_entrega_real TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Notas
  notas TEXT,
  notas_admin TEXT
);

-- ============================================
-- TABLA: tracking_envios (historial de estados)
-- ============================================
CREATE TABLE tracking_envios (
  id SERIAL PRIMARY KEY,
  envio_id INTEGER REFERENCES envios(id) ON DELETE CASCADE,
  estado VARCHAR(50) NOT NULL,
  ubicacion VARCHAR(255),
  descripcion TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: contactos
-- ============================================
CREATE TABLE contactos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  correo VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  mensaje TEXT NOT NULL,
  estado VARCHAR(50) DEFAULT 'nuevo', -- 'nuevo', 'leido', 'respondido'
  respondido_por INTEGER REFERENCES users(id) ON DELETE SET NULL,
  respondido_en TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES para optimización
-- ============================================
CREATE INDEX idx_users_correo ON users(correo);
CREATE INDEX idx_envios_user_id ON envios(user_id);
CREATE INDEX idx_envios_codigo_guia ON envios(codigo_guia);
CREATE INDEX idx_envios_estado ON envios(estado);
CREATE INDEX idx_envios_ciudad_destino ON envios(ciudad_destino);
CREATE INDEX idx_envios_departamento_destino ON envios(departamento_destino);
CREATE INDEX idx_tracking_envio_id ON tracking_envios(envio_id);

-- ============================================
-- TRIGGER para actualizar updated_at automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_envios_updated_at
BEFORE UPDATE ON envios
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCIÓN para generar código de guía único
-- ============================================
CREATE OR REPLACE FUNCTION generar_codigo_guia()
RETURNS VARCHAR AS $$
DECLARE
    codigo VARCHAR(50);
    existe BOOLEAN;
BEGIN
    LOOP
        -- Formato: SKY-YYYYMMDD-XXXXX (SKY-20260524-12345)
        codigo := 'SKY-' || 
                  TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' ||
                  LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0');
        
        -- Verificar si existe
        SELECT EXISTS(SELECT 1 FROM envios WHERE codigo_guia = codigo) INTO existe;
        
        EXIT WHEN NOT existe;
    END LOOP;
    
    RETURN codigo;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- USUARIO ADMIN POR DEFECTO
-- Password: admin123
-- ============================================
INSERT INTO users (nombre, correo, telefono, direccion, password_hash, rol) 
VALUES (
  'Administrador SkyShip',
  'admin@skyship.com',
  '+502 2345-6789',
  'Zona 10, Ciudad de Guatemala',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU.vPOqpQb4u',
  'admin'
);

-- ============================================
-- DATOS DE PRUEBA (opcional)
-- ============================================
-- Usuario cliente de prueba
-- Password: cliente123
INSERT INTO users (nombre, correo, telefono, direccion, password_hash, rol) 
VALUES (
  'Juan Pérez',
  'juan@gmail.com',
  '+502 5555-1234',
  'Zona 1, Ciudad de Guatemala',
  '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'cliente'
);

-- Envío de prueba
INSERT INTO envios (
  user_id, 
  codigo_guia, 
  destino, 
  ciudad_destino, 
  departamento_destino,
  costo, 
  estado
) VALUES (
  2,
  'SKY-20260524-00001',
  'Antigua Guatemala',
  'Antigua',
  'Sacatepéquez',
  75.50,
  'en_transito'
);

-- Tracking del envío de prueba
INSERT INTO tracking_envios (envio_id, estado, ubicacion, descripcion)
VALUES 
  (1, 'pendiente', 'Ciudad de Guatemala', 'Paquete recibido en bodega principal'),
  (1, 'en_transito', 'Autopista a Antigua', 'Paquete en ruta hacia destino');