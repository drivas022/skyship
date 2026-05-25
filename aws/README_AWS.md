# README - Despliegue en AWS de SkyShip Express

## Proyecto

**SkyShip Express** es una plataforma web para la gestión de envíos y paquetería. El proyecto está compuesto por frontend, backend y base de datos, desplegados en servicios de Amazon Web Services.

El objetivo del despliegue fue publicar la aplicación en internet y permitir que el frontend consuma una API backend conectada a una base de datos PostgreSQL en la nube.

---

## Arquitectura general en AWS

La arquitectura utilizada fue la siguiente:

```txt
Usuario
  ↓
AWS Amplify Hosting
Frontend React
  ↓
Amazon API Gateway
Puente HTTPS para consumir la API
  ↓
AWS Elastic Beanstalk
Backend Flask con Gunicorn
  ↓
Amazon RDS
Base de datos PostgreSQL
```

---

## Servicios de AWS utilizados

### 1. AWS Amplify

Se utilizó **AWS Amplify Hosting** para desplegar el frontend desarrollado en React.

Amplify se conectó directamente al repositorio de GitHub del proyecto y se configuró para trabajar con una estructura tipo monorepo, donde el frontend se encuentra dentro de la carpeta:

```txt
frontend
```

Configuración principal:

```txt
Framework: React
Branch: main
App root: frontend
Build command: npm run build
Output directory: build
```

Variable de entorno configurada en Amplify:

```txt
REACT_APP_API_URL=https://j5kq9e9mbg.execute-api.us-east-2.amazonaws.com/api
```

Esta variable permite que el frontend consuma la API publicada mediante API Gateway.

URL del frontend:

```txt
https://main.d21m0ssbh7zpd.amplifyapp.com
```

---

### 2. AWS Elastic Beanstalk

Se utilizó **AWS Elastic Beanstalk** para publicar el backend desarrollado con Flask.

El backend fue preparado usando:

```txt
Flask
Gunicorn
Procfile
wsgi.py
requirements.txt
```

La aplicación fue desplegada como un entorno de servidor web con Python.

Configuración general:

```txt
Application name: skyship-backend
Environment name: Skyship-backend-env
Platform: Python
Environment type: Single instance
Instance type: t3.micro
Proxy server: Nginx
```

El archivo `Procfile` utilizado para iniciar el backend fue:

```txt
web: gunicorn wsgi:application
```

La URL generada por Elastic Beanstalk fue:

```txt
http://skyship-backend.us-east-2.elasticbeanstalk.com
```

Elastic Beanstalk ejecuta internamente el backend Flask mediante Gunicorn y lo expone a través de Nginx.

Variables de entorno configuradas en Elastic Beanstalk:

```txt
FLASK_ENV=production
SECRET_KEY=<clave-secreta-de-produccion>
JWT_SECRET_KEY=<clave-jwt-de-produccion>
DATABASE_URL=postgresql://postgres:<password>@skyship-db.cvos4ec28nzc.us-east-2.rds.amazonaws.com:5432/skyship
FRONTEND_URL=https://main.d21m0ssbh7zpd.amplifyapp.com
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=skyshipgt@gmail.com
SMTP_PASSWORD=<contraseña-de-aplicación>
SMTP_FROM_NAME=SkyShip GT
```

> Nota: Las contraseñas reales no deben subirse al repositorio ni escribirse directamente en el README público.

---

### 3. Amazon RDS

Se utilizó **Amazon RDS** para alojar la base de datos PostgreSQL del proyecto.

Configuración principal:

```txt
Motor: PostgreSQL
Nombre de instancia: skyship-db
Base de datos inicial: skyship
Usuario maestro: postgres
Puerto: 5432
Tipo de instancia: db.t4g.micro
Acceso público: Sí
```

Endpoint de la base de datos:

```txt
skyship-db.cvos4ec28nzc.us-east-2.rds.amazonaws.com
```

La conexión utilizada por el backend tiene el siguiente formato:

```txt
postgresql://postgres:<password>@skyship-db.cvos4ec28nzc.us-east-2.rds.amazonaws.com:5432/skyship
```

Las tablas fueron creadas ejecutando el archivo `schema.sql` desde la terminal con `psql`:

```bash
psql -h skyship-db.cvos4ec28nzc.us-east-2.rds.amazonaws.com -U postgres -d skyship -p 5432 -f schema.sql
```

Tablas principales creadas:

```txt
users
envios
tracking_envios
contactos
```

---

