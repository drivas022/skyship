import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import enviosService from '../services/enviosService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnvioForm from '../components/EnvioForm';
import '../styles/dashboard.css';

/**
 * Página: Crear Envío
 * Formulario para crear un nuevo envío
 */
const CrearEnvio = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (envioData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      await enviosService.crearEnvio(envioData);

      setSuccess(true);
      
      // Redirigir a Mis Envíos después de 2 segundos
      setTimeout(() => {
        navigate('/mis-envios');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Error al crear el envío. Intenta de nuevo.'
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
          <h1 className="dashboard__titulo">Crear Nuevo Envío</h1>
          <p className="dashboard__subtitulo">
            Completa la información de tu envío
          </p>
        </div>

        <div className="dashboard__contenido">
          <div className="crear-envio">
            <div className="crear-envio__form">
              <EnvioForm onSubmit={handleSubmit} loading={loading} />

              {success && (
                <div className="formulario__exito" style={{ marginTop: '20px' }}>
                  ¡Envío creado exitosamente! Redirigiendo...
                </div>
              )}

              {error && (
                <div className="formulario__error" style={{ marginTop: '20px' }}>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CrearEnvio;