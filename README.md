# 📦 SkyShip Express - Sistema de Gestión de Paquetería

**Universidad Rafael Landívar**  
**Proyecto 2 Diego Rivas 1084522 - Programación Web 1S2026**  
**Facultad de Ingeniería - Ingeniería en Informática y Sistemas**

---

## 📋 Tabla de Contenidos

1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Características Principales](#-características-principales)
3. [Arquitectura del Sistema](#️-arquitectura-del-sistema)
4. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
5. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Base de Datos](#-base-de-datos)
7. [Instalación y Configuración](#-instalación-y-configuración)
8. [Guía de Uso](#-guía-de-uso)
9. [API Endpoints](#-api-endpoints)
10. [Seguridad](#-seguridad)
11. [Credenciales de Prueba](#-credenciales-de-prueba)
12. [Autor](#-autor)

---

## 📖 Descripción del Proyecto

**SkyShip Express** es una plataforma web completa para la gestión integral de envíos y paquetería. El sistema fue desarrollado para modernizar las operaciones de una empresa de courier, proporcionando una experiencia fluida tanto para clientes finales como para el equipo administrativo.

### ¿Qué ofrece SkyShip Express?

- ✅ **Registro y autenticación** de usuarios con seguridad JWT
- ✅ **Creación de solicitudes de envío** con cotización automática
- ✅ **Rastreo en tiempo real** de paquetes con historial completo
- ✅ **Panel administrativo** con métricas y estadísticas del negocio
- ✅ **Gestión CRUD completa** de usuarios, envíos y contactos
- ✅ **Sistema de contacto** con respuestas automáticas por email
- ✅ **Dashboard con gráficas** de ingresos, envíos por mes y regiones

---

## Características Principales

### Para Clientes

#### 🔐 Autenticación Segura
- Registro de cuenta con validación completa de datos
- Inicio de sesión con tokens JWT (expiración 24 horas)
- Contraseñas hasheadas con bcrypt (salt rounds: 12)
- Gestión de sesión con React Context API

#### 📦 Gestión de Envíos
- Creación de envíos con información detallada del destino
- Cotizador automático basado en peso, dimensiones y ubicación
- Visualización de todos los envíos en un dashboard personalizado
- Cada envío muestra: código de guía, destino, estado, costo, fecha

#### 🔍 Seguimiento en Tiempo Real
- Rastreo del estado actual de cada paquete
- Historial completo de tracking con timestamps
- Visualización de ubicación y descripciones detalladas
- Estados disponibles: Pendiente, En Tránsito, Entregado, Cancelado

#### 💬 Sistema de Contacto
- Formulario de contacto con validación
- Envío de consultas al equipo administrativo
- Respuestas automáticas por email

### Para Administradores

#### 📊 Panel de Control Avanzado
- **KPIs en Tiempo Real:**
  - Total de envíos y usuarios
  - Envíos por estado (pendientes, en tránsito, entregados)
  - Ingresos totales y promedio por envío
  - Tasa de entrega exitosa (%)
  - Comparación mes actual vs mes anterior

- **Gráficas Interactivas:**
  - Envíos e ingresos por mes (últimos 12 meses)
  - Distribución por departamento (Top 10)
  - Gráfica de dona con estados de envíos
  - Top 5 clientes por volumen de envíos

#### 👥 Gestión de Usuarios
- Listado completo de usuarios con búsqueda
- Crear, editar y eliminar usuarios
- Cambiar roles (cliente ↔ admin)
- Activar/desactivar cuentas
- Resetear contraseñas
- Prevención de auto-eliminación del admin

#### 📦 Gestión de Envíos
- Listado completo de todos los envíos
- Actualizar estado de envíos (genera entrada de tracking automática)
- Modificar destino, costo y notas administrativas
- Eliminar envíos (con confirmación)
- Filtrado por estado, fecha, usuario

#### 💬 Gestión de Contactos
- Listado de mensajes recibidos
- Marcar como leído/nuevo/respondido
- Responder mensajes (envía email automático)
- Eliminar mensajes

---

## 🏗️ Arquitectura del Sistema

El proyecto implementa una **arquitectura cliente-servidor de tres capas**:

```
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE PRESENTACIÓN                     │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │             React Frontend (Puerto 3000)              │  │
│  │                                                       │  │
│  │  • Interfaz de Usuario (UI/UX)                       │  │
│  │  • Componentes React reutilizables                   │  │
│  │  • React Router para navegación                      │  │
│  │  • Context API para estado global                    │  │
│  │  • Axios para peticiones HTTP                        │  │
│  │  • Recharts para visualizaciones                     │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP/REST API
                           │ (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      CAPA DE NEGOCIO                         │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │             Flask Backend (Puerto 8000)               │  │
│  │                                                       │  │
│  │  • API RESTful con blueprints                        │  │
│  │  • Autenticación JWT (Flask-JWT-Extended)            │  │
│  │  • Validación de datos                               │  │
│  │  • Lógica de negocio                                 │  │
│  │  • Decoradores para autorización                     │  │
│  │  • CORS configurado                                  │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ SQLAlchemy ORM
                           │ (Queries SQL)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE PERSISTENCIA                     │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           PostgreSQL 17 (Puerto 5433)                 │  │
│  │                                                       │  │
│  │  • Base de datos relacional                          │  │
│  │  • Tablas: users, envios, tracking_envios, contactos │  │
│  │  • Relaciones Foreign Key                            │  │
│  │  • Índices para optimización                         │  │
│  │  • Triggers para updated_at                          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de una Petición

1. **Cliente** → Usuario interactúa con la interfaz React
2. **Petición HTTP** → Axios envía petición al backend (con token JWT si requiere autenticación)
3. **Backend** → Flask valida token, procesa petición, ejecuta lógica de negocio
4. **Base de Datos** → SQLAlchemy ejecuta queries en PostgreSQL
5. **Respuesta** → Backend devuelve JSON al frontend
6. **Actualización UI** → React actualiza la interfaz con los datos recibidos

---

## 🛠️ Tecnologías Utilizadas

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.2.4 | Biblioteca principal para construir la interfaz de usuario |
| **React Router DOM** | 7.13.1 | Navegación entre páginas (SPA - Single Page Application) |
| **Axios** | 1.16.1 | Cliente HTTP para comunicación con el backend REST API |
| **Recharts** | 3.8.1 | Biblioteca de gráficas para visualización de datos |
| **React Scripts** | 5.0.1 | Configuración y scripts de Create React App |

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Flask** | 3.0.0 | Framework web minimalista para Python |
| **Flask-SQLAlchemy** | - | ORM para interacción con PostgreSQL |
| **Flask-JWT-Extended** | - | Autenticación basada en tokens JWT |
| **Flask-Bcrypt** | - | Hash seguro de contraseñas (bcrypt) |
| **Flask-CORS** | - | Manejo de políticas CORS para permitir peticiones del frontend |
| **psycopg2-binary** | - | Adaptador PostgreSQL para Python |
| **python-dotenv** | - | Carga de variables de entorno desde archivo .env |
| **Gunicorn** | - | Servidor WSGI para producción |
| **Requests** | - | Cliente HTTP para Python |

### Base de Datos

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **PostgreSQL** | 17 | Sistema de gestión de base de datos relacional (RDBMS) |

### Herramientas de Desarrollo

- **Git** - Control de versiones
- **npm** - Gestor de paquetes para Node.js
- **pip** - Gestor de paquetes para Python
- **Python venv** - Entornos virtuales para aislamiento de dependencias

---

## 📁 Estructura del Proyecto

### Árbol Completo del Proyecto

```
SKYSHIP/
│
├── 📁 backend/                          # Backend Flask (API REST)
│   ├── 📁 app/                          # Paquete principal de la aplicación
│   │   ├── 📁 models/                   # Modelos de base de datos (ORM)
│   │   │   ├── __init__.py              # Exporta todos los modelos
│   │   │   ├── user.py                  # Modelo User (usuarios)
│   │   │   ├── envio.py                 # Modelo Envio (envíos)
│   │   │   ├── tracking.py              # Modelo TrackingEnvio (historial)
│   │   │   └── contacto.py              # Modelo Contacto (mensajes)
│   │   │
│   │   ├── 📁 routes/                   # Rutas/Endpoints de la API
│   │   │   ├── __init__.py              # Exporta todos los blueprints
│   │   │   ├── auth.py                  # Rutas de autenticación (login, register)
│   │   │   ├── envios.py                # Rutas de envíos (CRUD clientes)
│   │   │   ├── admin.py                 # Rutas admin (dashboard, gestión)
│   │   │   └── contacto.py              # Rutas de contacto
│   │   │
│   │   ├── 📁 utils/                    # Utilidades y helpers
│   │   │   ├── __init__.py              # Exporta validadores y decoradores
│   │   │   ├── validators.py            # Validadores (email, teléfono, password)
│   │   │   ├── decorators.py            # Decoradores (@token_required, @admin_required)
│   │   │   └── email_service.py         # Servicio de envío de emails (SMTP)
│   │   │
│   │   ├── __init__.py                  # Factory de Flask (create_app)
│   │   ├── config.py                    # Configuración de la aplicación
│   │   └── database.py                  # Instancia de SQLAlchemy
│   │
│   ├── app.py                           # Punto de entrada del backend
│   ├── wsgi.py                          # Entry point para Gunicorn (producción)
│   ├── requirements.txt                 # Dependencias de Python
│   ├── Procfile                         # Configuración para despliegue (Heroku)
│   ├── .env.example                     # Ejemplo de variables de entorno
│   └── .env                             # Variables de entorno (NO INCLUIR EN GIT)
│
├── 📁 frontend/                         # Frontend React
│   ├── 📁 public/                       # Archivos estáticos públicos
│   │   ├── index.html                   # HTML principal (raíz de la SPA)
│   │   ├── manifest.json                # Metadata de la aplicación web
│   │   ├── robots.txt                   # Instrucciones para bots de búsqueda
│   │   ├── _redirects                   # Reglas de redirección (Netlify)
│   │   └── aurevia.png                  # Logo de la aplicación
│   │
│   ├── 📁 src/                          # Código fuente de React
│   │   ├── 📁 assets/                   # Recursos estáticos (imágenes, iconos)
│   │   │   ├── 📁 images/               # Imágenes
│   │   │   │   └── hero-luxury.jpg      # Imagen hero de la landing page
│   │   │   └── 📁 icons/                # Iconos SVG
│   │   │
│   │   ├── 📁 components/               # Componentes React reutilizables
│   │   │   ├── Navbar.jsx               # Barra de navegación
│   │   │   ├── Footer.jsx               # Pie de página
│   │   │   ├── PrivateRoute.jsx         # Componente para rutas protegidas (clientes)
│   │   │   ├── AdminRoute.jsx           # Componente para rutas admin
│   │   │   ├── EnvioCard.jsx            # Tarjeta de envío individual
│   │   │   ├── EnvioForm.jsx            # Formulario para crear envío
│   │   │   ├── TablaEnvios.jsx          # Tabla de envíos (admin)
│   │   │   ├── TablaUsuarios.jsx        # Tabla de usuarios (admin)
│   │   │   ├── TablaContactos.jsx       # Tabla de contactos (admin)
│   │   │   ├── KPICard.jsx              # Tarjeta de KPI (métricas)
│   │   │   ├── DashboardCharts.jsx      # Gráficas del dashboard
│   │   │   ├── FormularioContacto.jsx   # Formulario de contacto
│   │   │   ├── FormularioCotizacion.jsx # Formulario de cotización
│   │   │   ├── SeccionInicio.jsx        # Sección hero de inicio
│   │   │   ├── SeccionServicios.jsx     # Sección de servicios
│   │   │   ├── SeccionComoFunciona.jsx  # Sección cómo funciona
│   │   │   ├── SeccionCobertura.jsx     # Sección de cobertura
│   │   │   ├── SeccionFAQ.jsx           # Sección de preguntas frecuentes
│   │   │   ├── SeccionSobreNosotros.jsx # Sección sobre nosotros
│   │   │   └── SeccionContacto.jsx      # Sección de contacto
│   │   │
│   │   ├── 📁 pages/                    # Páginas principales de la aplicación
│   │   │   ├── Inicio.jsx               # Página landing principal
│   │   │   ├── Login.jsx                # Página de inicio de sesión
│   │   │   ├── Registro.jsx             # Página de registro
│   │   │   ├── MisEnvios.jsx            # Dashboard de cliente (mis envíos)
│   │   │   ├── CrearEnvio.jsx           # Página para crear nuevo envío
│   │   │   ├── Cotizador.jsx            # Página de cotizador
│   │   │   └── AdminPanel.jsx           # Panel administrativo completo
│   │   │
│   │   ├── 📁 services/                 # Servicios de API (lógica de peticiones)
│   │   │   ├── api.js                   # Configuración base de Axios
│   │   │   ├── authService.js           # Servicio de autenticación
│   │   │   ├── enviosService.js         # Servicio de envíos
│   │   │   ├── adminService.js          # Servicio de administración
│   │   │   └── contactoService.js       # Servicio de contacto
│   │   │
│   │   ├── 📁 context/                  # Context API de React
│   │   │   └── AuthContext.js           # Contexto de autenticación global
│   │   │
│   │   ├── 📁 styles/                   # Hojas de estilo CSS
│   │   │   ├── globales.css             # Estilos globales (variables CSS)
│   │   │   ├── navbar.css               # Estilos del navbar
│   │   │   ├── footer.css               # Estilos del footer
│   │   │   ├── inicio.css               # Estilos de la página de inicio
│   │   │   ├── secciones.css            # Estilos de secciones
│   │   │   ├── auth.css                 # Estilos de login y registro
│   │   │   ├── dashboard.css            # Estilos del dashboard
│   │   │   ├── admin.css                # Estilos del panel admin
│   │   │   ├── formularios.css          # Estilos de formularios
│   │   │   ├── cotizador.css            # Estilos del cotizador
│   │   │   ├── kpi-card.css             # Estilos de tarjetas KPI
│   │   │   ├── dashboard-charts.css     # Estilos de gráficas
│   │   │   └── tabla-contactos.css      # Estilos de tabla de contactos
│   │   │
│   │   ├── 📁 data/                     # Datos estáticos
│   │   │   ├── servicios.js             # Datos de servicios
│   │   │   ├── faq.js                   # Preguntas frecuentes
│   │   │   └── cobertura.js             # Datos de cobertura
│   │   │
│   │   ├── 📁 utils/                    # Utilidades del frontend
│   │   │   ├── validators.js            # Validadores de formularios
│   │   │   └── cotizador.js             # Lógica de cotización
│   │   │
│   │   ├── App.js                       # Componente raíz de React
│   │   ├── index.js                     # Entry point de React
│   │   └── index.css                    # Estilos base de index
│   │
│   ├── package.json                     # Dependencias y scripts de npm
│   ├── package-lock.json                # Lock de versiones de dependencias
│   └── README.md                        # Documentación del frontend
│
├── 📁 database/                         # Scripts de base de datos
│   └── schema.sql                       # Script de creación de tablas e índices
│
├── .gitignore                           # Archivos ignorados por Git
└── README.md                            # 📄 ESTE ARCHIVO - Documentación principal
```

### Descripción Detallada de Archivos Clave

#### Backend

**`app.py`** - Punto de entrada del servidor Flask
```python
# Crea la aplicación Flask y arranca el servidor en puerto 8000
from app import create_app
app = create_app()
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
```

**`app/__init__.py`** - Factory de Flask
- Inicializa extensiones (SQLAlchemy, JWT, Bcrypt, CORS)
- Registra blueprints (rutas de la API)
- Configura CORS para permitir peticiones desde el frontend

**`app/config.py`** - Configuración centralizada
- Carga variables de entorno desde `.env`
- Configura SECRET_KEY, DATABASE_URL, JWT_SECRET_KEY
- Define configuración de SQLAlchemy

**`app/database.py`** - Instancia de SQLAlchemy
```python
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()  # ORM para interactuar con PostgreSQL
```

**Modelos (`app/models/`)**
- `user.py` - Define la tabla `users` con sus relaciones
- `envio.py` - Define la tabla `envios` y método `generar_codigo_guia()`
- `tracking.py` - Define la tabla `tracking_envios` para historial
- `contacto.py` - Define la tabla `contactos` para mensajes

**Rutas (`app/routes/`)**
- `auth.py` - POST `/api/auth/register` y `/api/auth/login`
- `envios.py` - GET/POST `/api/envios` (protegido con JWT)
- `admin.py` - Rutas de administración (protegido con `@admin_required`)
- `contacto.py` - POST `/api/contacto` (público)

**Utilidades (`app/utils/`)**
- `validators.py` - Funciones de validación (email, teléfono, contraseña)
- `decorators.py` - Decoradores `@token_required` y `@admin_required`
- `email_service.py` - Servicio SMTP para envío de emails

#### Frontend

**`src/index.js`** - Entry point de React
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

**`src/App.js`** - Componente raíz con rutas
- Envuelve la app en `<AuthProvider>` (Context API)
- Define rutas con React Router
- Maneja rutas públicas, privadas (clientes) y admin

**`src/context/AuthContext.js`** - Estado global de autenticación
- Maneja `user`, `token`, `isAuthenticated`
- Funciones `login()`, `logout()`, `register()`
- Persiste token en `localStorage`

**Servicios (`src/services/`)**

`api.js` - Configuración base de Axios:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' }
});
// Interceptor para añadir token JWT a cada petición
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Componentes Protegidos**
- `PrivateRoute.jsx` - Verifica autenticación antes de renderizar
- `AdminRoute.jsx` - Verifica rol admin antes de renderizar

**Páginas principales**
- `Inicio.jsx` - Landing page con secciones (hero, servicios, FAQ, etc.)
- `Login.jsx` / `Registro.jsx` - Formularios de autenticación
- `MisEnvios.jsx` - Dashboard del cliente con lista de envíos
- `CrearEnvio.jsx` - Formulario para crear nuevo envío
- `AdminPanel.jsx` - Panel completo de administración

---

## 🗄️ Base de Datos

### Diagrama de Entidad-Relación (ER)

```
┌─────────────────────────────────────────────────────────────────────┐
│                              USERS                                   │
├─────────────────────────────────────────────────────────────────────┤
│ • id (PK) SERIAL                                                     │
│ • nombre VARCHAR(200)                                                │
│ • correo VARCHAR(255) UNIQUE                                         │
│ • telefono VARCHAR(20)                                               │
│ • direccion TEXT                                                     │
│ • password_hash VARCHAR(255)                                         │
│ • rol VARCHAR(20) DEFAULT 'cliente'                                  │
│ • activo BOOLEAN DEFAULT true                                        │
│ • created_at TIMESTAMP                                               │
│ • updated_at TIMESTAMP                                               │
└─────────────────┬───────────────────────────────────────────────────┘
                  │
                  │ 1:N (un usuario tiene muchos envíos)
                  │
┌─────────────────▼───────────────────────────────────────────────────┐
│                             ENVIOS                                   │
├─────────────────────────────────────────────────────────────────────┤
│ • id (PK) SERIAL                                                     │
│ • user_id (FK → users.id) ON DELETE CASCADE                          │
│ • codigo_guia VARCHAR(50) UNIQUE                                     │
│ • destino VARCHAR(255)                                               │
│ • ciudad_destino VARCHAR(100)                                        │
│ • departamento_destino VARCHAR(100)                                  │
│ • pais_destino VARCHAR(100) DEFAULT 'Guatemala'                      │
│ • peso DECIMAL(10,2)                                                 │
│ • dimensiones VARCHAR(50)                                            │
│ • descripcion TEXT                                                   │
│ • costo DECIMAL(10,2)                                                │
│ • estado VARCHAR(50) DEFAULT 'pendiente'                             │
│ • fecha_creacion TIMESTAMP                                           │
│ • fecha_entrega_estimada DATE                                        │
│ • fecha_entrega_real TIMESTAMP                                       │
│ • updated_at TIMESTAMP                                               │
│ • notas TEXT                                                         │
│ • notas_admin TEXT                                                   │
└─────────────────┬───────────────────────────────────────────────────┘
                  │
                  │ 1:N (un envío tiene muchos registros de tracking)
                  │
┌─────────────────▼───────────────────────────────────────────────────┐
│                        TRACKING_ENVIOS                               │
├─────────────────────────────────────────────────────────────────────┤
│ • id (PK) SERIAL                                                     │
│ • envio_id (FK → envios.id) ON DELETE CASCADE                        │
│ • estado VARCHAR(50)                                                 │
│ • ubicacion VARCHAR(255)                                             │
│ • descripcion TEXT                                                   │
│ • created_by (FK → users.id) ON DELETE SET NULL                      │
│ • created_at TIMESTAMP                                               │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           CONTACTOS                                  │
├─────────────────────────────────────────────────────────────────────┤
│ • id (PK) SERIAL                                                     │
│ • nombre VARCHAR(200)                                                │
│ • correo VARCHAR(255)                                                │
│ • telefono VARCHAR(20)                                               │
│ • mensaje TEXT                                                       │
│ • estado VARCHAR(50) DEFAULT 'nuevo'                                 │
│ • respondido_por (FK → users.id) ON DELETE SET NULL                  │
│ • respondido_en TIMESTAMP                                            │
│ • created_at TIMESTAMP                                               │
└─────────────────────────────────────────────────────────────────────┘
```

### Descripción de Tablas

#### **1. USERS** - Usuarios del sistema

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL | Identificador único del usuario |
| `nombre` | VARCHAR(200) | Nombre completo del usuario |
| `correo` | VARCHAR(255) | Email único para login |
| `telefono` | VARCHAR(20) | Número de teléfono |
| `direccion` | TEXT | Dirección completa |
| `password_hash` | VARCHAR(255) | Contraseña hasheada con bcrypt |
| `rol` | VARCHAR(20) | 'cliente' o 'admin' |
| `activo` | BOOLEAN | Estado de la cuenta (true/false) |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

**Relaciones:**
- `1:N` con `envios` - Un usuario puede tener muchos envíos

**Índices:**
- `idx_users_correo` en `correo` para búsquedas rápidas

**Trigger:**
- `update_users_updated_at` actualiza `updated_at` automáticamente

---

#### **2. ENVIOS** - Envíos de paquetería

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL | Identificador único del envío |
| `user_id` | INTEGER | FK → users.id |
| `codigo_guia` | VARCHAR(50) | Código único formato SKY-YYYYMMDD-XXXXX |
| `destino` | VARCHAR(255) | Dirección de destino completa |
| `ciudad_destino` | VARCHAR(100) | Ciudad de destino |
| `departamento_destino` | VARCHAR(100) | Departamento de Guatemala |
| `pais_destino` | VARCHAR(100) | País (default: 'Guatemala') |
| `peso` | DECIMAL(10,2) | Peso en kilogramos |
| `dimensiones` | VARCHAR(50) | Formato: "30x20x10 cm" |
| `descripcion` | TEXT | Descripción del contenido |
| `costo` | DECIMAL(10,2) | Costo del envío en quetzales |
| `estado` | VARCHAR(50) | 'pendiente', 'en_transito', 'entregado', 'cancelado' |
| `fecha_creacion` | TIMESTAMP | Fecha de creación del envío |
| `fecha_entrega_estimada` | DATE | Fecha estimada de entrega |
| `fecha_entrega_real` | TIMESTAMP | Fecha real de entrega |
| `updated_at` | TIMESTAMP | Última actualización |
| `notas` | TEXT | Notas del cliente |
| `notas_admin` | TEXT | Notas internas del administrador |

**Relaciones:**
- `N:1` con `users` - Muchos envíos pertenecen a un usuario
- `1:N` con `tracking_envios` - Un envío tiene muchos registros de tracking

**Índices:**
- `idx_envios_user_id` en `user_id`
- `idx_envios_codigo_guia` en `codigo_guia`
- `idx_envios_estado` en `estado`
- `idx_envios_ciudad_destino` en `ciudad_destino`
- `idx_envios_departamento_destino` en `departamento_destino`

**Trigger:**
- `update_envios_updated_at` actualiza `updated_at` automáticamente

**Función de Base de Datos:**
```sql
CREATE OR REPLACE FUNCTION generar_codigo_guia()
RETURNS VARCHAR AS $$
DECLARE
    codigo VARCHAR(50);
    existe BOOLEAN;
BEGIN
    LOOP
        codigo := 'SKY-' || 
                  TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' ||
                  LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0');
        
        SELECT EXISTS(SELECT 1 FROM envios WHERE codigo_guia = codigo) INTO existe;
        EXIT WHEN NOT existe;
    END LOOP;
    RETURN codigo;
END;
$$ LANGUAGE plpgsql;
```

---

#### **3. TRACKING_ENVIOS** - Historial de tracking

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL | Identificador único del registro |
| `envio_id` | INTEGER | FK → envios.id |
| `estado` | VARCHAR(50) | Estado del envío en este punto |
| `ubicacion` | VARCHAR(255) | Ubicación actual del paquete |
| `descripcion` | TEXT | Descripción del cambio de estado |
| `created_by` | INTEGER | FK → users.id (quien creó el registro) |
| `created_at` | TIMESTAMP | Fecha y hora del registro |

**Relaciones:**
- `N:1` con `envios` - Muchos registros pertenecen a un envío
- `N:1` con `users` (created_by) - Rastrear quién hizo el cambio

**Índices:**
- `idx_tracking_envio_id` en `envio_id` para consultas rápidas

**Propósito:**
Esta tabla mantiene un **historial completo** de todos los cambios de estado de un envío. Cada vez que un admin actualiza el estado de un envío, se crea automáticamente un registro aquí.

**Ejemplo de datos:**
```
envio_id | estado      | ubicacion                 | descripcion
---------|-------------|---------------------------|---------------------------
1        | pendiente   | Ciudad de Guatemala       | Paquete recibido en bodega
1        | en_transito | Autopista a Antigua       | Paquete en ruta hacia destino
1        | entregado   | Antigua Guatemala         | Paquete entregado exitosamente
```

---

#### **4. CONTACTOS** - Mensajes de contacto

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL | Identificador único del mensaje |
| `nombre` | VARCHAR(200) | Nombre del remitente |
| `correo` | VARCHAR(255) | Email del remitente |
| `telefono` | VARCHAR(20) | Teléfono del remitente |
| `mensaje` | TEXT | Contenido del mensaje |
| `estado` | VARCHAR(50) | 'nuevo', 'leido', 'respondido' |
| `respondido_por` | INTEGER | FK → users.id (admin que respondió) |
| `respondido_en` | TIMESTAMP | Fecha de respuesta |
| `created_at` | TIMESTAMP | Fecha de recepción del mensaje |

**Relaciones:**
- `N:1` con `users` (respondido_por) - Rastrear qué admin respondió

**Propósito:**
Almacena todos los mensajes recibidos desde el formulario de contacto de la landing page. Los administradores pueden:
- Ver todos los mensajes
- Marcar como leído
- Responder (envía email automático al remitente)
- Eliminar mensajes antiguos

---

### Scripts de Base de Datos

El archivo `database/schema.sql` contiene:

1. **Creación de tablas** con todas las columnas y constraints
2. **Índices** para optimizar consultas frecuentes
3. **Triggers** para actualizar `updated_at` automáticamente
4. **Función PL/pgSQL** `generar_codigo_guia()` para códigos únicos
5. **Datos de prueba** (usuario admin y cliente demo)

---

## 🚀 Instalación y Configuración

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

| Software | Versión Mínima | Verificar Instalación |
|----------|----------------|----------------------|
| **Python** | 3.8+ | `python --version` o `python3 --version` |
| **Node.js** | 16+ | `node --version` |
| **npm** | 8+ | `npm --version` |
| **PostgreSQL** | 12+ | `psql --version` |
| **Git** | 2.0+ | `git --version` |

---

### 🗄️ PASO 1: Configuración de PostgreSQL

#### 1.1 Crear la Base de Datos

**Opción A: Usando psql (línea de comandos)**

```bash
# Conectar a PostgreSQL como superusuario
psql -U postgres

# Dentro de psql:
CREATE DATABASE skyship;

# Verificar que se creó
\l

# Salir de psql
\q
```

**Opción B: Usando pgAdmin (GUI)**

1. Abrir pgAdmin
2. Click derecho en "Databases" → "Create" → "Database"
3. Nombre: `skyship`
4. Owner: `postgres` (o tu usuario)
5. Click "Save"

#### 1.2 Ejecutar el Script de Creación de Tablas

```bash
# Navegar a la carpeta del proyecto
cd SKYSHIP

# Ejecutar el script SQL
psql -U postgres -d skyship -f database/schema.sql
```

Este script creará:
- ✅ Las 4 tablas (users, envios, tracking_envios, contactos)
- ✅ Todos los índices para optimización
- ✅ Triggers para updated_at
- ✅ Función generar_codigo_guia()
- ✅ Usuario admin de prueba (admin@skyship.com)
- ✅ Usuario cliente de prueba (juan@gmail.com)
- ✅ Un envío de ejemplo con tracking

#### 1.3 Verificar que las Tablas se Crearon

```bash
# Conectar a la base de datos
psql -U postgres -d skyship

# Listar tablas
\dt

# Debería mostrar:
#  Schema |      Name       | Type  |  Owner   
# --------+-----------------+-------+----------
#  public | users           | table | postgres
#  public | envios          | table | postgres
#  public | tracking_envios | table | postgres
#  public | contactos       | table | postgres

# Ver estructura de una tabla
\d users

# Salir
\q
```

---

### 🐍 PASO 2: Configuración del Backend (Flask)

#### 2.1 Navegar a la Carpeta del Backend

```bash
cd backend
```

#### 2.2 Crear Entorno Virtual de Python

**En macOS/Linux:**

```bash
# Crear entorno virtual
python3 -m venv .venv

# Activar entorno virtual
source .venv/bin/activate

# Verificar que está activo (deberías ver (.venv) en el prompt)
```

**En Windows:**

```bash
# Crear entorno virtual
python -m venv .venv

# Activar entorno virtual
.venv\Scripts\activate

# Verificar que está activo (deberías ver (.venv) en el prompt)
```

**Nota:** Una vez activado el entorno virtual, tu terminal se verá así:
```
(.venv) usuario@computadora:~/SKYSHIP/backend$
```

#### 2.3 Instalar Dependencias de Python

```bash
# Actualizar pip (gestor de paquetes)
pip install --upgrade pip

# Instalar todas las dependencias desde requirements.txt
pip install -r requirements.txt
```

Esto instalará:
- Flask (framework web)
- Flask-SQLAlchemy (ORM)
- Flask-JWT-Extended (autenticación)
- Flask-Bcrypt (hash de contraseñas)
- Flask-CORS (políticas CORS)
- psycopg2-binary (driver PostgreSQL)
- python-dotenv (variables de entorno)
- gunicorn (servidor WSGI)
- requests (cliente HTTP)

**Verificar instalación:**

```bash
pip list
```

Deberías ver todas las librerías listadas.

#### 2.4 Configurar Variables de Entorno

Crear un archivo `.env` en la carpeta `backend/`:

```bash
# Usar .env.example como plantilla
cp .env.example .env

# Editar con tu editor favorito
nano .env
# o
code .env
```

**Contenido del archivo `.env`:**

```env
# ============================================
# CONFIGURACIÓN DE BASE DE DATOS
# ============================================
# Formato: postgresql://usuario:contraseña@host:puerto/nombre_bd
DATABASE_URL=postgresql://postgres:tu_password_postgresql@localhost:5433/skyship

# IMPORTANTE: 
# - Si PostgreSQL está en puerto 5432, cambia 5433 → 5432
# - Reemplaza "tu_password_postgresql" con tu contraseña real
# - Si PostgreSQL está en otro host, cambia "localhost"

# ============================================
# CONFIGURACIÓN DE JWT
# ============================================
# Genera una clave secreta aleatoria (usar en producción)
# Puedes generarla con: python -c "import secrets; print(secrets.token_hex(32))"
JWT_SECRET_KEY=tu_clave_secreta_super_segura_cambiame_en_produccion

# ============================================
# CONFIGURACIÓN DE SMTP (Gmail)
# ============================================
# Para envío de emails de respuesta a contactos
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tucorreo@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
# NOTA: Para Gmail, necesitas una "contraseña de aplicación"
# Generarla en: https://myaccount.google.com/apppasswords
SMTP_FROM_NAME=SkyShip Express

# ============================================
# CONFIGURACIÓN DE ENTORNO
# ============================================
FLASK_ENV=development
FLASK_DEBUG=True
```

**⚠️ IMPORTANTE - Configuración de Gmail para Emails:**

Si quieres que funcione el envío de respuestas por email:

1. Ir a [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Iniciar sesión con tu cuenta de Gmail
3. Crear una contraseña de aplicación para "Correo"
4. Copiar la contraseña generada (16 caracteres)
5. Pegarla en `SMTP_PASSWORD` en el archivo `.env`

**Sin esto, los emails NO se enviarán**, pero la aplicación funcionará normalmente.

#### 2.5 Verificar Conexión a la Base de Datos

```bash
# Desde backend/ con el entorno virtual activado
python3 -c "from app import create_app; app = create_app(); print('✅ Conexión exitosa a PostgreSQL')"
```

Si ves "✅ Conexión exitosa a PostgreSQL", todo está bien configurado.

Si hay error, verificar:
- ¿PostgreSQL está corriendo? (`sudo service postgresql status` en Linux)
- ¿La contraseña en `DATABASE_URL` es correcta?
- ¿El puerto es correcto? (5432 o 5433)
- ¿La base de datos `skyship` existe?

#### 2.6 Ejecutar el Servidor Backend

```bash
# Asegúrate de estar en backend/ con (.venv) activado
python app.py
```

**Salida esperada:**

```
🔍 DATABASE_URL desde .env: postgresql://postgres:****@localhost:5433/skyship
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:8000
 * Running on http://192.168.x.x:8000
Press CTRL+C to quit
```

✅ **El backend está corriendo en `http://localhost:8000`**

**Probar la API:**

Abrir en el navegador o usar curl:

```bash
# Test básico (debería devolver 404 porque / no existe)
curl http://localhost:8000/

# Test de endpoint de login (debería devolver error de validación)
curl -X POST http://localhost:8000/api/auth/login
```

---

### ⚛️ PASO 3: Configuración del Frontend (React)

Abrir **OTRA TERMINAL** (dejar el backend corriendo).

#### 3.1 Navegar a la Carpeta del Frontend

```bash
# Desde la raíz del proyecto
cd frontend
```

#### 3.2 Instalar Dependencias de Node.js

```bash
# Instalar todas las dependencias desde package.json
npm install
```

Esto instalará:
- React 19.2.4
- React Router DOM 7.13.1
- Axios 1.16.1
- Recharts 3.8.1
- React Scripts 5.0.1
- Testing libraries

**Tiempo estimado:** 2-3 minutos dependiendo de tu conexión.

**Verificar instalación:**

```bash
# Ver lista de paquetes instalados
npm list --depth=0
```

Deberías ver todas las dependencias listadas.

#### 3.3 Configurar la URL del Backend

**Verificar que apunta al backend correcto:**

Abrir `src/services/api.js` y verificar que la `baseURL` sea correcta:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8000/api',  // ✅ Debe apuntar al puerto del backend
  headers: {
    'Content-Type': 'application/json',
  },
});
```

Si el backend está en otro puerto, cambiarlo aquí.

#### 3.4 Ejecutar el Servidor de Desarrollo

```bash
# Iniciar servidor de desarrollo de React
npm start
```

**Salida esperada:**

```
Compiled successfully!

You can now view skyship in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

✅ **El frontend está corriendo en `http://localhost:3000`**

Tu navegador debería abrirse automáticamente mostrando la landing page de SkyShip Express.

---

### 🎉 PASO 4: Verificar que Todo Funciona

#### 4.1 Verificar Servicios Corriendo

Deberías tener **3 servicios** corriendo:

| Servicio | Puerto | URL | Estado |
|----------|--------|-----|--------|
| **PostgreSQL** | 5433 (o 5432) | - | ✅ Corriendo |
| **Backend Flask** | 8000 | http://localhost:8000 | ✅ Corriendo |
| **Frontend React** | 3000 | http://localhost:3000 | ✅ Corriendo |

#### 4.2 Probar Funcionalidades Básicas

1. **Abrir el navegador en `http://localhost:3000`**
   - ✅ Deberías ver la landing page de SkyShip Express

2. **Click en "Iniciar Sesión"**
   - ✅ Deberías ver el formulario de login

3. **Iniciar sesión como cliente:**
   - Email: `juan@gmail.com`
   - Contraseña: `cliente123`
   - ✅ Deberías ver el dashboard con envíos

4. **Cerrar sesión e iniciar como admin:**
   - Email: `admin@skyship.com`
   - Contraseña: `admin123`
   - ✅ Deberías ver el panel de administración con estadísticas

Si todo funciona, ¡felicidades! 🎊 La aplicación está completamente configurada.

---

### 🛠️ Comandos Útiles

#### Backend

```bash
# Activar entorno virtual
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate     # Windows

# Desactivar entorno virtual
deactivate

# Instalar nueva dependencia
pip install nombre-paquete

# Actualizar requirements.txt
pip freeze > requirements.txt

# Ejecutar servidor
python app.py

# Ver logs en tiempo real
python app.py 2>&1 | tee backend.log
```

#### Frontend

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm start

# Crear build de producción
npm run build

# Ejecutar tests
npm test

# Instalar nueva dependencia
npm install nombre-paquete

# Actualizar dependencias
npm update

# Ver vulnerabilidades
npm audit

# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres -d skyship

# Backup de la base de datos
pg_dump -U postgres skyship > backup_skyship.sql

# Restaurar backup
psql -U postgres -d skyship < backup_skyship.sql

# Ver tablas
psql -U postgres -d skyship -c "\dt"

# Ver datos de una tabla
psql -U postgres -d skyship -c "SELECT * FROM users;"

# Resetear base de datos (CUIDADO: borra todos los datos)
psql -U postgres -d skyship -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
psql -U postgres -d skyship -f database/schema.sql
```

---

### 🔧 Solución de Problemas Comunes

#### Problema: "ModuleNotFoundError: No module named 'flask'"

**Solución:**
```bash
# Verificar que el entorno virtual está activado
source .venv/bin/activate

# Reinstalar dependencias
pip install -r requirements.txt
```

#### Problema: "Error: listen EADDRINUSE: address already in use :::3000"

**Solución:**
```bash
# Matar el proceso usando el puerto 3000
sudo lsof -i :3000
sudo kill -9 <PID>

# O cambiar el puerto del frontend
PORT=3001 npm start
```

#### Problema: Backend no se conecta a PostgreSQL

**Solución:**
```bash
# Verificar que PostgreSQL está corriendo
sudo service postgresql status

# Verificar el puerto correcto
psql -U postgres -p 5433 -d skyship  # Probar puerto 5433
psql -U postgres -p 5432 -d skyship  # Probar puerto 5432

# Verificar DATABASE_URL en .env
cat backend/.env | grep DATABASE_URL
```

#### Problema: CORS error al hacer peticiones

**Solución:**
- Verificar que `FRONTEND_URL` en `backend/.env` sea `http://localhost:3000`
- Verificar que Flask-CORS esté instalado: `pip install flask-cors`
- Revisar la configuración en `backend/app/__init__.py`

---

## 📖 Guía de Uso

### Para Clientes

#### Registro de Usuario

1. Ir a `http://localhost:3000`
2. Click en **"Registrarse"**
3. Llenar el formulario:
   - Nombre completo
   - Email (debe ser único)
   - Teléfono (formato: +502 1234-5678)
   - Dirección completa
   - Contraseña (mínimo 6 caracteres)
4. Click en **"Registrarse"**
5. Se creará la cuenta y se iniciará sesión automáticamente

#### Crear un Envío

1. Iniciar sesión como cliente
2. Click en **"Crear Envío"** (navbar)
3. Llenar el formulario:
   - **Destino:** Dirección completa
   - **Ciudad:** Ej. Antigua Guatemala
   - **Departamento:** Ej. Sacatepéquez
   - **País:** Guatemala (por defecto)
   - **Peso:** En kilogramos (Ej. 2.5)
   - **Dimensiones:** Formato "30x20x10 cm"
   - **Descripción:** Contenido del paquete
   - **Notas:** Instrucciones especiales (opcional)
4. El sistema calculará automáticamente el **costo** basado en:
   - Peso
   - Dimensiones
   - Departamento de destino
5. Click en **"Crear Envío"**
6. Se generará un **código de guía único** (Ej. SKY-20260524-12345)

#### Ver Mis Envíos

1. Ir a **"Mis Envíos"** (navbar)
2. Ver lista de todos los envíos con:
   - Código de guía
   - Destino
   - Estado (badge de color)
   - Costo
   - Fecha de creación
3. Click en un envío para ver detalles y tracking

#### Rastrear un Envío

1. Ir a **"Mis Envíos"**
2. Click en un envío específico
3. Ver historial completo de tracking:
   - Cada cambio de estado
   - Ubicación actual
   - Descripción
   - Fecha y hora

#### Usar el Cotizador

1. Ir a **"Cotizador"** (navbar)
2. Ingresar:
   - Peso (kg)
   - Dimensiones (cm)
   - Departamento de destino
3. Click en **"Cotizar"**
4. Ver costo estimado y tiempo de entrega

### Para Administradores

#### Acceder al Panel de Admin

1. Iniciar sesión con credenciales de admin:
   - Email: `admin@skyship.com`
   - Contraseña: `admin123`
2. Automáticamente se redirige al **Panel de Administración**

#### Dashboard - KPIs y Estadísticas

El dashboard muestra:

**KPIs Principales:**
- Total de envíos
- Total de usuarios (clientes)
- Envíos pendientes
- Envíos en tránsito
- Envíos entregados
- Ingresos totales
- Ingreso promedio por envío
- Tasa de entrega (%)

**Comparación Mensual:**
- Envíos: Mes actual vs mes anterior (con % de cambio)
- Ingresos: Mes actual vs mes anterior (con % de cambio)

**Gráficas:**
1. **Envíos e Ingresos por Mes** (gráfica de barras)
   - Últimos 12 meses
   - Dual axis: cantidad de envíos + ingresos

2. **Distribución por Departamento** (gráfica de barras)
   - Top 10 departamentos
   - Cantidad de envíos e ingresos por región

3. **Estados de Envíos** (gráfica de dona)
   - Distribución porcentual por estado

4. **Top 5 Clientes**
   - Clientes con más envíos
   - Total gastado por cliente

#### Gestionar Envíos

1. Click en tab **"Envíos"**
2. Ver tabla con todos los envíos del sistema
3. **Acciones disponibles:**
   - **Editar:** Modificar destino, costo, notas
   - **Cambiar Estado:** 
     - Pendiente → En Tránsito → Entregado
     - Al cambiar estado, se crea entrada automática en tracking
   - **Eliminar:** Borrar envío (pide confirmación)

**Cambiar Estado de un Envío:**
1. Click en botón **"Editar"** del envío
2. En el modal, cambiar el campo **"Estado"**
3. Opcionalmente añadir **ubicación** y **descripción**
4. Click en **"Guardar"**
5. Se actualiza el envío y se crea registro de tracking automáticamente

#### Gestionar Usuarios

1. Click en tab **"Usuarios"**
2. Ver tabla con todos los usuarios (clientes y admins)
3. **Acciones disponibles:**
   - **Editar:** Modificar nombre, correo, teléfono, dirección
   - **Cambiar Rol:** Convertir cliente ↔ admin
   - **Activar/Desactivar:** Bloquear acceso sin eliminar cuenta
   - **Resetear Contraseña:** Establecer nueva contraseña
   - **Eliminar:** Borrar usuario (no puede eliminarse a sí mismo)

**Crear Nuevo Usuario:**
1. Click en **"Nuevo Usuario"**
2. Llenar formulario completo
3. Seleccionar rol: Cliente o Admin
4. Click en **"Crear"**

#### Gestionar Contactos

1. Click en tab **"Contactos"**
2. Ver todos los mensajes recibidos desde el formulario de contacto
3. **Estados de mensajes:**
   - 🆕 **Nuevo:** Sin leer
   - 👁️ **Leído:** Visto pero no respondido
   - ✅ **Respondido:** Email enviado al remitente

**Responder un Contacto:**
1. Click en **"Responder"** del mensaje
2. Escribir la respuesta en el campo de texto
3. Click en **"Enviar Respuesta"**
4. Se enviará un email automático al remitente con:
   - Su mensaje original
   - La respuesta del admin
   - Firma del admin

**Marcar como Leído:**
1. Click en **"Marcar como Leído"**
2. El estado cambia a "Leído"

**Eliminar Contacto:**
1. Click en **"Eliminar"**
2. Confirmar eliminación

---

## 🔌 API Endpoints

### Base URL

```
http://localhost:8000/api
```

### Autenticación

Todos los endpoints protegidos requieren un **token JWT** en el header:

```
Authorization: Bearer <token>
```

---

### 🔐 Endpoints de Autenticación

#### 1. Registrar Usuario

```http
POST /api/auth/register
```

**Body (JSON):**

```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "telefono": "+502 5555-1234",
  "direccion": "Zona 10, Ciudad de Guatemala",
  "password": "password123"
}
```

**Respuesta Exitosa (201):**

```json
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "telefono": "+502 5555-1234",
    "direccion": "Zona 10, Ciudad de Guatemala",
    "rol": "cliente",
    "activo": true,
    "created_at": "2026-05-24T10:30:00"
  }
}
```

**Errores:**
- `400` - Campo requerido faltante
- `400` - Email inválido
- `400` - Teléfono inválido
- `400` - Contraseña muy corta (mín. 6 caracteres)
- `400` - El correo ya está registrado

---

#### 2. Iniciar Sesión

```http
POST /api/auth/login
```

**Body (JSON):**

```json
{
  "correo": "juan@example.com",
  "password": "password123"
}
```

**Respuesta Exitosa (200):**

```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "telefono": "+502 5555-1234",
    "direccion": "Zona 10, Ciudad de Guatemala",
    "rol": "cliente",
    "activo": true,
    "created_at": "2026-05-24T10:30:00"
  }
}
```

**Errores:**
- `400` - Correo y contraseña son requeridos
- `401` - Credenciales incorrectas
- `401` - Usuario inactivo

---

### 📦 Endpoints de Envíos (Clientes)

**Requiere autenticación:** ✅ (token JWT)

#### 3. Obtener Mis Envíos

```http
GET /api/envios
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**

```json
[
  {
    "id": 1,
    "user_id": 3,
    "usuario_nombre": "Juan Pérez",
    "codigo_guia": "SKY-20260524-00001",
    "destino": "Antigua Guatemala",
    "ciudad_destino": "Antigua",
    "departamento_destino": "Sacatepéquez",
    "pais_destino": "Guatemala",
    "peso": 2.5,
    "dimensiones": "30x20x10 cm",
    "descripcion": "Documentos importantes",
    "costo": 75.50,
    "estado": "en_transito",
    "fecha_creacion": "2026-05-24T10:00:00",
    "fecha_entrega_estimada": "2026-05-26",
    "fecha_entrega_real": null,
    "notas": "Favor entregar en portería"
  }
]
```

---

#### 4. Crear Nuevo Envío

```http
POST /api/envios
```

**Headers:**

```
Authorization: Bearer <token>
```

**Body (JSON):**

```json
{
  "destino": "5ta Avenida Norte #25, Antigua Guatemala",
  "ciudad_destino": "Antigua",
  "departamento_destino": "Sacatepéquez",
  "pais_destino": "Guatemala",
  "peso": 2.5,
  "dimensiones": "30x20x10 cm",
  "descripcion": "Documentos importantes",
  "costo": 75.50,
  "notas": "Favor entregar en portería"
}
```

**Respuesta Exitosa (201):**

```json
{
  "message": "Envío creado exitosamente",
  "envio": {
    "id": 5,
    "user_id": 3,
    "codigo_guia": "SKY-20260524-12345",
    "destino": "5ta Avenida Norte #25, Antigua Guatemala",
    "ciudad_destino": "Antigua",
    "departamento_destino": "Sacatepéquez",
    "estado": "pendiente",
    "costo": 75.50,
    "fecha_creacion": "2026-05-24T15:30:00"
  }
}
```

**Notas:**
- El `codigo_guia` se genera automáticamente
- Se crea entrada inicial de tracking con estado "pendiente"
- `costo` debe ser calculado en el frontend usando `utils/cotizador.js`

---

#### 5. Obtener Detalle de Envío con Tracking

```http
GET /api/envios/{id}
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**

```json
{
  "id": 1,
  "user_id": 3,
  "codigo_guia": "SKY-20260524-00001",
  "destino": "Antigua Guatemala",
  "estado": "en_transito",
  "costo": 75.50,
  "tracking": [
    {
      "id": 1,
      "envio_id": 1,
      "estado": "pendiente",
      "ubicacion": "Ciudad de Guatemala",
      "descripcion": "Paquete recibido en bodega principal",
      "created_at": "2026-05-24T10:00:00"
    },
    {
      "id": 2,
      "envio_id": 1,
      "estado": "en_transito",
      "ubicacion": "Autopista a Antigua",
      "descripcion": "Paquete en ruta hacia destino",
      "created_at": "2026-05-24T12:30:00"
    }
  ]
}
```

**Errores:**
- `404` - Envío no encontrado
- `403` - No tienes permiso para ver este envío

---

### 💬 Endpoints de Contacto

#### 6. Enviar Mensaje de Contacto

```http
POST /api/contacto
```

**NO requiere autenticación** (público)

**Body (JSON):**

```json
{
  "nombre": "María López",
  "correo": "maria@example.com",
  "telefono": "+502 4444-5678",
  "mensaje": "Quisiera información sobre envíos internacionales"
}
```

**Respuesta Exitosa (201):**

```json
{
  "message": "Mensaje enviado exitosamente",
  "contacto": {
    "id": 5,
    "nombre": "María López",
    "correo": "maria@example.com",
    "telefono": "+502 4444-5678",
    "mensaje": "Quisiera información sobre envíos internacionales",
    "estado": "nuevo",
    "created_at": "2026-05-24T16:00:00"
  }
}
```

**Errores:**
- `400` - Campo requerido faltante
- `400` - Email inválido
- `400` - Teléfono inválido
- `400` - Mensaje muy corto (mín. 10 caracteres)

---

### 👑 Endpoints de Administración

**Requiere autenticación:** ✅ (token JWT)  
**Requiere rol:** `admin`

#### 7. Obtener Estadísticas del Dashboard

```http
GET /api/admin/dashboard
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**

```json
{
  "totalEnvios": 156,
  "totalUsuarios": 45,
  "enviosPendientes": 12,
  "enviosEnTransito": 8,
  "enviosEntregados": 130,
  "enviosCancelados": 6,
  "ingresosTotales": 12450.75,
  "ingresoPromedio": 79.81,
  "tasaEntrega": 83.3,
  "enviosMesActual": 23,
  "enviosMesAnterior": 18,
  "cambioEnvios": 27.8,
  "ingresosMesActual": 1850.50,
  "ingresosMesAnterior": 1420.00,
  "cambioIngresos": 30.3,
  "enviosPorMes": [
    {
      "mes": "Ene",
      "año": 2026,
      "total": 15,
      "ingresos": 1200.00
    }
  ],
  "enviosPorRegion": [
    {
      "region": "Guatemala",
      "total": 85,
      "ingresos": 6800.00
    },
    {
      "region": "Sacatepéquez",
      "total": 35,
      "ingresos": 2800.00
    }
  ],
  "distribucionEstados": [
    {
      "estado": "Pendiente",
      "value": 12
    },
    {
      "estado": "En Tránsito",
      "value": 8
    },
    {
      "estado": "Entregado",
      "value": 130
    },
    {
      "estado": "Cancelado",
      "value": 6
    }
  ],
  "topClientes": [
    {
      "nombre": "Juan Pérez",
      "correo": "juan@example.com",
      "total_envios": 12,
      "total_gastado": 950.00
    }
  ]
}
```

**Errores:**
- `403` - Se requiere rol de administrador

---

#### 8. Obtener Todos los Envíos (Admin)

```http
GET /api/admin/envios
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta:** Array de todos los envíos del sistema (200)

---

#### 9. Actualizar Envío (Admin)

```http
PUT /api/admin/envios/{id}
```

**Headers:**

```
Authorization: Bearer <token>
```

**Body (JSON):**

```json
{
  "destino": "Nueva dirección",
  "ciudad_destino": "Antigua",
  "departamento_destino": "Sacatepéquez",
  "costo": 85.00,
  "estado": "entregado",
  "ubicacion": "Antigua Guatemala",
  "notas_admin": "Cliente confirmó recepción"
}
```

**Respuesta Exitosa (200):**

```json
{
  "message": "Envío actualizado exitosamente",
  "envio": {
    "id": 5,
    "estado": "entregado",
    "costo": 85.00
  }
}
```

**Nota:** Al cambiar `estado`, se crea automáticamente una entrada en `tracking_envios`.

---

#### 10. Eliminar Envío (Admin)

```http
DELETE /api/admin/envios/{id}
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**

```json
{
  "message": "Envío eliminado exitosamente"
}
```

**Errores:**
- `404` - Envío no encontrado

---

#### 11. Obtener Todos los Usuarios (Admin)

```http
GET /api/admin/usuarios
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta:** Array de todos los usuarios (200)

---

#### 12. Actualizar Usuario (Admin)

```http
PUT /api/admin/usuarios/{id}
```

**Headers:**

```
Authorization: Bearer <token>
```

**Body (JSON):**

```json
{
  "nombre": "Juan Carlos Pérez",
  "correo": "juanc@example.com",
  "telefono": "+502 5555-9999",
  "direccion": "Nueva dirección",
  "rol": "admin",
  "activo": true,
  "password": "nueva_contraseña123"
}
```

**Respuesta Exitosa (200):**

```json
{
  "message": "Usuario actualizado exitosamente",
  "usuario": {
    "id": 3,
    "nombre": "Juan Carlos Pérez",
    "rol": "admin"
  }
}
```

**Errores:**
- `400` - El correo ya está en uso (por otro usuario)
- `404` - Usuario no encontrado

---

#### 13. Eliminar Usuario (Admin)

```http
DELETE /api/admin/usuarios/{id}
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**

```json
{
  "message": "Usuario eliminado exitosamente"
}
```

**Errores:**
- `400` - No puedes eliminar tu propio usuario
- `404` - Usuario no encontrado

---

#### 14. Obtener Todos los Contactos (Admin)

```http
GET /api/admin/contactos
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta:** Array de todos los mensajes de contacto (200)

---

#### 15. Responder Contacto (Admin)

```http
POST /api/admin/contactos/{id}/responder
```

**Headers:**

```
Authorization: Bearer <token>
```

**Body (JSON):**

```json
{
  "respuesta": "Gracias por tu consulta. Los envíos internacionales están disponibles a partir de junio. Te contactaremos pronto."
}
```

**Respuesta Exitosa (200):**

```json
{
  "message": "Respuesta enviada exitosamente",
  "email_enviado": true,
  "contacto": {
    "id": 5,
    "estado": "respondido",
    "respondido_en": "2026-05-24T17:00:00"
  }
}
```

**Nota:** Envía un email automático al remitente usando el servicio SMTP.

---

#### 16. Marcar Contacto como Leído

```http
PUT /api/admin/contactos/{id}/marcar-leido
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**

```json
{
  "message": "Contacto marcado como leído",
  "contacto": {
    "id": 5,
    "estado": "leido"
  }
}
```

---

#### 17. Eliminar Contacto (Admin)

```http
DELETE /api/admin/contactos/{id}
```

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta Exitosa (200):**

```json
{
  "message": "Contacto eliminado exitosamente"
}
```

---

## 🔒 Seguridad

### Medidas de Seguridad Implementadas

#### 1. Autenticación JWT

- **Tokens firmados digitalmente** con clave secreta (`JWT_SECRET_KEY`)
- **Expiración:** 24 horas (`JWT_ACCESS_TOKEN_EXPIRES`)
- **Almacenamiento:** `localStorage` en el frontend
- **Transmisión:** Header `Authorization: Bearer <token>`

**Flujo de autenticación:**

```
1. Usuario envía credenciales → POST /api/auth/login
2. Backend valida credenciales
3. Backend genera token JWT con user_id
4. Frontend guarda token en localStorage
5. Frontend incluye token en cada petición protegida
6. Backend valida token en cada endpoint protegido
```

#### 2. Hash de Contraseñas

- **Algoritmo:** bcrypt
- **Salt Rounds:** 12
- **Nunca se almacenan contraseñas en texto plano**

**Ejemplo de hash:**

```python
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()

# Al registrar
password_hash = bcrypt.generate_password_hash('password123').decode('utf-8')
# Resultado: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU.vPOqpQb4u

# Al hacer login
bcrypt.check_password_hash(user.password_hash, 'password123')  # True o False
```

#### 3. Control de Acceso Basado en Roles (RBAC)

- **Roles:** `cliente` y `admin`
- **Decoradores:**
  - `@token_required` - Verifica que el usuario esté autenticado
  - `@admin_required` - Verifica que el usuario sea administrador

**Ejemplo:**

```python
@admin_bp.route('/dashboard', methods=['GET'])
@admin_required  # Solo administradores
def get_dashboard_stats():
    # ...
```

#### 4. CORS (Cross-Origin Resource Sharing)

Configurado para permitir solo peticiones desde el frontend:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": "http://localhost:3000",  # Solo este origen
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

#### 5. Validación de Datos

**Backend (Python):**

```python
# validators.py
def validar_email(email):
    patron = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(patron, email) is not None

def validar_telefono(telefono):
    patron = r'^[+0-9\s-]{8,20}$'
    return re.match(patron, telefono) is not None

def validar_password(password):
    return len(password) >= 6
```

**Frontend (JavaScript):**

```javascript
// validators.js
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarTelefono = (telefono) => {
  const regex = /^[+\d\s-]{8,20}$/;
  return regex.test(telefono);
};
```

#### 6. Prevención de Inyección SQL

- **ORM SQLAlchemy** previene inyección SQL automáticamente
- **Queries parametrizadas** en lugar de concatenación de strings

**Ejemplo seguro:**

```python
# ✅ SEGURO (SQLAlchemy)
user = User.query.filter_by(correo=data['correo']).first()

# ❌ INSEGURO (evitado)
# query = f"SELECT * FROM users WHERE correo = '{data['correo']}'"
```

#### 7. Variables de Entorno

- **Credenciales sensibles** NO están en el código
- **Archivo `.env`** para configuración local
- **`.gitignore`** excluye `.env` del control de versiones

**Ejemplo `.env`:**

```env
SECRET_KEY=clave_super_secreta
JWT_SECRET_KEY=otra_clave_secreta
DATABASE_URL=postgresql://user:pass@localhost/db
SMTP_PASSWORD=contraseña_de_aplicacion
```

#### 8. Integridad Referencial (Base de Datos)

- **Foreign Keys** con `ON DELETE CASCADE` o `ON DELETE SET NULL`
- **Constraints UNIQUE** en campos críticos (email, codigo_guia)
- **Índices** para optimizar consultas

#### 9. Protección contra Auto-Eliminación

```python
@admin_bp.route('/usuarios/<int:id>', methods=['DELETE'])
@admin_required
def delete_usuario(id):
    current_user_id = get_jwt_identity()
    
    # No permitir que un admin se elimine a sí mismo
    if current_user_id == id:
        return jsonify({'message': 'No puedes eliminar tu propio usuario'}), 400
```

#### 10. Rate Limiting (Recomendado para Producción)

**NO implementado actualmente**, pero se recomienda para producción:

```python
from flask_limiter import Limiter

limiter = Limiter(app, key_func=lambda: request.remote_addr)

@app.route('/api/auth/login', methods=['POST'])
@limiter.limit("5 per minute")  # Máx 5 intentos por minuto
def login():
    # ...
```

---

### Patrón de Arquitectura: Separación de Responsabilidades

**Backend:**

```
routes/     → Manejo de peticiones HTTP (endpoints)
    ↓
models/     → Definición de estructura de datos (ORM)
    ↓
database.py → Conexión a PostgreSQL
```

**Frontend:**

```
pages/      → Páginas completas (Home, Login, Dashboard)
    ↓
components/ → Componentes reutilizables (Navbar, Card, Table)
    ↓
services/   → Lógica de API (Axios)
    ↓
context/    → Estado global (Auth)
```

**Beneficios:**

- Código más organizado y mantenible
- Facilita el testing
- Reutilización de componentes
- Escalabilidad

---

## 🧪 Credenciales de Prueba

### Usuario Administrador

```
Email:    admin@skyship.com
Password: admin123
Rol:      admin
```

**Acceso:**
- Panel de administración completo
- Dashboard con estadísticas
- Gestión de usuarios, envíos y contactos

---

### Usuario Cliente

```
Email:    juan@gmail.com
Password: cliente123
Rol:      cliente
```

**Acceso:**
- Dashboard de cliente (Mis Envíos)
- Crear nuevos envíos
- Ver tracking de envíos propios

---

### Datos de Prueba Incluidos

El script `database/schema.sql` incluye:

- ✅ 1 usuario administrador
- ✅ 1 usuario cliente
- ✅ 1 envío de ejemplo con estado "en_transito"
- ✅ 2 registros de tracking para ese envío

**Esto permite probar la aplicación inmediatamente sin crear datos manualmente.**

---