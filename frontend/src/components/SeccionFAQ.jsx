// Importamos useState porque vamos a abrir y cerrar preguntas
import { useState } from "react";

// Importamos la data del FAQ
import faq from "../data/faq";

// Importamos estilos
import "../styles/secciones.css";

function SeccionFAQ() {
  // Guardamos qué pregunta está abierta
  const [activa, setActiva] = useState(null);

  // Esta función abre o cierra una pregunta
  const togglePregunta = (id) => {
    if (activa === id) {
      setActiva(null);
    } else {
      setActiva(id);
    }
  };

  return (
    <section className="seccion seccion-faq" id="faq">
      <div className="contenedor">
        <p className="seccion__etiqueta">FAQ</p>
        <h2 className="seccion__titulo">Frequently Asked Questions</h2>
        <p className="seccion__descripcion">
          Answers to common inquiries about our premium courier services.
        </p>

        <div className="faq">
          {faq.map((item) => (
            <article key={item.id} className="faq__item">
              {/* Botón que abre y cierra la respuesta */}
              <button
                className="faq__pregunta"
                onClick={() => togglePregunta(item.id)}
              >
                <span>{item.pregunta}</span>
                <span>{activa === item.id ? "−" : "+"}</span>
              </button>

              {/* Solo mostramos la respuesta si esa pregunta está activa */}
              {activa === item.id && (
                <div className="faq__respuesta">
                  <p>{item.respuesta}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SeccionFAQ;