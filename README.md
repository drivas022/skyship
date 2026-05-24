# Proyecto 2 - Programación Web 1S2026

**Universidad Rafael Landívar**

## Descripción del Proyecto

SkyShip Express es una plataforma web completa para la gestión de envíos y paquetería. El sistema permite a los usuarios registrarse, crear solicitudes de envío, rastrear sus paquetes en tiempo real y gestionar toda la información desde un panel administrativo intuitivo.

La aplicación fue desarrollada como una solución integral que moderniza las operaciones de una empresa de courier, facilitando tanto la experiencia del cliente final como la administración interna del negocio.

## Tecnologías Utilizadas

### Frontend

- **React 19.2.4** - Biblioteca principal para la interfaz de usuario.
- **React Router 7.13.1** - Manejo de rutas y navegación.
- **Axios 1.16.1** - Cliente HTTP para comunicación con el backend.

### Backend

- **Flask 3.0.0** - Framework web para Python.
- **Flask-SQLAlchemy** - ORM para interacción con la base de datos.
- **Flask-JWT-Extended** - Autenticación basada en tokens.
- **Flask-Bcrypt** - Hash seguro de contraseñas.
- **Flask-CORS** - Manejo de políticas de origen cruzado.

### Base de Datos

- **PostgreSQL 17** - Sistema de gestión de base de datos relacional.

## Arquitectura del Sistema

El proyecto sigue una arquitectura cliente-servidor de tres capas:

```txt
┌─────────────────┐
│  React Frontend │  Puerto 3000
│   (Interfaz)    │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  Flask Backend  │  Puerto 8000
│   (API + Auth)  │
└────────┬────────┘
         │ SQLAlchemy
         ▼
┌─────────────────┐
│   PostgreSQL    │  Puerto 5433
│  (Base de Datos)│
└─────────────────┘
```

## Estructura de la Base de Datos

La base de datos está compuesta por cuatro tablas principales:

### users

Almacena la información de todos los usuarios del sistema, tanto clientes como administradores.

- Campos: nombre, correo, teléfono, dirección, password_hash y rol.
- El campo rol distingue entre `cliente` y `admin`.

### envios

Registra todos los envíos creados en el sistema.

- Incluye: código de guía único, destino completo, estado, costos y fechas.
- Cada envío está vinculado a un usuario mediante `user_id`.
- Los códigos de guía siguen el formato: `SKY-YYYYMMDD-XXXXX`.

### tracking_envios

Mantiene un historial completo de los cambios de estado de cada envío.

- Permite rastrear la ubicación y progreso del paquete.
- Cada entrada registra: estado, ubicación, descripción y timestamp.

### contactos

Guarda los mensajes enviados a través del formulario de contacto.

- Permite al equipo administrativo gestionar consultas de clientes potenciales.

## Funcionalidades Principales

## Para Usuarios (Clientes)

### Autenticación

- Registro de cuenta con validación de datos.
- Inicio de sesión seguro con tokens JWT.
- Las contraseñas se almacenan hasheadas utilizando bcrypt.

### Gestión de Envíos

- Creación de nuevos envíos con información completa del destino.
- Visualización de todos sus envíos en un dashboard personalizado.
- Cada envío muestra: código de guía, destino, estado, costo y fecha.

### Seguimiento

- Los usuarios pueden ver el estado actual de cada paquete.
- El sistema registra automáticamente cada cambio de estado.

## Para Administradores

### Panel de Control

- Dashboard con métricas clave del negocio.
- Estadísticas de envíos por mes y por región.
- Totales de usuarios, envíos pendientes y entregados.

### Gestión Completa (CRUD)

- Administración de usuarios: crear, editar, eliminar y cambiar roles.
- Gestión de envíos: actualizar estados, modificar información y eliminar registros.
- Prevención de auto-eliminación para mantener la integridad del sistema.

### Actualización de Estados

- Al cambiar el estado de un envío, se crea automáticamente una entrada en el historial de tracking.
- Esto permite mantener un registro completo de la trazabilidad del paquete.

## Decisiones Técnicas

### ¿Por qué Flask en vez de Node.js?

Decidimos utilizar Flask porque ofrece una curva de aprendizaje más accesible y una estructura más simple para proyectos de este alcance. Además, Python como lenguaje permite un código más legible y mantenible, lo cual facilita el trabajo en equipo.

### ¿Por qué PostgreSQL en vez de MongoDB?

La naturaleza relacional de los datos del proyecto, como usuarios vinculados a envíos y envíos vinculados a tracking, hace que PostgreSQL sea la opción natural. Las relaciones entre tablas y la integridad referencial son fundamentales para este tipo de aplicación.

### Autenticación con JWT

