// Importamos navbar y footer reutilizables
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// Importamos el formulario de cotización
import FormularioCotizacion from "../components/FormularioCotizacion";

function Cotizador() {
  return (
    <>
      {/* Navbar superior */}
      <Navbar />

      {/* Formulario del cotizador */}
      <FormularioCotizacion />

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Cotizador;