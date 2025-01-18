import { useContext, useEffect } from "react";
import DashBoardVendedoresComponent from "../../components/jmonte/dashboard/DashBoardVendedoresComponent";
import { UsuarioContext } from "../../context/useContext";
import DashBoardGerentesComponent from "../../components/jmonte/dashboard/DashBoardGerentesComponent";


export default function DashBoardPage(props: any) {

    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { icomp, setIcomp } = useContext(UsuarioContext);
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);

    useEffect(() => {
        console.log('idNivelUsuario -> ' + idNivelUsuario)
    })

    return (
        <div>
            {idNivelUsuario === 3 ? <DashBoardVendedoresComponent /> : <DashBoardGerentesComponent />}
        </div>
    )
}