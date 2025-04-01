import { useContext, useEffect, useRef } from "react";
import MenuComponent from "../common/MenuComponent";
import LoginPage2 from "./LoginPage2";

import { UsuarioContext } from "../context/useContext";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const { logado } = useContext(UsuarioContext);
    const navigate = useNavigate();
    const jaRedirecionou = useRef(false); // Referência para evitar múltiplos redirecionamentos

    useEffect(() => {
        if (logado && !jaRedirecionou.current) {
            jaRedirecionou.current = true; // Marca que o redirecionamento já ocorreu
            navigate("/dashboard");
        }
    }, [logado, navigate]);
    return (
        <>
            {logado ? <MenuComponent /> : <LoginPage2 />}
        </>
    );
}
