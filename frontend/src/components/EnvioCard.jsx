import '../styles/dashboard.css';

/**
 * Tarjeta individual de envío
 * Muestra: código de guía, destino, fecha, estado, costo
 */
const EnvioCard = ({ envio }) => {
  const { codigo_guia, destino, fecha_creacion, estado, costo } = envio;

  // Función para obtener clase CSS según el estado
  const getEstadoClase = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return 'envio-card__estado--pendiente';
      case 'en_transito':
      case 'en tránsito':
        return 'envio-card__estado--transito';
      case 'entregado':
        return 'envio-card__estado--entregado';
      case 'cancelado':
        return 'envio-card__estado--cancelado';
      default:
        return 'envio-card__estado--pendiente';
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="envio-card">
      <div className="envio-card__header">
        <h3 className="envio-card__codigo">{codigo_guia}</h3>
        <span className={`envio-card__estado ${getEstadoClase(estado)}`}>
          {estado}
        </span>
      </div>

      <div className="envio-card__body">
        <div className="envio-card__info">
          <span className="envio-card__label">Destino:</span>
          <span className="envio-card__value">{destino}</span>
        </div>

        <div className="envio-card__info">
          <span className="envio-card__label">Fecha:</span>
          <span className="envio-card__value">{formatearFecha(fecha_creacion)}</span>
        </div>

        <div className="envio-card__info">
          <span className="envio-card__label">Costo:</span>
          <span className="envio-card__value">Q{parseFloat(costo).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default EnvioCard;