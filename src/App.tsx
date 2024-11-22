import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import LoginPage2 from './pages/LoginPage2';
import AnaliseNpPage from './pages/jmonte/AnaliseNpPage';
import EntregasPedidos from './pages/jmonte/EntregasPedidos';
import Rtadmin2 from './pages/jmonte/Rtadmin2';
import ResumoEtapasPage from './pages/jmonte/ResumoEtapasPage';
import AdminProjJmonte from './components/jmonte/profissionais/AdminProfJmonte';
import AdminProfUsuarios from './components/jmonte/profissionais/AdminProfUsuarios';
import AdminProfPremiosPedidos from './components/jmonte/profissionais/AdminProfPremiosPedidos';
import AdminProfPremios from './components/jmonte/profissionais/AdminProfPremios';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />}>
          <Route path="/rt-page" element={<Rtadmin2 />} />
          <Route path="/resumo-etapas" element={<ResumoEtapasPage />} />
          <Route path="/analise-np" element={<AnaliseNpPage />} />
          <Route path="/adm-prof-jmonte" element={<AdminProjJmonte />} />
          <Route path="/adm-prof-usuarios" element={<AdminProfUsuarios />} />
          <Route path="/adm-prof-premios" element={<AdminProfPremios />} />
          <Route path="/adm-prof-premios-pedidos" element={<AdminProfPremiosPedidos />} />
          <Route path="/entregas-pedidos" element={<EntregasPedidos />} />
        </Route>
        <Route path="/login" element={<LoginPage2 />} />
        {/*<Route path="*" element={<ErrorPage />} />*/}

        {/* Defina uma rota padrão ou de redirecionamento */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
