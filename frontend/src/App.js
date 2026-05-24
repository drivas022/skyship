import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

// Páginas públicas
import Inicio from "./pages/Inicio";
import Cotizador from "./pages/Cotizador";
import Login from "./pages/Login";
import Registro from "./pages/Registro";

// Páginas privadas (requieren login)
import MisEnvios from "./pages/MisEnvios";
import CrearEnvio from "./pages/CrearEnvio";

// Páginas admin
import AdminPanel from "./pages/AdminPanel";

import "./styles/globales.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/cotizador" element={<Cotizador />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas privadas - requieren autenticación */}
        <Route
          path="/mis-envios"
          element={
            <PrivateRoute>
              <MisEnvios />
            </PrivateRoute>
          }
        />
        <Route
          path="/crear-envio"
          element={
            <PrivateRoute>
              <CrearEnvio />
            </PrivateRoute>
          }
        />

        {/* Rutas admin - requieren rol admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;