### 4. Amazon API Gateway

Se utilizó **Amazon API Gateway** para resolver el problema de conexión entre el frontend HTTPS de Amplify y el backend HTTP de Elastic Beanstalk.

El navegador bloqueaba las peticiones porque el frontend estaba cargando por HTTPS y el backend respondía por HTTP. Para evitar el error de Mixed Content, se creó una API HTTP en API Gateway que funciona como puente HTTPS.

Flujo final:

```txt
Amplify HTTPS
  ↓
API Gateway HTTPS
  ↓
Elastic Beanstalk HTTP
```

Configuración principal de API Gateway:

```txt
API name: skyship-api
API type: HTTP API
Stage: $default
Auto-deploy: enabled
Route: ANY /api/{proxy+}
Integration: http://skyship-backend.us-east-2.elasticbeanstalk.com/api/{proxy}
```

URL de invocación de API Gateway:

```txt
https://j5kq9e9mbg.execute-api.us-east-2.amazonaws.com
```

URL base usada por el frontend:

```txt
https://j5kq9e9mbg.execute-api.us-east-2.amazonaws.com/api
```

Configuración CORS aplicada:

```txt
Allowed origin:
https://main.d21m0ssbh7zpd.amplifyapp.com

Allowed methods:
GET, POST, PUT, PATCH, DELETE, OPTIONS

Allowed headers:
content-type, authorization

Allow credentials:
No
```

---

## Configuración de seguridad

Para que Elastic Beanstalk pudiera conectarse a RDS, se configuró el grupo de seguridad de la base de datos.

El Security Group de RDS permite:

```txt
PostgreSQL | TCP | 5432 | IP personal del desarrollador /32
PostgreSQL | TCP | 5432 | Security Group de Elastic Beanstalk
```

La regla con la IP personal permite conectarse manualmente desde la computadora usando `psql`, pgAdmin o DBeaver.

La regla con el Security Group de Elastic Beanstalk permite que el backend publicado se conecte a la base de datos.

Importante:

```txt
Si cambia la IP personal del desarrollador, solo se afecta el acceso manual a la base de datos.
La aplicación publicada sigue funcionando porque usa el Security Group de Elastic Beanstalk.
```

---

## Comandos útiles para administración

### Ver IP pública actual

```bash
curl -4 ifconfig.me
```

Si esta IP cambia, se debe actualizar la regla de entrada en el Security Group de RDS para poder conectarse desde la computadora local.

### Conectarse a RDS con psql

```bash
psql -h skyship-db.cvos4ec28nzc.us-east-2.rds.amazonaws.com -U postgres -d skyship -p 5432
```

### Ver tablas en PostgreSQL

```sql
\dt
```

### Ver usuarios registrados

```sql
SELECT id, nombre, correo, rol, activo
FROM users;
```

### Convertir un usuario en administrador

```sql
UPDATE users
SET rol = 'admin'
WHERE correo = 'dmrivasa@correo.url.edu.gt';
```

### Salir de PostgreSQL

```sql
\q
```

---

## Problemas encontrados y soluciones

### 1. Error de Mixed Content

Problema:

```txt
El frontend estaba en HTTPS y el backend en HTTP.
```

Solución:

```txt
Se creó una API HTTP en Amazon API Gateway para servir como puente HTTPS hacia el backend de Elastic Beanstalk.
```

---

### 2. Error de conexión a RDS

Problema:

```txt
El backend no podía conectarse a PostgreSQL porque el Security Group de RDS solo permitía la IP local del desarrollador.
```

Solución:

```txt
Se agregó una regla de entrada en el Security Group de RDS permitiendo el Security Group de Elastic Beanstalk en el puerto 5432.
```

---

### 3. Error `relation "users" does not exist`

Problema:

```txt
La base de datos RDS estaba creada, pero no tenía las tablas del sistema.
```

Solución:

```txt
Se ejecutó el archivo schema.sql en RDS usando psql para crear las tablas, índices, funciones, triggers y datos iniciales.
```

---

## URLs finales del despliegue

Frontend:

```txt
https://main.d21m0ssbh7zpd.amplifyapp.com
```

API Gateway:

```txt
https://j5kq9e9mbg.execute-api.us-east-2.amazonaws.com/api
```

Backend Elastic Beanstalk:

```txt
http://skyship-backend.us-east-2.elasticbeanstalk.com
```

Base de datos RDS:

```txt
skyship-db.cvos4ec28nzc.us-east-2.rds.amazonaws.com:5432
```
