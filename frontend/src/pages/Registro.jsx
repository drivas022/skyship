import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import validators from '../utils/validators';
import '../styles/auth.css';

/**
 * Página de registro de nuevos usuarios
 */
const Registro = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    password: '',
    confirmarPassword: '',
  });

  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Limpiar error del campo
    setErrores({
      ...errores,
      [name]: '',
    });
    setErrorGeneral('');
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    const errorNombre = validators.nombre(formData.nombre);
    if (errorNombre) nuevosErrores.nombre = errorNombre;

    const errorCorreo = validators.email(formData.correo);
    if (errorCorreo) nuevosErrores.correo = errorCorreo;

    const errorTelefono = validators.telefono(formData.telefono);
    if (errorTelefono) nuevosErrores.telefono = errorTelefono;

    const errorDireccion = validators.direccion(formData.direccion);
    if (errorDireccion) nuevosErrores.direccion = errorDireccion;

    const errorPassword = validators.password(formData.password);
    if (errorPassword) nuevosErrores.password = errorPassword;

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden.';
    }

    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);
    setErrorGeneral('');

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    setLoading(true);

    try {
      // Registrar usuario
      await register({
        nombre: formData.nombre.trim(),
        correo: formData.correo.trim(),
        telefono: formData.telefono.trim(),
        direccion: formData.direccion.trim(),
        password: formData.password,
      });

      // Redirigir a dashboard de usuario
      navigate('/mis-envios');
    } catch (error) {
      setErrorGeneral(
        error.response?.data?.message ||
        'Hubo un error al crear la cuenta. El correo podría estar ya registrado.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/" className="auth-card__home-link">
          ← Volver al inicio
        </Link>

        <div className="auth-card__header">
          <h1 className="auth-card__logo">SkyShip Express</h1>
          <h2 className="auth-card__title">Crear Cuenta</h2>
          <p className="auth-card__subtitle">
            Regístrate para comenzar a enviar tus paquetes
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__grupo">
            <label htmlFor="nombre" className="auth-form__label">
              Nombre Completo
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="auth-form__input"
              placeholder="Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
            />
            {errores.nombre && (
              <span className="auth-form__error">{errores.nombre}</span>
            )}
          </div>

          <div className="auth-form__grupo">
            <label htmlFor="correo" className="auth-form__label">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              className="auth-form__input"
              placeholder="tu@correo.com"
              value={formData.correo}
              onChange={handleChange}
            />
            {errores.correo && (
              <span className="auth-form__error">{errores.correo}</span>
            )}
          </div>

          <div className="auth-form__grupo">
            <label htmlFor="telefono" className="auth-form__label">
              Teléfono
            </label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              className="auth-form__input"
              placeholder="+502 1234 5678"
              value={formData.telefono}
              onChange={handleChange}
            />
            {errores.telefono && (
              <span className="auth-form__error">{errores.telefono}</span>
            )}
          </div>

          <div className="auth-form__grupo">
            <label htmlFor="direccion" className="auth-form__label">
              Dirección
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              className="auth-form__input"
              placeholder="Zona 10, Ciudad de Guatemala"
              value={formData.direccion}
              onChange={handleChange}
            />
            {errores.direccion && (
              <span className="auth-form__error">{errores.direccion}</span>
            )}
          </div>

          <div className="auth-form__grupo">
            <label htmlFor="password" className="auth-form__label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="auth-form__input"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
            />
            {errores.password && (
              <span className="auth-form__error">{errores.password}</span>
            )}
          </div>

          <div className="auth-form__grupo">
            <label htmlFor="confirmarPassword" className="auth-form__label">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmarPassword"
              name="confirmarPassword"
              className="auth-form__input"
              placeholder="Repite tu contraseña"
              value={formData.confirmarPassword}
              onChange={handleChange}
            />
            {errores.confirmarPassword && (
              <span className="auth-form__error">
                {errores.confirmarPassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="auth-form__boton"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          {errorGeneral && (
            <div className="auth-form__error-general">{errorGeneral}</div>
          )}
        </form>

        <div className="auth-card__footer">
          <p className="auth-card__footer-text">
            ¿Ya tienes una cuenta?
            <Link to="/login" className="auth-card__link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;