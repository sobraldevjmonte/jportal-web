import { useContext, useEffect } from "react";
import { UsuarioContext } from "../context/useContext";
import { useNavigate, Outlet } from "react-router-dom";
import MenuComponent from "../common/MenuComponent";
import LoginPage2 from "./LoginPage2";

export default function HomePage() {
    const { logado } = useContext(UsuarioContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Se não estiver logado, manda para o login
        if (!logado) {
            navigate("/login");
        }
    }, [logado, navigate]);

    if (!logado) {
        return <LoginPage2 />;
    }

    return (
        <div className="layout-container">
            {/* O MenuComponent fica fixo na tela */}
            <MenuComponent />
            
            {/* O Outlet é OBRIGATÓRIO aqui. 
               É ele quem decide onde o DashboardPage ou AnaliseNpPage serão desenhados.
            */}
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
}