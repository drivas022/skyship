import api from './api';

/**
 * Servicio de envíos
 * Maneja todas las operaciones relacionadas con envíos
 */

const enviosService = {
  /**
   * Obtener envíos del usuario autenticado
   * @returns {Promise<Array>} - Lista de envíos
   */
  getMisEnvios: async () => {
    const response = await api.get('/envios');
    return response.data;
  },

  /**
   * Crear un nuevo envío
   * @param {Object} envioData - { destino, costo }
   * @returns {Promise} - Envío creado con código de guía
   */
  crearEnvio: async (envioData) => {
    const response = await api.post('/envios', envioData);
    return response.data;
  },

  /**
   * Obtener todos los envíos (solo admin)
   * @returns {Promise<Array>}
   */
  getAllEnvios: async () => {
    const response = await api.get('/admin/envios');
    return response.data;
  },

  /**
   * Actualizar envío (solo admin)
   * @param {number} id 
   * @param {Object} envioData 
   * @returns {Promise}
   */
  updateEnvio: async (id, envioData) => {
    const response = await api.put(`/admin/envios/${id}`, envioData);
    return response.data;
  },

  /**
   * Eliminar envío (solo admin)
   * @param {number} id 
   * @returns {Promise}
   */
  deleteEnvio: async (id) => {
    const response = await api.delete(`/admin/envios/${id}`);
    return response.data;
  },
};

export default enviosService;
