// Importamos Link para mandar al usuario a la página del cotizador
import { Link } from "react-router-dom";

// Importamos estilos específicos de la sección de inicio
import "../styles/inicio.css";

// Importamos la imagen local del avión
import heroLuxury from "../assets/images/hero-luxury.jpg";

function SeccionInicio() {
  return (
    <section className="hero">
      <div className="contenedor hero__contenedor">
        {/* Imagen decorativa de fondo dentro del hero */}
        <img
          src={heroLuxury}
          alt="Luxury airplane background"
          className="hero__fondo-avion"
        />

        {/* Contenido principal */}
        <div className="hero__contenido">
          <p className="hero__etiqueta">PREMIUM COURIER SERVICE</p>

          <h1 className="hero__titulo">
            Luxury Shipping
            <br />
            to Guatemala
          </h1>

          <p className="hero__descripcion">
            Experience unparalleled premium courier services from anywhere in
            the world to Guatemala. Swift, secure, and sophisticated logistics
            for discerning clients.
          </p>

          <Link to="/cotizador" className="hero__boton">
            REQUEST A QUOTE
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SeccionInicio;