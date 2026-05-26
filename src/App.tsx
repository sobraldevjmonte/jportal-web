import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import LoginPage2 from "./pages/LoginPage2";
import DashBoardPage from "./pages/jmonte/DashboardPage";
import AnaliseNpPage from "./pages/jmonte/AnaliseNpPage";
import EntregasPedidos from "./pages/jmonte/EntregasPedidos";
import Rtadmin2 from "./pages/jmonte/Rtadmin2";
import ResumoEtapasPage from "./pages/jmonte/ResumoEtapasPage";
import AdminProjJmonte from "./components/jmonte/profissionais/AdminProfJmonte";
import AdminProfUsuarios from "./components/jmonte/profissionais/AdminProfUsuarios";
import AdminProfPremiosPedidos from "./components/jmonte/profissionais/AdminProfPremiosPedidos";
import AdminProfPremios from "./components/jmonte/profissionais/AdminProfPremios";
import GrupoComponente from "./components/jmonte/grupo-subgrupo/GrupoComponente";
import AdminUsuarios from "./pages/jmonte/AdminUsuarios";
import AdminAuditoria from "./pages/jmonte/AdminAuditoria";
import TIPage from "./components/jmonte/ti/FuncoesTIComponent";

import PrivateLayout from "./common/PrivateLayout";
import PrivateRoute from "./routes/PrivateRoute";
import MonitoramentoPage from "./pages/MonitoramentoPage";
import ConfigPage  from "./pages/ConfigPage";
import GestaoObrasComponent from './components/jmonte/obras/GestaoObrasComponent.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<LoginPage2 />} />

        {/* ROTAS PROTEGIDAS */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <PrivateLayout />
            </PrivateRoute>
          }
        >
          {/* Se acessar "/" → redireciona para dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<DashBoardPage />} />
          <Route path="rt-page" element={<Rtadmin2 />} />
          <Route path="resumo-etapas" element={<ResumoEtapasPage />} />
          <Route path="analise-np" element={<AnaliseNpPage />} />
          <Route path="adm-prof-jmonte" element={<AdminProjJmonte />} />
          <Route path="adm-prof-usuarios" element={<AdminProfUsuarios />} />
          <Route path="adm-prof-premios" element={<AdminProfPremios />} />
          <Route path="adm-prof-premios-pedidos" element={<AdminProfPremiosPedidos />} />
          <Route path="entregas-pedidos" element={<EntregasPedidos />} />
          <Route path="grupo-subgrupo" element={<GrupoComponente />} />
          <Route path="admin-usuarios" element={<AdminUsuarios />} />
          <Route path="auditoria" element={<AdminAuditoria />} />
          <Route path="ti-painel" element={<TIPage />} />
          <Route path="monitoramento-vendedores" element={<MonitoramentoPage />} />
          <Route path="configs" element={<ConfigPage />} />
          <Route path="gestao-obras" element={<GestaoObrasComponent />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;