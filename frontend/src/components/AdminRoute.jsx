import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente que protege rutas de administrador
 * Solo usuarios con rol admin pueden acceder
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si está autenticado pero no es admin, redirigir a home
  if (!isAdmin()) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
