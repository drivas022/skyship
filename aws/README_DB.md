# Acceso a la Base de Datos RDS - SkyShip Express

Este documento resume cómo conectarse a la base de datos PostgreSQL de SkyShip Express en AWS RDS desde la terminal.

---

## 1. Verificar mi IP pública actual

Antes de conectarse a la base de datos, es importante verificar la IP pública actual de la red donde estoy conectado:

```bash
curl -4 ifconfig.me
```

Esto devolverá una IP similar a:

```txt
190.148.157.130
```

Si estoy usando datos del celular, otra red WiFi o una red que cambia IP constantemente, esta IP puede cambiar.

---

## 2. Actualizar la IP en AWS si cambia

Si la IP cambia, se debe actualizar la regla de entrada en el Security Group de RDS.

Ruta en AWS:

```txt
AWS → RDS → skyship-db → Conectividad y seguridad → skyship-db-sg
```

Luego entrar a:

```txt
Reglas de entrada → Editar reglas de entrada
```

La regla para mi computadora debe quedar así:

```txt
Tipo: PostgreSQL
Protocolo: TCP
Puerto: 5432
Origen: TU_IP_ACTUAL/32
```

Ejemplo:

```txt
PostgreSQL | TCP | 5432 | 190.148.157.130/32
```

No borrar la regla del backend de Elastic Beanstalk:

```txt
PostgreSQL | TCP | 5432 | sg-0a2b9f28bd82bf083
```

Esa regla permite que el backend publicado en AWS se conecte a la base de datos.

---

## 3. Comando para entrar a la base de datos

Desde la terminal, ejecutar:

```bash
psql -h skyship-db.cvos4ec28nzc.us-east-2.rds.amazonaws.com -U postgres -d skyship -p 5432
```

Cuando pida contraseña, usar:

```txt
SkyShip.2o2G_.
```

Nota: al escribir o pegar la contraseña, la terminal no muestra caracteres, pero sí la está recibiendo. Luego presionar `Enter`.

---

## 4. Ver usuarios registrados

Dentro de PostgreSQL, ejecutar:

```sql
SELECT id, nombre, correo, rol, activo
FROM users;
```

---

## 5. Hacer admin a mi usuario

Para asignar el rol de administrador a mi usuario:

```sql
UPDATE users
SET rol = 'admin'
WHERE correo = 'dmrivasa@correo.url.edu.gt';
```

Para verificar el cambio:

```sql
SELECT id, nombre, correo, rol, activo
FROM users
WHERE correo = 'dmrivasa@correo.url.edu.gt';
```

El campo `rol` debe aparecer como:

```txt
admin
```

---

## 6. Salir de PostgreSQL

Para salir de la consola de PostgreSQL:

```sql
\q
```

---

## Nota importante

Si cambio de red o mi IP pública cambia, debo actualizar la regla de entrada de RDS con la nueva IP usando:

```bash
curl -4 ifconfig.me
```

El backend seguirá funcionando aunque mi IP cambie, porque Elastic Beanstalk tiene su propia regla de acceso mediante su Security Group.
