/**
 * Validaciones compartidas para formularios
 */

export const validators = {
  /**
   * Validar email
   */
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return 'El correo es requerido.';
    if (!regex.test(email)) return 'Ingresa un correo válido.';
    return '';
  },

  /**
   * Validar nombre completo
   */
  nombre: (nombre) => {
    if (!nombre.trim()) return 'El nombre es requerido.';
    if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
    return '';
  },

  /**
   * Validar teléfono
   */
  telefono: (telefono) => {
    const regex = /^[+0-9\s-]{8,20}$/;
    if (!telefono.trim()) return 'El teléfono es requerido.';
    if (!regex.test(telefono)) return 'Ingresa un teléfono válido.';
    return '';
  },

  /**
   * Validar contraseña
   */
  password: (password) => {
    if (!password) return 'La contraseña es requerida.';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    return '';
  },

  /**
   * Validar dirección
   */
  direccion: (direccion) => {
    if (!direccion.trim()) return 'La dirección es requerida.';
    if (direccion.trim().length < 10) return 'La dirección debe tener al menos 10 caracteres.';
    return '';
  },

  /**
   * Validar mensaje
   */
  mensaje: (mensaje) => {
    if (!mensaje.trim()) return 'El mensaje es requerido.';
    if (mensaje.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
    return '';
  },

  /**
   * Validar destino
   */
  destino: (destino) => {
    if (!destino.trim()) return 'El destino es requerido.';
    if (destino.trim().length < 5) return 'Ingresa un destino válido.';
    return '';
  },

  /**
   * Validar costo
   */
  costo: (costo) => {
    if (!costo) return 'El costo es requerido.';
    if (isNaN(costo) || parseFloat(costo) <= 0) return 'Ingresa un costo válido.';
    return '';
  },
};

export default validators;