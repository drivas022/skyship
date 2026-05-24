// Importamos estilos generales de las secciones
import "../styles/secciones.css";

function SeccionComoFunciona() {
  return (
    <section className="seccion seccion-proceso" id="como-funciona">
      <div className="contenedor">
        {/* Título principal de la sección */}
        <h2 className="seccion__titulo">How It Works</h2>

        {/* Texto introductorio */}
        <p className="seccion__descripcion">
          A seamless journey from collection to delivery, designed with
          precision and executed with excellence.
        </p>

        {/* Línea de pasos */}
        <div className="proceso">
          <div className="proceso__item proceso__item--izquierda">
            <span className="proceso__numero">01</span>
            <div className="proceso__contenido">
              <h3 className="proceso__titulo">Request</h3>
              <p className="proceso__texto">
                Submit your shipping requirements through our quote request or
                contact our concierge team directly.
              </p>
            </div>
          </div>

          <div className="proceso__item proceso__item--derecha">
            <span className="proceso__numero">02</span>
            <div className="proceso__contenido">
              <h3 className="proceso__titulo">Pickup</h3>
              <p className="proceso__texto">
                Our professional courier collects your package from any location
                worldwide with white-glove service.
              </p>
            </div>
          </div>

          <div className="proceso__item proceso__item--izquierda">
            <span className="proceso__numero">03</span>
            <div className="proceso__contenido">
              <h3 className="proceso__titulo">Dispatch</h3>
              <p className="proceso__texto">
                Your shipment travels via premium air or ground logistics with
                tracking and carefully managed handling.
              </p>
            </div>
          </div>

          <div className="proceso__item proceso__item--derecha">
            <span className="proceso__numero">04</span>
            <div className="proceso__contenido">
              <h3 className="proceso__titulo">Delivery</h3>
              <p className="proceso__texto">
                Secure delivery to your selected address in Guatemala with
                signature confirmation and direct proof of delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SeccionComoFunciona;