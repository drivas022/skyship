import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import validators from '../utils/validators';
import '../styles/auth.css';

/**
 * Página de inicio de sesión
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    correo: '',
    password: '',
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

    const errorCorreo = validators.email(formData.correo);
    if (errorCorreo) nuevosErrores.correo = errorCorreo;

    const errorPassword = validators.password(formData.password);
    if (errorPassword) nuevosErrores.password = errorPassword;

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
      await login(formData.correo.trim(), formData.password);
      
      // Redirigir según rol
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.rol === 'admin') {
        navigate('/admin');
      } else {
        navigate('/mis-envios');
      }
    } catch (error) {
      setErrorGeneral(
        error.response?.data?.message ||
        'Credenciales incorrectas. Verifica tu correo y contraseña.'
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
          <h2 className="auth-card__title">Iniciar Sesión</h2>
          <p className="auth-card__subtitle">
            Ingresa a tu cuenta para gestionar tus envíos
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
            <label htmlFor="password" className="auth-form__label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="auth-form__input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            {errores.password && (
              <span className="auth-form__error">{errores.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-form__boton"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          {errorGeneral && (
            <div className="auth-form__error-general">{errorGeneral}</div>
          )}
        </form>

        <div className="auth-card__footer">
          <p className="auth-card__footer-text">
            ¿No tienes una cuenta?
            <Link to="/registro" className="auth-card__link">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;