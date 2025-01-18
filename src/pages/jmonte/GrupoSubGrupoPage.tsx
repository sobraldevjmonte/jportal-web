import { useContext } from "react";
import { UsuarioContext } from "../../context/useContext";
import GrupoComponente from "../../components/jmonte/grupo-subgrupo/GrupoComponente";


export default function GrupoSubGrupoPage() {
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
    const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);

    return (
        <div>
            <GrupoComponente />
        </div>
    )
}