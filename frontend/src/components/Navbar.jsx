// Importamos Link y hooks de React Router
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Importamos estilos del navbar
import "../styles/navbar.css";

function Navbar() {
  // Hook para saber en qué ruta estamos
  const location = useLocation();

  // Hook para navegar entre páginas
  const navigate = useNavigate();

  // Hook de autenticación
  const { isAuthenticated, user, logout } = useAuth();

  // Función para ir a una sección del Home
  const irASeccion = (idSeccion) => {
    if (location.pathname === "/") {
      const seccion = document.getElementById(idSeccion);

      if (seccion) {
        seccion.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/#${idSeccion}`);
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar__contenedor">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          SKYSHIP EXPRESS
        </Link>

        {/* Menú */}
        <nav className="navbar__menu">
          <button
            type="button"
            className="navbar__link navbar__link--button"
            onClick={() => irASeccion("servicios")}
          >
            Services
          </button>

          <button
            type="button"
            className="navbar__link navbar__link--button"
            onClick={() => irASeccion("cobertura")}
          >
            Coverage
          </button>

          <button
            type="button"
            className="navbar__link navbar__link--button"
            onClick={() => irASeccion("como-funciona")}
          >
            How It Works
          </button>

          <button
            type="button"
            className="navbar__link navbar__link--button"
            onClick={() => irASeccion("sobre-nosotros")}
          >
            About Us
          </button>

          <button
            type="button"
            className="navbar__link navbar__link--button"
            onClick={() => irASeccion("faq")}
          >
            FAQ
          </button>

          <button
            type="button"
            className="navbar__link navbar__link--button"
            onClick={() => irASeccion("contacto")}
          >
            Contact
          </button>

          {/* Mostrar según estado de autenticación */}
          {isAuthenticated ? (
            <>
              {/* Si es admin, mostrar link al panel */}
              {user?.rol === 'admin' ? (
                <Link to="/admin" className="navbar__link">
                  Admin Panel
                </Link>
              ) : (
                <Link to="/mis-envios" className="navbar__link">
                  My Shipments
                </Link>
              )}

              {/* Botón de cerrar sesión */}
              <button
                type="button"
                onClick={handleLogout}
                className="navbar__link navbar__link--button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Botón de cotizar */}
              <Link to="/cotizador" className="navbar__link">
                Request a Quote
              </Link>

              {/* Botón de login */}
              <Link to="/login" className="navbar__link">
                Login
              </Link>

              {/* Botón de registro */}
              <Link to="/registro" className="navbar__boton">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;