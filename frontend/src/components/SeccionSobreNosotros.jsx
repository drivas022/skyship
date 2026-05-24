// Importamos estilos generales de secciones
import "../styles/secciones.css";

function SeccionSobreNosotros() {
  return (
    <section className="seccion seccion-sobre-nosotros" id="sobre-nosotros">
      <div className="contenedor">
        {/* Texto pequeño */}
        <p className="seccion__etiqueta">ABOUT US</p>

        {/* Título */}
        <h2 className="seccion__titulo">Our Story</h2>

        {/* Dos bloques principales */}
        <div className="sobre-nosotros__grid">
          <article className="sobre-nosotros__bloque">
            <p className="sobre-nosotros__subtitulo">MISSION</p>
            <h3 className="sobre-nosotros__titulo">
              Redefining Luxury Logistics
            </h3>
            <p className="sobre-nosotros__texto">
              Aurevia was founded to elevate global luxury shipping standards
              with a service built for clients who expect precision, elegance,
              and trust in every detail.
            </p>
          </article>

          <article className="sobre-nosotros__bloque">
            <p className="sobre-nosotros__subtitulo">VISION</p>
            <h3 className="sobre-nosotros__titulo">
              The Future of Premium Shipping
            </h3>
            <p className="sobre-nosotros__texto">
              We envision a world where international logistics feels effortless,
              secure, and exclusive — connecting global markets to Guatemala
              through a refined customer experience.
            </p>
          </article>
        </div>

        {/* Valores */}
        <div className="valores">
          <h3 className="valores__titulo-principal">Our Values</h3>

          <div className="valores__grid">
            <article className="valor__card">
              <h4 className="valor__titulo">Integrity</h4>
              <p className="valor__texto">
                Luxury logistics built on trust, transparency, and professional
                care.
              </p>
            </article>

            <article className="valor__card">
              <h4 className="valor__titulo">Precision</h4>
              <p className="valor__texto">
                Meticulous attention to detail ensures every shipment is handled
                correctly.
              </p>
            </article>

            <article className="valor__card">
              <h4 className="valor__titulo">Discretion</h4>
              <p className="valor__texto">
                Confidential handling of premium purchases and personal
                shipments.
              </p>
            </article>

            <article className="valor__card">
              <h4 className="valor__titulo">Excellence</h4>
              <p className="valor__texto">
                Striving for the highest standards in logistics and customer
                experience.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SeccionSobreNosotros;