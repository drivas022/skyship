import api from './api';

/**
 * Servicio de contacto
 * Maneja envío de formulario de contacto
 */

const contactoService = {
  /**
   * Enviar formulario de contacto
   * @param {Object} contactoData - { nombre, correo, telefono, mensaje }
   * @returns {Promise}
   */
  enviarContacto: async (contactoData) => {
    const response = await api.post('/contacto', contactoData);
    return response.data;
  },
};

export default contactoService;
