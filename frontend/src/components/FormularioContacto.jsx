import { useState } from "react";
import contactoService from "../services/contactoService";
import validators from "../utils/validators";
import "../styles/formularios.css";

function FormularioContacto() {
  // Estado principal del formulario: aquí se guardan los valores escritos por el usuario
  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    mensaje: "",
  });

  // Estado para guardar errores de validación por campo
  const [errores, setErrores] = useState({});

  // Indica si el formulario fue enviado correctamente
  const [enviado, setEnviado] = useState(false);

  // Indica si la solicitud está en proceso para deshabilitar el botón mientras se envía
  const [cargando, setCargando] = useState(false);

  // Guarda un posible error general al intentar enviar el formulario
  const [errorEnvio, setErrorEnvio] = useState("");

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    // Actualiza dinámicamente el valor del campo que el usuario está escribiendo
    setFormulario({
      ...formulario,
      [name]: value,
    });

    // Limpia el error de ese campo específico cuando el usuario vuelve a escribir
    setErrores({
      ...errores,
      [name]: "",
    });

    // Reinicia mensajes de estado al detectar cambios nuevos en el formulario
    setEnviado(false);
    setErrorEnvio("");
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Usar validadores compartidos
    const errorNombre = validators.nombre(formulario.nombre);
    if (errorNombre) nuevosErrores.nombre = errorNombre;

    const errorCorreo = validators.email(formulario.correo);
    if (errorCorreo) nuevosErrores.correo = errorCorreo;

    const errorTelefono = validators.telefono(formulario.telefono);
    if (errorTelefono) nuevosErrores.telefono = errorTelefono;

    const errorMensaje = validators.mensaje(formulario.mensaje);
    if (errorMensaje) nuevosErrores.mensaje = errorMensaje;

    // Retorna el objeto con todos los errores encontrados
    return nuevosErrores;
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    // Primero se valida todo el formulario antes de intentar enviarlo
    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);
    setEnviado(false);
    setErrorEnvio("");

    // Si existen errores, se detiene el envío
    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    // Activa el estado de carga mientras se realiza la petición
    setCargando(true);

    try {
      // Envía los datos al backend Flask
      await contactoService.enviarContacto({
        nombre: formulario.nombre.trim(),
        correo: formulario.correo.trim(),
        telefono: formulario.telefono.trim(),
        mensaje: formulario.mensaje.trim(),
      });

      // Si todo salió bien, muestra mensaje de éxito y limpia el formulario
      setEnviado(true);
      setFormulario({
        nombre: "",
        correo: "",
        telefono: "",
        mensaje: "",
      });
      setErrores({});
    } catch (error) {
      // Si algo falla, muestra un mensaje general de error
      setErrorEnvio(
        error.response?.data?.message ||
        "Hubo un error al enviar el formulario. Intenta de nuevo."
      );
    } finally {
      // Quita el estado de carga sin importar si salió bien o mal
      setCargando(false);
    }
  };

  return (
    <form className="formulario-contacto" onSubmit={manejarSubmit}>
      <div className="formulario__grupo">
        <label htmlFor="nombre">NOMBRE COMPLETO</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          placeholder="Juan Pérez"
          value={formulario.nombre}
          onChange={manejarCambio}
        />
        {errores.nombre && (
          <p className="formulario__error">{errores.nombre}</p>
        )}
      </div>

      <div className="formulario__grupo">
        <label htmlFor="correo">CORREO ELECTRÓNICO</label>
        <input
          type="email"
          id="correo"
          name="correo"
          placeholder="juan@ejemplo.com"
          value={formulario.correo}
          onChange={manejarCambio}
        />
        {errores.correo && (
          <p className="formulario__error">{errores.correo}</p>
        )}
      </div>

      <div className="formulario__grupo">
        <label htmlFor="telefono">TELÉFONO</label>
        <input
          type="text"
          id="telefono"
          name="telefono"
          placeholder="+502 1234 5678"
          value={formulario.telefono}
          onChange={manejarCambio}
        />
        {errores.telefono && (
          <p className="formulario__error">{errores.telefono}</p>
        )}
      </div>

      <div className="formulario__grupo">
        <label htmlFor="mensaje">MENSAJE</label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows="5"
          placeholder="Cuéntanos sobre tus necesidades de envío..."
          value={formulario.mensaje}
          onChange={manejarCambio}
        ></textarea>
        {errores.mensaje && (
          <p className="formulario__error">{errores.mensaje}</p>
        )}
      </div>

      <button type="submit" className="formulario__boton" disabled={cargando}>
        {cargando ? "ENVIANDO..." : "ENVIAR MENSAJE"}
      </button>

      {/* Mensaje que aparece cuando el formulario se envía correctamente */}
      {enviado && (
        <p className="formulario__exito">
          Tu mensaje fue enviado exitosamente.
        </p>
      )}

      {/* Mensaje general de error si falla el envío */}
      {errorEnvio && <p className="formulario__error">{errorEnvio}</p>}
    </form>
  );
}

export default FormularioContacto;