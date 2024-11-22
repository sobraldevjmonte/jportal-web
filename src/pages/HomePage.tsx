import { useContext, useEffect, useState } from "react";
import MenuComponent from '../common/MenuComponent';
import LoginPage2 from "./LoginPage2";

import { UsuarioContext } from "../context/useContext";


export default function HomePage() {

    const {logado, setLogado} = useContext(UsuarioContext);

    return (
        <>
            { logado ? <MenuComponent /> : <LoginPage2 /> }
            { /*  <MenuComponent/><Rtadmin2/> */}
        </>
    )
}