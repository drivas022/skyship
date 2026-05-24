import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import enviosService from '../services/enviosService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnvioCard from '../components/EnvioCard';
import '../styles/dashboard.css';

/**
 * Página: Mis Envíos
 * Dashboard del usuario para ver sus envíos
 */
const MisEnvios = () => {
  const { user } = useAuth();
  const [envios, setEnvios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEnvios();
  }, []);

  const cargarEnvios = async () => {
    try {
      setLoading(true);
      const data = await enviosService.getMisEnvios();
      setEnvios(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Error al cargar los envíos. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard__header">
          <h1 className="dashboard__titulo">Mis Envíos</h1>
          <p className="dashboard__subtitulo">
            Bienvenido, {user?.nombre}
          </p>
        </div>

        <div className="dashboard__contenido">
          <div style={{ marginBottom: '32px', textAlign: 'right' }}>
            <Link to="/crear-envio" className="dashboard__boton-crear">
              + Crear Nuevo Envío
            </Link>
          </div>

          {loading ? (
            <div className="envios-grid--vacio">
              <p>Cargando envíos...</p>
            </div>
          ) : error ? (
            <div className="envios-grid--vacio">
              <p style={{ color: '#a33b3b' }}>{error}</p>
            </div>
          ) : envios.length === 0 ? (
            <div className="envios-grid--vacio">
              <p>No tienes envíos registrados aún.</p>
              <Link to="/crear-envio" className="dashboard__boton-crear">
                Crear mi primer envío
              </Link>
            </div>
          ) : (
            <div className="envios-grid">
              {envios.map((envio) => (
                <EnvioCard key={envio.id} envio={envio} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MisEnvios;