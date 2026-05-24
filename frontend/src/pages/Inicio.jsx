// Importamos useEffect para reaccionar al hash de la URL
import { useEffect } from "react";
// Importamos useLocation para leer la URL actual
import { useLocation } from "react-router-dom";
// Importamos el navbar y footer para usarlos en la landing page
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// Importamos las secciones del Home
import SeccionInicio from "../components/SeccionInicio";
import SeccionServicios from "../components/SeccionServicios";
import SeccionCobertura from "../components/SeccionCobertura";
import SeccionComoFunciona from "../components/SeccionComoFunciona";
import SeccionSobreNosotros from "../components/SeccionSobreNosotros";
import SeccionFAQ from "../components/SeccionFAQ";
import SeccionContacto from "../components/SeccionContacto";

function Inicio() {
  // Leemos la ubicación actual
  const location = useLocation();

  // Si la URL trae hash, hacemos scroll a esa sección
  useEffect(() => {
    if (location.hash) {
      const idSeccion = location.hash.replace("#", "");
      const seccion = document.getElementById(idSeccion);

      if (seccion) {
        setTimeout(() => {
          seccion.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      {/* Barra de navegación superior */}
      <Navbar />
      {/* Hero principal */}
      <SeccionInicio />
      {/* Servicios */}
      <SeccionServicios />
      {/* Cobertura */}
      <SeccionCobertura />
      {/* Cómo funciona */}
      <SeccionComoFunciona />
      {/* Sobre nosotros */}
      <SeccionSobreNosotros />
      {/* FAQ */}
      <SeccionFAQ />
      {/* Contacto */}
      <SeccionContacto />
      {/* Footer */}
      <Footer />
    </>
  );
}

export default Inicio;