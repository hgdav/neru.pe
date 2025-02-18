import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Tallas } from './Pages/Tallas';
import { Destinos } from './Pages/Destinos';
import { Registro } from './Pages/Registro';
import { Index } from './Pages/Index';
import { Login } from './Pages/Login';
import { Resumen } from './Pages/Resumen';
import { Inventario } from './Pages/Inventario';
import { Hora } from './Pages/Hora';
import { PrivateRoute } from './utils/privateRoute';
import DisableSwipeReload from './Components/DisableSwipeReload';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <DisableSwipeReload />
      <ToastContainer />
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
          path="/destinos"
          element={
            <PrivateRoute>
              <Destinos />
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
          path="/hora"
          element={
            <PrivateRoute>
              <Hora />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
