# Aurevia Courier

## Documentación

### Tecnologías y versiones

Este proyecto fue desarrollado utilizando las siguientes tecnologías:

- Node.js
- npm
- React
- JavaScript
- HTML
- CSS
- Google Sheets
- Google Apps Script

**Versiones recomendadas:**
- Node.js 18 o superior
- npm 9 o superior

---

### Cómo ejecutar el proyecto

Sigue estos pasos para ejecutar el proyecto de forma local:

1. Clona el repositorio:
```bash
git clone <REPOSITORY_URL>
```

2. Ingresa a la carpeta del proyecto:
```bash
cd aurevia-courier
```

3. Instala las dependencias:
```bash
npm install
```

4. Inicia el servidor de desarrollo:
```bash
npm start
```

5. Abre el proyecto en tu navegador:
```bash
http://localhost:3000
```

---

### Decisiones técnicas relevantes

- La interfaz fue dividida en componentes reutilizables de React para mantener el proyecto organizado y facilitar su mantenimiento.
- El contenido estático, como servicios, preguntas frecuentes y cobertura, fue separado en archivos de datos para mantener una estructura más limpia.
- Los estilos fueron divididos por secciones y componentes para mejorar la legibilidad y facilitar futuras actualizaciones.
- El formulario de contacto incluye validación de campos antes de enviar la información.
- Las solicitudes de contacto se almacenan en Google Sheets por medio de Google Apps Script.
- El proyecto mantiene un enfoque visual limpio y elegante, alineado con la identidad de la marca Aurevia Courier.

---

### Estructura del proyecto

