import api from './api';

/**
 * Servicio administrativo
 * Maneja operaciones de administrador
 */

const adminService = {
  /**
   * Obtener estadísticas del dashboard
   * @returns {Promise} - { enviosPorMes, enviosPorRegion, totalEnvios, etc. }
   */
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  /**
   * Obtener todos los usuarios
   * @returns {Promise<Array>}
   */
  getUsuarios: async () => {
    const response = await api.get('/admin/usuarios');
    return response.data;
  },

  /**
   * Actualizar usuario
   * @param {number} id 
   * @param {Object} userData 
   * @returns {Promise}
   */
  updateUsuario: async (id, userData) => {
    const response = await api.put(`/admin/usuarios/${id}`, userData);
    return response.data;
  },

  /**
   * Eliminar usuario
   * @param {number} id 
   * @returns {Promise}
   */
  deleteUsuario: async (id) => {
    const response = await api.delete(`/admin/usuarios/${id}`);
    return response.data;
  },
};

export default adminService;
