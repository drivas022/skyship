import { useState } from 'react';
import validators from '../utils/validators';
import '../styles/formularios.css';

/**
 * Formulario para crear un nuevo envío
 * Props: onSubmit (función que maneja el envío del form)
 */
const EnvioForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    destino: '',
    costo: '',
  });

  const [errores, setErrores] = useState({});

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
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    const errorDestino = validators.destino(formData.destino);
    if (errorDestino) nuevosErrores.destino = errorDestino;

    const errorCosto = validators.costo(formData.costo);
    if (errorCosto) nuevosErrores.costo = errorCosto;

    return nuevosErrores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      // Llamar a la función padre con los datos
      onSubmit({
        destino: formData.destino.trim(),
        costo: parseFloat(formData.costo),
      });
    }
  };

  return (
    <form className="formulario-contacto" onSubmit={handleSubmit}>
      <div className="formulario__grupo">
        <label htmlFor="destino">DESTINO</label>
        <input
          type="text"
          id="destino"
          name="destino"
          placeholder="Ciudad de Guatemala, Guatemala"
          value={formData.destino}
          onChange={handleChange}
        />
        {errores.destino && (
          <p className="formulario__error">{errores.destino}</p>
        )}
      </div>

      <div className="formulario__grupo">
        <label htmlFor="costo">COSTO ESTIMADO (Q)</label>
        <input
          type="number"
          step="0.01"
          id="costo"
          name="costo"
          placeholder="150.00"
          value={formData.costo}
          onChange={handleChange}
        />
        {errores.costo && (
          <p className="formulario__error">{errores.costo}</p>
        )}
      </div>

      <button type="submit" className="formulario__boton" disabled={loading}>
        {loading ? 'CREANDO...' : 'CREAR ENVÍO'}
      </button>
    </form>
  );
};

export default EnvioForm;