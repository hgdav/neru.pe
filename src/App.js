import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Colores } from './Pages/Colores';
import { Tallas } from './Pages/Tallas';
import { Destinos } from './Pages/Destinos';
import { Packs } from './Pages/Packs';
import { Registro } from './Pages/Registro';
import { Index } from './Pages/Index';
import { Login } from './Pages/Login';
import { PrivateRoute } from './utils/privateRoute';
import DisableSwipeReload from './Components/DisableSwipeReload';
function App() {
  return (
    <Router>
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
          path="/colores"
          element={
            <PrivateRoute>
              <Colores />
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
          path="/packs"
          element={
            <PrivateRoute>
              <Packs />
            </PrivateRoute>
          }
        />
        <Route
          path="/registro"
          element={
            <PrivateRoute>
              <DisableSwipeReload />
              <Registro />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
