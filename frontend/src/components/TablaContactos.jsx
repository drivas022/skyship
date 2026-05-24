import React, { useState } from 'react';
import '../styles/tabla-contactos.css';

const TablaContactos = ({ contactos, onResponder, onMarcarLeido, onDelete }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [enviando, setEnviando] = useState(false);

  const abrirModalRespuesta = (contacto) => {
    setContactoSeleccionado(contacto);
    setRespuesta('');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setContactoSeleccionado(null);
    setRespuesta('');
  };

  const handleEnviarRespuesta = async (e) => {
    e.preventDefault();
    
    if (!respuesta.trim()) {
      alert('Por favor escribe una respuesta');
      return;
    }

    setEnviando(true);
    try {
      await onResponder(contactoSeleccionado.id, respuesta);
      cerrarModal();
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
    } finally {
      setEnviando(false);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      nuevo: { label: 'NUEVO', className: 'estado-nuevo' },
      leido: { label: 'LEÍDO', className: 'estado-leido' },
      respondido: { label: 'RESPONDIDO', className: 'estado-respondido' }
    };
    
    const badge = badges[estado] || badges.nuevo;
    return <span className={`estado-badge ${badge.className}`}>{badge.label}</span>;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleString('es-GT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (contactos.length === 0) {
    return (
      <div className="tabla-vacia">
        <p>No hay mensajes de contacto</p>
      </div>
    );
  }

  return (
    <>
      <div className="tabla-container">
        <table className="tabla-contactos">
          <thead>
            <tr>
              <th>ESTADO</th>
              <th>NOMBRE</th>
              <th>CORREO</th>
              <th>TELÉFONO</th>
              <th>MENSAJE</th>
              <th>FECHA</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {contactos.map((contacto) => (
              <tr key={contacto.id}>
                <td>{getEstadoBadge(contacto.estado)}</td>
                <td>{contacto.nombre}</td>
                <td>{contacto.correo}</td>
                <td>{contacto.telefono}</td>
                <td className="mensaje-cell">
                  <div className="mensaje-preview">{contacto.mensaje}</div>
                </td>
                <td>{formatearFecha(contacto.created_at)}</td>
                <td>
                  <div className="acciones-buttons">
                    {contacto.estado === 'nuevo' && (
                      <button
                        className="btn-tabla btn-marcar-leido"
                        onClick={() => onMarcarLeido(contacto.id)}
                        title="Marcar como leído"
                      >
                        👁️
                      </button>
                    )}
                    {contacto.estado !== 'respondido' && (
                      <button
                        className="btn-tabla btn-responder"
                        onClick={() => abrirModalRespuesta(contacto)}
                        title="Responder"
                      >
                        ✉️
                      </button>
                    )}
                    <button
                      className="btn-tabla btn-eliminar"
                      onClick={() => onDelete(contacto.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de respuesta */}
      {modalAbierto && contactoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal modal-respuesta" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__titulo">Responder Contacto</h2>
            </div>

            <div className="contacto-info">
              <p><strong>De:</strong> {contactoSeleccionado.nombre}</p>
              <p><strong>Correo:</strong> {contactoSeleccionado.correo}</p>
              <p><strong>Mensaje original:</strong></p>
              <div className="mensaje-original">
                {contactoSeleccionado.mensaje}
              </div>
            </div>

            <form onSubmit={handleEnviarRespuesta} className="modal__form">
              <div className="formulario__grupo">
                <label>Tu respuesta:</label>
                <textarea
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  rows="6"
                  placeholder="Escribe tu respuesta aquí..."
                  required
                  disabled={enviando}
                />
              </div>

              <div className="modal__footer">
                <button
                  type="button"
                  className="modal__boton modal__boton--cancelar"
                  onClick={cerrarModal}
                  disabled={enviando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modal__boton modal__boton--guardar"
                  disabled={enviando}
                >
                  {enviando ? 'Enviando...' : 'Enviar Respuesta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TablaContactos;