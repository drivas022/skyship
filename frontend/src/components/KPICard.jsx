import React from 'react';
import '../styles/kpi-card.css';

const KPICard = ({ title, value, subtitle, trend }) => {
  return (
    <div className="kpi-card">
      <p className="kpi-card__label">{title}</p>
      <p className="kpi-card__value">{value}</p>
      {subtitle && <p className="kpi-card__subtitle">{subtitle}</p>}
      {trend !== undefined && (
        <p className={`kpi-card__trend ${trend >= 0 ? 'kpi-card__trend--positive' : 'kpi-card__trend--negative'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}% vs mes anterior
        </p>
      )}
    </div>
  );
};

export default KPICard;