```bash
aurevia-courier/
├── node_modules/
├── public/
│   ├── _redirects
│   ├── aurevia.png
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   │       └── hero-luxury.jpg
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── FormularioContacto.jsx
│   │   ├── FormularioCotizacion.jsx
│   │   ├── Navbar.jsx
│   │   ├── SeccionCobertura.jsx
│   │   ├── SeccionComoFunciona.jsx
│   │   ├── SeccionContacto.jsx
│   │   ├── SeccionFAQ.jsx
│   │   ├── SeccionInicio.jsx
│   │   ├── SeccionServicios.jsx
│   │   └── SeccionSobreNosotros.jsx
│   ├── data/
│   │   ├── cobertura.js
│   │   ├── faq.js
│   │   └── servicios.js
│   ├── pages/
│   │   ├── Cotizador.jsx
│   │   └── Inicio.jsx
│   ├── styles/
│   │   ├── cotizador.css
│   │   ├── footer.css
│   │   ├── formularios.css
│   │   ├── globales.css
│   │   ├── inicio.css
│   │   ├── navbar.css
│   │   └── secciones.css
│   ├── utils/
│   │   └── cotizador.js
│   ├── App.js
│   ├── index.css
│   └── index.js
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

---

### Explicación breve de cada archivo y carpeta

#### Archivos raíz

- **README.md:** contiene la documentación general del proyecto.
- **package.json:** almacena la configuración del proyecto, dependencias y scripts.
- **package-lock.json:** guarda las versiones exactas de las dependencias instaladas.
- **.gitignore:** indica qué archivos o carpetas no deben subirse a Git.
- **node_modules/:** contiene todas las dependencias instaladas que utiliza el proyecto.

#### public/

- **public/:** contiene archivos estáticos que React carga directamente.
- **_redirects:** archivo utilizado para manejar redirecciones en entornos de despliegue.
- **aurevia.png:** logo o ícono principal utilizado por el sitio web.
- **index.html:** archivo HTML base donde se monta la aplicación React.
- **manifest.json:** define metadatos de la aplicación web, como nombre, íconos y comportamiento en dispositivos compatibles.
- **robots.txt:** proporciona instrucciones a los motores de búsqueda y rastreadores web.

#### src/

- **src/:** contiene el código fuente principal de la aplicación.

#### src/assets/

- **assets/:** almacena recursos visuales utilizados en la interfaz.
- **icons/:** carpeta reservada para los íconos usados en todo el sitio.
- **images/:** almacena archivos de imagen utilizados en el proyecto.
- **hero-luxury.jpg:** imagen principal utilizada en la sección inicial o hero.

#### src/components/

- **components/:** contiene componentes reutilizables de la interfaz usados en todo el sitio web.
- **Footer.jsx:** renderiza el pie de página con información final y contenido de apoyo.
- **FormularioContacto.jsx:** componente del formulario de contacto con validaciones y conexión a Google Sheets.
- **FormularioCotizacion.jsx:** componente del formulario de cotización para usuarios interesados en solicitar información de precios.
- **Navbar.jsx:** barra de navegación superior para desplazarse por el sitio.
- **SeccionCobertura.jsx:** sección que presenta la cobertura del servicio.
- **SeccionComoFunciona.jsx:** sección que explica paso a paso cómo funciona el servicio de courier.
- **SeccionContacto.jsx:** sección que contiene el área de contacto y muestra el formulario.
- **SeccionFAQ.jsx:** sección de preguntas frecuentes.
- **SeccionInicio.jsx:** sección principal o hero que se muestra al inicio del sitio web.
- **SeccionServicios.jsx:** sección que presenta los principales servicios que ofrece Aurevia Courier.
- **SeccionSobreNosotros.jsx:** sección que explica la identidad de la marca y presenta el negocio.

#### src/data/

- **data/:** almacena datos estáticos separados de los componentes visuales.
- **cobertura.js:** contiene los datos utilizados en la sección de cobertura.
- **faq.js:** contiene las preguntas y respuestas mostradas en la sección de preguntas frecuentes.
- **servicios.js:** contiene la información mostrada en la sección de servicios.

#### src/pages/

- **pages/:** contiene las vistas principales de la aplicación.
- **Cotizador.jsx:** página enfocada en la vista de cotización o contenido relacionado con cotizaciones.
- **Inicio.jsx:** página principal que organiza y muestra las secciones del sitio web.

#### src/styles/

- **styles/:** almacena los archivos CSS utilizados para dar estilo a la aplicación.
- **cotizador.css:** estilos para la página o formulario de cotización.
- **footer.css:** estilos para el componente de pie de página.
- **formularios.css:** estilos compartidos para los formularios.
- **globales.css:** estilos globales como tipografía, colores, espaciados y reglas reutilizables.
- **inicio.css:** estilos para la sección principal de inicio.
- **navbar.css:** estilos para la barra de navegación.
- **secciones.css:** estilos compartidos utilizados por el resto de secciones del sitio.

#### src/utils/

- **utils/:** contiene lógica auxiliar o funciones reutilizables.
- **cotizador.js:** almacena lógica utilitaria relacionada con cálculos de cotización o comportamiento del formulario de cotización.

#### Archivos principales de la aplicación

- **App.js:** componente principal que define la estructura general de la aplicación React.
- **index.css:** archivo CSS base que se carga al iniciar la aplicación.
- **index.js:** punto de entrada que renderiza la aplicación React en el DOM.

---

### Archivos principales

- **App.js:** organiza la estructura principal de la aplicación.
- **Inicio.jsx:** renderiza las secciones principales de la landing page.
- **Cotizador.jsx:** maneja la vista de cotización.
- **FormularioContacto.jsx:** valida y envía los datos de contacto a Google Sheets.
- **FormularioCotizacion.jsx:** gestiona el formulario de solicitud de cotización.
- **cotizador.js:** contiene la lógica auxiliar relacionada con las cotizaciones.

---

### Flujo del sitio web

El sitio web sigue un flujo simple de tipo landing page:

1. **Inicio**
2. **Sobre nosotros**
3. **Servicios**
4. **Cómo funciona**
5. **Cobertura**
6. **Preguntas frecuentes**
7. **Formularios de cotización y contacto**
8. **Footer**

El sitio está diseñado para que el usuario conozca la marca, entienda el servicio y pueda enviar una solicitud fácilmente.

---

### Integración del formulario de contacto

El formulario de contacto valida los siguientes campos:

- Nombre
- Correo electrónico
- Número de teléfono
- Mensaje

Cuando el formulario se envía, los datos se mandan desde React a un endpoint de Google Apps Script. Luego, el script almacena cada envío en un documento de Google Sheets.
