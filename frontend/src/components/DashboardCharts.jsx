import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardCharts = ({ stats }) => {
  return (
    <div className="dashboard-charts">
      {/* Gráfica de Línea: Envíos por Mes */}
      <div className="chart-container">
        <h3>Envíos por Mes</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.enviosPorMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" name="Envíos" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de Barras: Envíos por Región */}
      <div className="chart-container">
        <h3>Top 10 Departamentos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.enviosPorRegion}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#82ca9d" name="Envíos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de Dona: Distribución por Estado */}
      <div className="chart-container">
        <h3>Distribución por Estado</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stats.distribucionEstados}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ estado, percent }) => `${estado}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {stats.distribucionEstados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de Línea: Ingresos por Mes */}
      <div className="chart-container">
        <h3>Ingresos por Mes</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.enviosPorMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ingresos" stroke="#82ca9d" name="Ingresos (Q)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;