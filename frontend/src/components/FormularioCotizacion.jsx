// Importamos useState para manejar el estado del formulario y del resultado
import { useState } from "react";

// Importamos la función que calcula la cotización
import { calcularCotizacion } from "../utils/cotizador";

// Importamos estilos
import "../styles/formularios.css";
import "../styles/cotizador.css";

function FormularioCotizacion() {
  // Estado que guarda los valores del formulario
  const [formulario, setFormulario] = useState({
    origenDestino: "",
    peso: "",
    dimensiones: "",
    nivelServicio: "estandar",
    recoleccion: false,
    seguro: false,
  });

  // Estado para errores de validación
  const [errores, setErrores] = useState({});

  // Estado para guardar el resultado del cálculo
  const [resultado, setResultado] = useState(null);

  // Esta función actualiza el estado cada vez que el usuario cambia un input
  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;

    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Función para validar el formulario antes de calcular
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.origenDestino) {
      nuevosErrores.origenDestino = "Select an option.";
    }

    if (!formulario.peso) {
      nuevosErrores.peso = "Weight is required.";
    } else if (Number(formulario.peso) <= 0) {
      nuevosErrores.peso = "Weight must be greater than 0.";
    }

    return nuevosErrores;
  };

  // Función que se ejecuta al enviar el formulario
  const manejarSubmit = (e) => {
    e.preventDefault();

    // Validamos datos
    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);

    // Si hay errores, no seguimos
    if (Object.keys(nuevosErrores).length > 0) {
      setResultado(null);
      return;
    }

    // Calculamos la cotización
    const cotizacion = calcularCotizacion(formulario);

    // Guardamos el resultado
    setResultado(cotizacion);
  };

  return (
    <section className="seccion cotizador">
      <div className="contenedor">
        {/* Encabezado */}
        <div className="cotizador__encabezado">
          <p className="seccion__etiqueta">QUOTE CALCULATOR</p>
          <h1 className="seccion__titulo">Request Your Shipping Estimate</h1>
          <p className="seccion__descripcion">
            Get an estimated shipping cost and delivery time for your shipment.
          </p>
        </div>

        {/* Grid principal */}
        <div className="cotizador__grid">
          {/* Formulario */}
          <form className="formulario-cotizador" onSubmit={manejarSubmit}>
            <div className="formulario__grupo">
              <label htmlFor="origenDestino">ORIGIN AND DESTINATION</label>
              <select
                id="origenDestino"
                name="origenDestino"
                value={formulario.origenDestino}
                onChange={manejarCambio}
              >
                <option value="">Select an option</option>
                <option value="misma-ciudad">Same city</option>
                <option value="otro-departamento">Another department</option>
                <option value="internacional">International</option>
              </select>
              {errores.origenDestino && (
                <p className="formulario__error">{errores.origenDestino}</p>
              )}
            </div>

            <div className="formulario__grupo">
              <label htmlFor="peso">WEIGHT</label>
              <input
                type="number"
                id="peso"
                name="peso"
                placeholder="Enter package weight"
                value={formulario.peso}
                onChange={manejarCambio}
              />
              {errores.peso && (
                <p className="formulario__error">{errores.peso}</p>
              )}
            </div>

            <div className="formulario__grupo">
              <label htmlFor="dimensiones">DIMENSIONS (OPTIONAL)</label>
              <input
                type="text"
                id="dimensiones"
                name="dimensiones"
                placeholder="Length x Width x Height"
                value={formulario.dimensiones}
                onChange={manejarCambio}
              />
            </div>

            <div className="formulario__grupo">
              <label htmlFor="nivelServicio">SERVICE LEVEL</label>
              <select
                id="nivelServicio"
                name="nivelServicio"
                value={formulario.nivelServicio}
                onChange={manejarCambio}
              >
                <option value="estandar">Standard</option>
                <option value="expres">Express</option>
              </select>
            </div>

            <div className="formulario__grupo">
              <p className="formulario__subtitulo">EXTRAS</p>

              <label className="formulario__check">
                <input
                  type="checkbox"
                  name="recoleccion"
                  checked={formulario.recoleccion}
                  onChange={manejarCambio}
                />
                Home pickup
              </label>

              <label className="formulario__check">
                <input
                  type="checkbox"
                  name="seguro"
                  checked={formulario.seguro}
                  onChange={manejarCambio}
                />
                Insurance against loss and accidents
              </label>
            </div>

            <button type="submit" className="formulario__boton">
              CALCULATE ESTIMATE
            </button>
          </form>

          {/* Resultado */}
          <div className="cotizador__resultado">
            <h2 className="cotizador__resultado-titulo">Estimated Result</h2>

            {!resultado ? (
              <p className="cotizador__placeholder">
                Complete the form to view your estimated shipping cost and
                delivery time.
              </p>
            ) : (
              <div className="resultado">
                <div className="resultado__fila">
                  <span>Base cost</span>
                  <strong>${resultado.costoBase.toFixed(2)}</strong>
                </div>

                <div className="resultado__fila">
                  <span>Weight cost</span>
                  <strong>${resultado.costoPeso.toFixed(2)}</strong>
                </div>

                <div className="resultado__fila">
                  <span>Distance cost</span>
                  <strong>${resultado.costoDistancia.toFixed(2)}</strong>
                </div>

                <div className="resultado__fila">
                  <span>Extras</span>
                  <strong>${resultado.costoExtras.toFixed(2)}</strong>
                </div>

                <div className="resultado__fila resultado__fila--total">
                  <span>Total estimated cost</span>
                  <strong>${resultado.total.toFixed(2)}</strong>
                </div>

                <div className="resultado__tiempo">
                  <p className="resultado__tiempo-label">Estimated delivery</p>
                  <p className="resultado__tiempo-valor">
                    {resultado.tiempoEstimado}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FormularioCotizacion;