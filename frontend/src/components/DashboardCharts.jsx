import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import '../styles/dashboard-charts.css';

const DashboardCharts = ({ enviosPorMes, enviosPorRegion, distribucionEstados }) => {
  // Colores para el pie chart
  const COLORS = ['#6b6b6b', '#111111', '#999999', '#dddddd'];

  // Validar que los datos existan
  if (!enviosPorMes || !enviosPorRegion || !distribucionEstados) {
    return (
      <div className="charts-container">
        <p>No hay datos suficientes para mostrar gráficas</p>
      </div>
    );
  }

  // Formatear datos para el pie chart (usar 'value' en lugar de 'total')
  const pieData = distribucionEstados.map(item => ({
    name: item.estado,
    value: item.value || 0
  }));

  return (
    <div className="charts-container">
      {/* Gráfica 1: Envíos por mes */}
      <div className="chart-card">
        <h3 className="chart-title">ENVÍOS POR MES</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={enviosPorMes}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dddddd" />
            <XAxis dataKey="mes" stroke="#6b6b6b" />
            <YAxis stroke="#6b6b6b" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#111111"
              strokeWidth={2}
              name="Envíos"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica 2: Envíos por región */}
      <div className="chart-card">
        <h3 className="chart-title">ENVÍOS POR DEPARTAMENTO</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={enviosPorRegion}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dddddd" />
            <XAxis dataKey="region" stroke="#6b6b6b" />
            <YAxis stroke="#6b6b6b" />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#111111" name="Envíos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica 3: Distribución por estado */}
      <div className="chart-card">
        <h3 className="chart-title">DISTRIBUCIÓN POR ESTADO</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;