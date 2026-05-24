// Importamos los datos de servicios
import servicios from "../data/servicios";

// Importamos estilos generales de secciones
import "../styles/secciones.css";

function SeccionServicios() {
  return (
    <section className="seccion seccion-servicios" id="servicios">
      <div className="contenedor">
        {/* Encabezado con animación suave */}
        <div className="animacion-suave">
          <p className="seccion__etiqueta">OUR SERVICES</p>
          <h2 className="seccion__titulo">Tailored Excellence</h2>
          <p className="seccion__descripcion">
            Curated logistics solutions designed for the most discerning clients,
            combining speed, security, and sophistication.
          </p>
        </div>

        {/* Grid de tarjetas */}
        <div className="servicios__grid">
          {servicios.map((servicio, index) => (
            <article
              key={servicio.id}
              className={`servicio__card animacion-suave animacion-delay-${index + 1}`}
            >
              <h3 className="servicio__titulo">{servicio.titulo}</h3>
              <p className="servicio__texto">{servicio.descripcion}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SeccionServicios;