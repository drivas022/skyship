import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente que protege rutas privadas
 * Solo usuarios autenticados pueden acceder
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mientras carga, no mostramos nada (o un spinner)
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no está autenticado, redirigir a login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
