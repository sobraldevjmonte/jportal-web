import { useContext } from "react";
import { UsuarioContext } from "../context/useContext";
import TablelaAnaliseNpAdminComponente from "../components/tabelaAnaliseNp/adm/TablelaAnaliseNpAdminComponente";


export default function AnaliseNpPage() {
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
    const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);

    return (
        <>
            <div>
                <TablelaAnaliseNpAdminComponente />
            </div>

        </>
    )
}