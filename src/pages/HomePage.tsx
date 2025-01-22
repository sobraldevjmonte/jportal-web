import { useContext, useEffect, useState } from "react";
import MenuComponent from '../common/MenuComponent';
import LoginPage2 from "./LoginPage2";

import { UsuarioContext } from "../context/useContext";
import { useNavigate } from "react-router-dom";


export default function HomePage() {
    const { logado, setLogado } = useContext(UsuarioContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (logado) {
            navigate("/dashboard"); // Redireciona para a página inicial do sistema
        }
    }, [logado, navigate]); // Executa o efeito sempre que `logado` mudar

    return (
        <>
            {logado ? <MenuComponent /> : <LoginPage2 />}
            { /*  <MenuComponent/><Rtadmin2/> */}
        </>
    )
}