import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';
import enviosService from '../services/enviosService';
import TablaEnvios from '../components/TablaEnvios';
import TablaUsuarios from '../components/TablaUsuarios';
import KPICard from '../components/KPICard';
import DashboardCharts from '../components/DashboardCharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/admin.css';
import '../styles/kpi-card.css';
import '../styles/dashboard-charts.css';

/**
 * Panel de administrador
 * Tabs: Dashboard (estadísticas + gráficas), Envíos (CRUD), Usuarios (CRUD)
 */
const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [tabActual, setTabActual] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para estadísticas
  const [stats, setStats] = useState(null);

  // Estados para envíos
  const [envios, setEnvios] = useState([]);

  // Estados para usuarios
  const [usuarios, setUsuarios] = useState([]);

  // Modal de edición
  const [modalAbierto, setModalAbierto] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [tipoEdicion, setTipoEdicion] = useState(''); // 'envio' o 'usuario'

  // Verificar si es admin
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Cargar datos según tab
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
      }
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers de envíos
  const handleEditarEnvio = (envio) => {
    setItemEditando(envio);
    setTipoEdicion('envio');
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
    setItemEditando(usuario);
    setTipoEdicion('usuario');
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

  const handleGuardarCambios = async (e) => {
    e.preventDefault();

    try {
      if (tipoEdicion === 'envio') {
        await enviosService.updateEnvio(itemEditando.id, itemEditando);
        setEnvios(
          envios.map((env) =>
            env.id === itemEditando.id ? itemEditando : env
          )
        );
      } else if (tipoEdicion === 'usuario') {
        await adminService.updateUsuario(itemEditando.id, itemEditando);
        setUsuarios(
          usuarios.map((usr) =>
            usr.id === itemEditando.id ? itemEditando : usr
          )
        );
      }
      setModalAbierto(false);
      setItemEditando(null);
    } catch (err) {
      alert('Error al guardar los cambios');
      console.error(err);
    }
  };

  const handleCambioModal = (e) => {
    const { name, value } = e.target;
    setItemEditando({
      ...itemEditando,
      [name]: value,
    });
  };

  // Función para formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(value || 0);
  };

  return (
    <>
      <Navbar />
      <div className="admin">
        <div className="admin__header">
          <h1 className="admin__titulo">Panel de Administrador</h1>
          <p className="admin__subtitulo">
            Bienvenido, {user?.nombre || 'Administrador'}
          </p>
        </div>

        <div className="admin__contenido">
          {/* Tabs - SIN EMOJIS */}
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
          </div>

          {/* Contenido según tab */}
          {loading ? (
            <p>Cargando...</p>
          ) : error ? (
            <p style={{ color: '#a33b3b' }}>{error}</p>
          ) : (
            <>
              {/* Dashboard - Estadísticas + Gráficas */}
              {tabActual === 'dashboard' && stats && (
                <div className="dashboard-content">
                  {/* KPIs Principales */}
                  <div className="kpi-grid">
                    <KPICard
                      title="Total Envíos"
                      value={stats.totalEnvios || 0}
                      subtitle="Envíos registrados"
                      trend={stats.cambioEnvios}
                    />
                    <KPICard
                      title="Total Usuarios"
                      value={stats.totalUsuarios || 0}
                      subtitle="Clientes registrados"
                    />
                    <KPICard
                      title="Ingresos Totales"
                      value={formatCurrency(stats.ingresosTotales)}
                      subtitle={`Promedio: ${formatCurrency(stats.ingresoPromedio)}`}
                      trend={stats.cambioIngresos}
                    />
                    <KPICard
                      title="Tasa de Entrega"
                      value={`${stats.tasaEntrega || 0}%`}
                      subtitle={`${stats.enviosEntregados || 0} de ${stats.totalEnvios || 0}`}
                    />
                  </div>

                  {/* KPIs Secundarios - Estados */}
                  <div className="kpi-grid secondary">
                    <KPICard
                      title="Pendientes"
                      value={stats.enviosPendientes || 0}
                    />
                    <KPICard
                      title="En Tránsito"
                      value={stats.enviosEnTransito || 0}
                    />
                    <KPICard
                      title="Entregados"
                      value={stats.enviosEntregados || 0}
                    />
                    <KPICard
                      title="Cancelados"
                      value={stats.enviosCancelados || 0}
                    />
                  </div>

                  {/* Comparación Mensual */}
                  {stats.enviosMesActual !== undefined && (
                    <div className="monthly-comparison">
                      <div className="comparison-card">
                        <h3>Envíos Este Mes</h3>
                        <div className="comparison-value">{stats.enviosMesActual}</div>
                        <div className="comparison-subtitle">
                          vs {stats.enviosMesAnterior} mes anterior
                        </div>
                        <div className={`comparison-trend ${stats.cambioEnvios >= 0 ? 'positive' : 'negative'}`}>
                          {stats.cambioEnvios >= 0 ? '↑' : '↓'} {Math.abs(stats.cambioEnvios || 0).toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="comparison-card">
                        <h3>Ingresos Este Mes</h3>
                        <div className="comparison-value">{formatCurrency(stats.ingresosMesActual)}</div>
                        <div className="comparison-subtitle">
                          vs {formatCurrency(stats.ingresosMesAnterior)} mes anterior
                        </div>
                        <div className={`comparison-trend ${stats.cambioIngresos >= 0 ? 'positive' : 'negative'}`}>
                          {stats.cambioIngresos >= 0 ? '↑' : '↓'} {Math.abs(stats.cambioIngresos || 0).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gráficas */}
                  {stats.enviosPorMes && stats.enviosPorRegion && stats.distribucionEstados && (
                    <DashboardCharts stats={stats} />
                  )}

                  {/* Top 5 Clientes */}
                  {stats.topClientes && stats.topClientes.length > 0 && (
                    <div className="top-clientes">
                      <h3>Top 5 Clientes</h3>
                      <table className="top-clientes-table">
                        <thead>
                          <tr>
                            <th>Cliente</th>
                            <th>Correo</th>
                            <th>Envíos</th>
                            <th>Total Gastado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.topClientes.map((cliente, index) => (
                            <tr key={index}>
                              <td>{cliente.nombre}</td>
                              <td>{cliente.correo}</td>
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
            </>
          )}
        </div>
      </div>

      {/* Modal de edición */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__titulo">
                Editar {tipoEdicion === 'envio' ? 'Envío' : 'Usuario'}
              </h2>
            </div>

            <form onSubmit={handleGuardarCambios} className="modal__form">
              {tipoEdicion === 'envio' ? (
                <>
                  <div className="formulario__grupo">
                    <label>Destino</label>
                    <input
                      type="text"
                      name="destino"
                      value={itemEditando?.destino || ''}
                      onChange={handleCambioModal}
                    />
                  </div>
                  <div className="formulario__grupo">
                    <label>Estado</label>
                    <select
                      name="estado"
                      value={itemEditando?.estado || ''}
                      onChange={handleCambioModal}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_transito">En Tránsito</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                  <div className="formulario__grupo">
                    <label>Costo</label>
                    <input
                      type="number"
                      step="0.01"
                      name="costo"
                      value={itemEditando?.costo || ''}
                      onChange={handleCambioModal}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="formulario__grupo">
                    <label>Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={itemEditando?.nombre || ''}
                      onChange={handleCambioModal}
                    />
                  </div>
                  <div className="formulario__grupo">
                    <label>Correo</label>
                    <input
                      type="email"
                      name="correo"
                      value={itemEditando?.correo || ''}
                      onChange={handleCambioModal}
                    />
                  </div>
                  <div className="formulario__grupo">
                    <label>Teléfono</label>
                    <input
                      type="text"
                      name="telefono"
                      value={itemEditando?.telefono || ''}
                      onChange={handleCambioModal}
                    />
                  </div>
                  <div className="formulario__grupo">
                    <label>Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      value={itemEditando?.direccion || ''}
                      onChange={handleCambioModal}
                    />
                  </div>
                  <div className="formulario__grupo">
                    <label>Rol</label>
                    <select
                      name="rol"
                      value={itemEditando?.rol || ''}
                      onChange={handleCambioModal}
                    >
                      <option value="cliente">Cliente</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </>
              )}

              <div className="modal__footer">
                <button
                  type="button"
                  className="modal__boton modal__boton--cancelar"
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modal__boton modal__boton--guardar"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default AdminPanel;