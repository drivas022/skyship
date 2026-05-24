import '../styles/admin.css';

/**
 * Tabla de usuarios para el panel de administrador
 * Con opciones de editar y eliminar
 */
const TablaUsuarios = ({ usuarios, onEdit, onDelete }) => {
  return (
    <div className="tabla-container">
      <table className="tabla-admin">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                No hay usuarios registrados
              </td>
            </tr>
          ) : (
            usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.telefono}</td>
                <td>
                  <span className={`tabla-admin__badge tabla-admin__badge--${usuario.rol}`}>
                    {usuario.rol}
                  </span>
                </td>
                <td>
                  <div className="tabla-admin__acciones">
                    <button
                      onClick={() => onEdit(usuario)}
                      className="tabla-admin__boton tabla-admin__boton--editar"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(usuario.id)}
                      className="tabla-admin__boton tabla-admin__boton--eliminar"
                      disabled={usuario.rol === 'admin'}
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

export default TablaUsuarios;
