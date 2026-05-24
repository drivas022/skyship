import api from './api';

/**
 * Servicio de autenticación
 * Maneja login, registro y logout
 */

const authService = {
  /**
   * Registrar nuevo usuario
   * @param {Object} userData - { nombre, correo, telefono, direccion, password }
   * @returns {Promise} - Respuesta del servidor
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Iniciar sesión
   * @param {string} correo 
   * @param {string} password 
   * @returns {Promise} - { token, user }
   */
  login: async (correo, password) => {
    const response = await api.post('/auth/login', { correo, password });
    
    // Guardar token y usuario en localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Cerrar sesión
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Obtener usuario actual desde localStorage
   * @returns {Object|null} - Usuario o null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Verificar si el usuario es administrador
   * @returns {boolean}
   */
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.rol === 'admin';
  },
};

export default authService;
