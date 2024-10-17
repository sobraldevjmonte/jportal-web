import { Row } from "antd";
import { useContext, useState } from "react";
import { UsuarioContext } from "../context/useContext";
import TabelaEntregasContatosVendedoresComponent from "../components/entregasPedidos/vendas/TabelaEntregasContatosVendedoresComponent";
import TabelaEntregasContatosGerentesComponent from "../components/entregasPedidos/gerentes/TabelaEntregasContatosGerentesComponent";
import TabelaEntregasContatosAdminComponent from "../components/entregasPedidos/adm/TabelaEntregasContatosAdminComponent";

export default function EntregasPedidos() {
    
const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
const { idLoja, setIdLoja } = useContext(UsuarioContext)

const [lojaSelecionadaResumo, setLojaSelecionadaResumo] = useState(0);
const [vendedoVendedorSelecionadoResumo, setVendedorSelecionadoResumo] = useState(0);
const [liberarListaVendedores, setLiberarListaVendedores] = useState(false);


    return (
        <div>
            <div>
                {idNivelUsuario === 3 || idNivelUsuario === 13 ? <TabelaEntregasContatosVendedoresComponent /> : null} {/*vendedores*/}
                {idNivelUsuario === 12 || idNivelUsuario === 2 ? <TabelaEntregasContatosGerentesComponent /> : null}{/*gerentes*/}
                {idNivelUsuario === 1 || idNivelUsuario === 11 || idNivelUsuario === 9 ? <TabelaEntregasContatosAdminComponent /> : null}{/*admin,TI, compras*/}
            </div>
        </div>
    )
}