import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './Components/Header';
import { Colores } from './Pages/Colores';
import { Tallas } from './Pages/Tallas';
import { Destinos } from './Pages/Destinos';
import { Packs } from './Pages/Packs';
import { Registro } from './Pages/Registro';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Colores />} />
        <Route path="/colores" element={<Colores />} />
        <Route path="/tallas" element={<Tallas />} />
        <Route path="/destinos" element={<Destinos />} />
        <Route path="/packs" element={<Packs />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </Router>
  );
}

export default App;
