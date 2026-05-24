// Importamos estilos del footer
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__contenedor">
        {/* Marca */}
        <div className="footer__marca">
          <h2 className="footer__logo">AEROPAQ</h2>
          <p className="footer__texto">
            Premium courier services delivering luxury logistics with precision
            and excellence.
          </p>
        </div>

        {/* Columna de enlaces */}
        <div className="footer__columna">
          <h3 className="footer__titulo">Quick Links</h3>
          <a href="#servicios">Servicios</a>
          <a href="#cobertura">Cobertura</a>
          <a href="#como-funciona">Cómo Funciona</a>
          <a href="#sobre-nosotros">Sobre Nosotros</a>
        </div>

        {/* Columna de soporte */}
        <div className="footer__columna">
          <h3 className="footer__titulo">Support</h3>
          <a href="#faq">FAQ</a>
          <a href="#contacto">Contacto</a>
        </div>
      </div>

      {/* Parte inferior */}
      <div className="footer__bottom">
        <p>© 2026 AEROPAQ. All rights reserved. By Diego Manuel Rivas Arguijo</p>
      </div>
    </footer>
  );
}

export default Footer;