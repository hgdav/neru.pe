import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Tallas } from './Pages/Tallas';
import { Registro } from './Pages/Registro';
import { Index } from './Pages/Index';
import { Login } from './Pages/Login';
import { Resumen } from './Pages/Resumen';
import { Inventario } from './Pages/Inventario';
import { PrivateRoute } from './utils/privateRoute';
import DisableSwipeReload from './Components/DisableSwipeReload';
import { Toaster } from 'react-hot-toast';
import { Facturacion } from './Pages/Factiuracion';

function App() {
  return (
    <Router>
      <DisableSwipeReload />
      <Toaster
        position="bottom-center"
        reverseOrder={true}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Index />
            </PrivateRoute>
          }
        />
        <Route
          path="/tallas"
          element={
            <PrivateRoute>
              <Tallas />
            </PrivateRoute>
          }
        />
        <Route
          path="/registro"
          element={
            <PrivateRoute>
              <Registro />
            </PrivateRoute>
          }
        />
        <Route
          path="/resumen"
          element={
            <PrivateRoute>
              <Resumen />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventario"
          element={
            <PrivateRoute>
              <Inventario />
            </PrivateRoute>
          }
        />
        <Route
          path="/facturacion"
          element={
            <PrivateRoute>
              <Facturacion />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
