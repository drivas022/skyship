import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

// Crear el contexto
const AuthContext = createContext(null);

/**
 * Provider de autenticación
 * Maneja el estado global de autenticación en toda la app
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, verificamos si hay usuario en localStorage
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  /**
   * Iniciar sesión
   * @param {string} correo 
   * @param {string} password 
   */
  const login = async (correo, password) => {
    const data = await authService.login(correo, password);
    setUser(data.user);
    return data;
  };

  /**
   * Registrar usuario
   * @param {Object} userData 
   */
  const register = async (userData) => {
    const data = await authService.register(userData);
    // Después de registrar, hacemos login automático
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  };

  /**
   * Cerrar sesión
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  /**
   * Verificar si es admin
   */
  const isAdmin = () => {
    return user?.rol === 'admin';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personalizado para usar el contexto de auth
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;
