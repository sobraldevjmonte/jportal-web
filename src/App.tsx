import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Rtadmin2 from './pages/Rtadmin2';
import HomePage from './pages/HomePage';
import ResumoEtapasPage from './pages/ResumoEtapasPage';
import LoginPage2 from './pages/LoginPage2';
import AnaliseNpPage from './pages/AnaliseNpPage';
import AdminProjJmonte from './components/profissionais/AdminProfJmonte';
import AdminProfUsuarios from './components/profissionais/AdminProfUsuarios';
import AdminProfPremios from './components/profissionais/AdminProfPremios';
import AdminProfPremiosPedidos from './components/profissionais/AdminProfPremiosPedidos';

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
