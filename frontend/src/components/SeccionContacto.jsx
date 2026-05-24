// Importamos estilos de secciones y formularios
import "../styles/secciones.css";
import "../styles/formularios.css";

// Importamos el formulario separado
import FormularioContacto from "./FormularioContacto";

function SeccionContacto() {
  return (
    <section className="seccion seccion-contacto" id="contacto">
      <div className="contenedor">
        {/* Encabezado */}
        <p className="seccion__etiqueta">CONTACT</p>
        <h2 className="seccion__titulo">Get in Touch</h2>
        <p className="seccion__descripcion">
          Our concierge team is ready to assist you with your premium shipping
          needs.
        </p>

        {/* Grid de contacto */}
        <div className="contacto">
          {/* Columna izquierda con datos */}
          <div className="contacto__info">
            <div className="contacto__bloque">
              <p className="contacto__label">EMAIL</p>
              <p className="contacto__valor">dmrivasa@correo.url.edu.gt</p>
            </div>

            <div className="contacto__bloque">
              <p className="contacto__label">PHONE</p>
              <p className="contacto__valor">+502 5412 2045</p>
            </div>

            <div className="contacto__bloque">
              <p className="contacto__label">LOCATION</p>
              <p className="contacto__valor">Guatemala City, Guatemala</p>
            </div>

            <p className="contacto__nota">
              Operating hours: Monday - Friday, 9:00 AM - 6:00 PM.
            </p>
          </div>

          {/* Columna derecha con formulario */}
          <FormularioContacto />
        </div>
      </div>
    </section>
  );
}

export default SeccionContacto;