import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Rtadmin2 from './pages/Rtadmin2';
import HomePage from './pages/HomePage';
import ResumoEtapasPage from './pages/ResumoEtapasPage';
import LoginPage2 from './pages/LoginPage2';
import AnaliseNpPage from './pages/AnaliseNpPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />}>
          <Route path="/rt-page" element={<Rtadmin2 />} />
          <Route path="/resumo-etapas" element={<ResumoEtapasPage />} />
          <Route path="/analise-np" element={<AnaliseNpPage />} />
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
