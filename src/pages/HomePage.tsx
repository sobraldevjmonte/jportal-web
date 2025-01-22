import { useContext, useEffect, useState } from "react";
import MenuComponent from "../common/MenuComponent";
import LoginPage2 from "./LoginPage2";

import { UsuarioContext } from "../context/useContext";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const { logado } = useContext(UsuarioContext);
    const navigate = useNavigate();
    const [redirected, setRedirected] = useState(false); // Novo estado para rastrear o redirecionamento

    useEffect(() => {
        if (logado && !redirected) {
            navigate("/dashboard");
            setRedirected(true); // Marca que o redirecionamento foi realizado
        }
    }, [logado, redirected, navigate]);

    return (
        <>
            {logado ? <MenuComponent /> : <LoginPage2 />}
        </>
    );
}
