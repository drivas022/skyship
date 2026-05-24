// Importamos la data de cobertura
import cobertura from "../data/cobertura";

// Importamos estilos generales
import "../styles/secciones.css";

function SeccionCobertura() {
  return (
    <section className="seccion seccion-cobertura" id="cobertura">
      <div className="contenedor">
        {/* Encabezado de la sección */}
        <div className="seccion-cobertura__encabezado animacion-fade-up">
          <p className="seccion__etiqueta">COVERAGE</p>

          <h2 className="seccion__titulo">Global to Local</h2>

          <p className="seccion__descripcion seccion__descripcion--ancha">
            From anywhere in the world to every corner of Guatemala. Our network
            ensures your shipments arrive with precision and care.
          </p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="cobertura__grid">
          {cobertura.map((item) => (
            <article key={item.id} className="cobertura__card">
              <h3 className="cobertura__numero">{item.numero}</h3>
              <h4 className="cobertura__titulo">{item.titulo}</h4>
              <p className="cobertura__texto">{item.descripcion}</p>
            </article>
          ))}
        </div>

        {/* Imagen decorativa */}
        <div className="cobertura__imagen">
          <div className="cobertura__overlay">
            Delivering excellence to the heart of Central America.
          </div>
        </div>
      </div>
    </section>
  );
}

export default SeccionCobertura;