Implementamos JWT (JSON Web Tokens) porque permite una autenticación stateless, donde el servidor no necesita mantener sesiones activas. El token se envía en cada petición y se valida en el backend, lo que hace el sistema más escalable.

### Separación de Responsabilidades

El código está organizado siguiendo el patrón MVC:

- **Modelos (`models/`)**: Definen la estructura de datos.
- **Rutas (`routes/`)**: Manejan las peticiones HTTP.
- **Utilidades (`utils/`)**: Validadores y decoradores reutilizables.

## Instalación y Configuración

## Requisitos Previos

- Python 3.8 o superior.
- Node.js 16 o superior.
- PostgreSQL 12 o superior.

## Configuración de la Base de Datos

Crear la base de datos y correr el script que se encuentra en la carpeta `/database`

## Configuración del Backend

Navegar a la carpeta del backend:

```bash
cd backend
```

Crear un entorno virtual:

```bash
python -m venv .venv
```

Activar el entorno virtual:

```bash
source venv/bin/activate
```

En Windows:

```bash
venv\Scripts\activate
```

Instalar dependencias:

```bash
pip install -r requirements.txt
```

Configurar variables de entorno:

Crear un archivo `.env` en la carpeta `backend/`:

```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=tu-clave-secreta
JWT_SECRET_KEY=tu-clave-jwt
DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/skyship
FRONTEND_URL=http://localhost:3000
```

> Si PostgreSQL está en el puerto `5433`, usar:
>
> ```env
> DATABASE_URL=postgresql://postgres:tu_password@localhost:5433/skyship
> ```

Ejecutar el servidor:

```bash
python app.py
```

El backend estará disponible en:

```txt
http://localhost:8000
```

## Configuración del Frontend

Navegar a la carpeta del frontend:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

```bash
npm install axios
```

```bash
npm install recharts
```

Ejecutar la aplicación:

```bash
npm start
```

El frontend estará disponible en:

```txt
http://localhost:3000
```

### Administrador

- **Correo:** admin@skyship.com
- **Contraseña:** admin123

### Clientes

- **Correo:** juan@gmail.com
- **Contraseña:** cliente123

## Endpoints de la API

## Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |

## Envíos

Requiere autenticación.

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/envios` | Obtener envíos del usuario |
| POST | `/api/envios` | Crear nuevo envío |
| GET | `/api/envios/:id` | Obtener detalle de envío con tracking |

## Contacto

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/contacto` | Enviar mensaje de contacto |

## Administración

Requiere rol administrador.

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/admin/dashboard` | Obtener estadísticas del negocio |
| GET | `/api/admin/envios` | Listar todos los envíos |
| PUT | `/api/admin/envios/:id` | Actualizar envío |
| DELETE | `/api/admin/envios/:id` | Eliminar envío |
| GET | `/api/admin/usuarios` | Listar todos los usuarios |
| PUT | `/api/admin/usuarios/:id` | Actualizar usuario |
| DELETE | `/api/admin/usuarios/:id` | Eliminar usuario |

## Características de Seguridad

- **Contraseñas hasheadas:** Utilizamos bcrypt para el almacenamiento seguro de contraseñas.
- **Tokens JWT:** Autenticación stateless con expiración de 24 horas.
- **Protección de rutas:** Middleware que valida tokens en endpoints protegidos.
- **Control de acceso basado en roles:** Separación entre funcionalidades de cliente y administrador.
- **CORS configurado:** Solo permite peticiones desde el origen del frontend.
- **Validación de datos:** Tanto en frontend como backend para prevenir inyecciones.

## Estructura del Proyecto

```txt
skyship-express/
├── backend/
│   ├── app/
│   │   ├── models/          # Modelos de base de datos
│   │   ├── routes/          # Endpoints de la API
│   │   ├── utils/           # Validadores y decoradores
│   │   ├── __init__.py      # Factory de Flask
│   │   ├── config.py        # Configuración
│   │   └── database.py      # Instancia de SQLAlchemy
│   ├── app.py               # Punto de entrada
│   ├── seeds.py             # Script para datos de prueba
│   ├── requirements.txt     # Dependencias de Python
│   └── .env                 # Variables de entorno no incluidas en git
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── services/        # Servicios de API
│   │   ├── context/         # Context API AuthContext
│   │   └── styles/          # Estilos CSS
│   ├── public/
│   └── package.json
│
├── database/
│   └── tablas.sql           # Script de creación de tablas
│
└── README.md                # Este archivo
```

## Autor

**Diego Rivas**  
Universidad Rafael Landívar  
Facultad de Ingeniería  
Ingeniería en Informática y Sistemas  
Programación Web - Primer Semestre 2026
