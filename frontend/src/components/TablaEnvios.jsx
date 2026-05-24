import '../styles/admin.css';

/**
 * Tabla de envíos para el panel de administrador
 * Con opciones de editar y eliminar
 */
const TablaEnvios = ({ envios, onEdit, onDelete }) => {
  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-GT');
  };

  return (
    <div className="tabla-container">
      <table className="tabla-admin">
        <thead>
          <tr>
            <th>Código</th>
            <th>Usuario</th>
            <th>Destino</th>
            <th>Estado</th>
            <th>Costo</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {envios.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                No hay envíos registrados
              </td>
            </tr>
          ) : (
            envios.map((envio) => (
              <tr key={envio.id}>
                <td>{envio.codigo_guia}</td>
                <td>{envio.usuario_nombre || 'N/A'}</td>
                <td>{envio.destino}</td>
                <td>
                  <span className={`tabla-admin__badge tabla-admin__badge--${envio.estado?.toLowerCase()}`}>
                    {envio.estado}
                  </span>
                </td>
                <td>Q{parseFloat(envio.costo).toFixed(2)}</td>
                <td>{formatearFecha(envio.fecha_creacion)}</td>
                <td>
                  <div className="tabla-admin__acciones">
                    <button
                      onClick={() => onEdit(envio)}
                      className="tabla-admin__boton tabla-admin__boton--editar"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(envio.id)}
                      className="tabla-admin__boton tabla-admin__boton--eliminar"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaEnvios;
