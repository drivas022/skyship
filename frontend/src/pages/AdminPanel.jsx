import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import enviosService from '../services/enviosService';
import adminService from '../services/adminService';
import TablaEnvios from '../components/TablaEnvios';
import TablaUsuarios from '../components/TablaUsuarios';
import TablaContactos from '../components/TablaContactos';
import KPICard from '../components/KPICard';
import DashboardCharts from '../components/DashboardCharts';
import '../styles/admin.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [tabActual, setTabActual] = useState('dashboard');
  const [envios, setEnvios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal de edición
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoEdicion, setTipoEdicion] = useState('');
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    cargarDatos();
  }, [tabActual]);

  const cargarDatos = async () => {
    setLoading(true);
    setError('');

    try {
      if (tabActual === 'dashboard') {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } else if (tabActual === 'envios') {
        const data = await enviosService.getAllEnvios();
        setEnvios(data);
      } else if (tabActual === 'usuarios') {
        const data = await adminService.getUsuarios();
        setUsuarios(data);
      } else if (tabActual === 'contactos') {
        const data = await adminService.getContactos();
        setContactos(data);
      }
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Handlers de envíos
  const handleEditarEnvio = (envio) => {
    setTipoEdicion('envio');
    setItemSeleccionado(envio);
    setFormData({
      estado: envio.estado,
      direccion_origen: envio.direccion_origen,
      direccion_destino: envio.direccion_destino,
      departamento_destino: envio.departamento_destino,
      costo: envio.costo,
    });
    setModalAbierto(true);
  };

  const handleEliminarEnvio = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este envío?')) return;

    try {
      await enviosService.deleteEnvio(id);
      setEnvios(envios.filter((e) => e.id !== id));
    } catch (err) {
      alert('Error al eliminar el envío');
      console.error(err);
    }
  };

  // Handlers de usuarios
  const handleEditarUsuario = (usuario) => {
    setTipoEdicion('usuario');
    setItemSeleccionado(usuario);
    setFormData({
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono,
      rol: usuario.rol,
    });
    setModalAbierto(true);
  };

  const handleEliminarUsuario = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await adminService.deleteUsuario(id);
      setUsuarios(usuarios.filter((u) => u.id !== id));
    } catch (err) {
      alert('Error al eliminar el usuario');
      console.error(err);
    }
  };

  // Handlers de contactos
  const handleResponderContacto = async (id, respuesta) => {
    try {
      await adminService.responderContacto(id, respuesta);
      alert('Respuesta enviada exitosamente');
      cargarDatos();
    } catch (err) {
      alert('Error al enviar respuesta');
      console.error(err);
    }
  };

  const handleMarcarContactoLeido = async (id) => {
    try {
      await adminService.marcarContactoLeido(id);
      cargarDatos();
    } catch (err) {
      alert('Error al marcar como leído');
      console.error(err);
    }
  };

  const handleEliminarContacto = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este mensaje de contacto?')) return;

    try {
      await adminService.deleteContacto(id);
      setContactos(contactos.filter((c) => c.id !== id));
    } catch (err) {
      alert('Error al eliminar el contacto');
      console.error(err);
    }
  };

  // Modal
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuardarCambios = async (e) => {
    e.preventDefault();

    try {
      if (tipoEdicion === 'envio') {
        await enviosService.updateEnvio(itemSeleccionado.id, formData);
        alert('Envío actualizado exitosamente');
      } else if (tipoEdicion === 'usuario') {
        await adminService.updateUsuario(itemSeleccionado.id, formData);
        alert('Usuario actualizado exitosamente');
      }

      setModalAbierto(false);
      cargarDatos();
    } catch (err) {
      alert('Error al guardar los cambios');
      console.error(err);
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setItemSeleccionado(null);
    setFormData({});
  };

  // Helper para formatear moneda
  const formatCurrency = (value) => {
    return `Q ${parseFloat(value).toLocaleString('es-GT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="admin">
      {/* Header */}
      <header className="admin__header">
        <div className="admin__header-content">
          <h1 className="admin__titulo">PANEL DE ADMINISTRACIÓN</h1>
          <button className="admin__logout" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="admin__tabs">
        <button
          className={`admin__tab ${
            tabActual === 'dashboard' ? 'admin__tab--active' : ''
          }`}
          onClick={() => setTabActual('dashboard')}
        >
          DASHBOARD
        </button>
        <button
          className={`admin__tab ${
            tabActual === 'envios' ? 'admin__tab--active' : ''
          }`}
          onClick={() => setTabActual('envios')}
        >
          ENVÍOS
        </button>
        <button
          className={`admin__tab ${
            tabActual === 'usuarios' ? 'admin__tab--active' : ''
          }`}
          onClick={() => setTabActual('usuarios')}
        >
          USUARIOS
        </button>
        <button
          className={`admin__tab ${
            tabActual === 'contactos' ? 'admin__tab--active' : ''
          }`}
          onClick={() => setTabActual('contactos')}
        >
          CONTACTOS
        </button>
      </div>

      {/* Contenido */}
      <div className="admin__contenido">
        {loading ? (
          <p className="admin__mensaje">Cargando datos...</p>
        ) : error ? (
          <p className="admin__mensaje admin__mensaje--error">{error}</p>
        ) : (
          <>
            {/* Tab Dashboard */}
            {tabActual === 'dashboard' && stats && (
              <div className="dashboard">
                {/* KPIs principales */}
                <div className="dashboard__grid">
                  <KPICard
                    title="Total Envíos"
                    value={stats.totalEnvios}
                    subtitle="Envíos registrados"
                  />
                  <KPICard
                    title="Total Usuarios"
                    value={stats.totalUsuarios}
                    subtitle="Usuarios activos"
                  />
                  <KPICard
                    title="Ingresos Totales"
                    value={formatCurrency(stats.ingresosTotales)}
                    subtitle="Ingresos acumulados"
                  />
                  <KPICard
                    title="Tasa de Entrega"
                    value={`${stats.tasaEntrega.toFixed(1)}%`}
                    subtitle="Envíos entregados"
                  />
                </div>

                {/* Estados */}
                <div className="dashboard__grid dashboard__grid--4col">
                  <KPICard
                    title="Pendientes"
                    value={stats.enviosPendientes || 0}
                    subtitle="En espera"
                  />
                  <KPICard
                    title="En Tránsito"
                    value={stats.enviosEnTransito || 0}
                    subtitle="En camino"
                  />
                  <KPICard
                    title="Entregados"
                    value={stats.enviosEntregados || 0}
                    subtitle="Completados"
                  />
                  <KPICard
                    title="Cancelados"
                    value={stats.enviosCancelados || 0}
                    subtitle="No completados"
                  />
                </div>

                {/* Comparación mensual */}
                <div className="dashboard__grid">
                  <KPICard
                    title="Envíos Este Mes"
                    value={stats.enviosMesActual}
                    subtitle="Mes actual"
                    trend={
                      stats.cambioEnvios !== null
                        ? {
                            value: stats.cambioEnvios,
                            positive: stats.cambioEnvios >= 0,
                          }
                        : null
                    }
                  />
                  <KPICard
                    title="Ingresos Este Mes"
                    value={formatCurrency(stats.ingresosMesActual)}
                    subtitle="Mes actual"
                    trend={
                      stats.cambioIngresos !== null
                        ? {
                            value: stats.cambioIngresos,
                            positive: stats.cambioIngresos >= 0,
                          }
                        : null
                    }
                  />
                  <KPICard
                    title="Ingreso Promedio"
                    value={formatCurrency(stats.ingresoPromedio)}
                    subtitle="Por envío"
                  />
                </div>

                {/* Gráficas */}
                {stats.enviosPorMes && stats.enviosPorRegion && stats.distribucionEstados && (
                  <DashboardCharts
                    enviosPorMes={stats.enviosPorMes}
                    enviosPorRegion={stats.enviosPorRegion}
                    distribucionEstados={stats.distribucionEstados}
                  />
                )}

                {/* Top clientes */}
                {stats.topClientes && stats.topClientes.length > 0 && (
                  <div className="dashboard__section">
                    <h3 className="dashboard__section-title">TOP 5 CLIENTES</h3>
                    <table className="dashboard__table">
                      <thead>
                        <tr>
                          <th>CLIENTE</th>
                          <th>ENVÍOS</th>
                          <th>TOTAL GASTADO</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.topClientes.map((cliente, index) => (
                          <tr key={index}>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.total_envios}</td>
                            <td>{formatCurrency(cliente.total_gastado)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

            {/* Tab Envíos */}
            {tabActual === 'envios' && (
              <TablaEnvios
                envios={envios}
                onEdit={handleEditarEnvio}
                onDelete={handleEliminarEnvio}
              />
            )}

            {/* Tab Usuarios */}
            {tabActual === 'usuarios' && (
              <TablaUsuarios
                usuarios={usuarios}
                onEdit={handleEditarUsuario}
                onDelete={handleEliminarUsuario}
              />
            )}

            {/* Tab Contactos */}
            {tabActual === 'contactos' && (
              <TablaContactos
                contactos={contactos}
                onResponder={handleResponderContacto}
                onMarcarLeido={handleMarcarContactoLeido}
                onDelete={handleEliminarContacto}
              />
            )}
          </>
        )}
      </div>

      {/* Modal de edición */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__titulo">
                Editar {tipoEdicion === 'envio' ? 'Envío' : 'Usuario'}
              </h2>
            </div>

            <form onSubmit={handleGuardarCambios} className="modal__form">
              {tipoEdicion === 'envio' && (
                <>
                  <div className="formulario__grupo">
                    <label>Estado:</label>
                    <select
                      name="estado"
                      value={formData.estado || ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_transito">En Tránsito</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>

                  <div className="formulario__grupo">
                    <label>Dirección Origen:</label>
                    <input
                      type="text"
                      name="direccion_origen"
                      value={formData.direccion_origen || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="formulario__grupo">
                    <label>Dirección Destino:</label>
                    <input
                      type="text"
                      name="direccion_destino"
                      value={formData.direccion_destino || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="formulario__grupo">
                    <label>Departamento Destino:</label>
                    <input
                      type="text"
                      name="departamento_destino"
                      value={formData.departamento_destino || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="formulario__grupo">
                    <label>Costo (Q):</label>
                    <input
                      type="number"
                      step="0.01"
                      name="costo"
                      value={formData.costo || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </>
              )}

              {tipoEdicion === 'usuario' && (
                <>
                  <div className="formulario__grupo">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="formulario__grupo">
                    <label>Correo:</label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="formulario__grupo">
                    <label>Teléfono:</label>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="formulario__grupo">
                    <label>Rol:</label>
                    <select
                      name="rol"
                      value={formData.rol || ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="usuario">Usuario</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </>
              )}

              <div className="modal__footer">
                <button
                  type="button"
                  className="modal__boton modal__boton--cancelar"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modal__boton modal__boton--guardar"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;