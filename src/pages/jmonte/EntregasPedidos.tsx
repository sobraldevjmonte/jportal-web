import { Row } from "antd";
import { useContext, useState } from "react";
import { UsuarioContext } from "../../context/useContext";
import TabelaEntregasContatosVendedoresComponent from "../../components/jmonte/entregasPedidos/vendas/TabelaEntregasContatosVendedoresComponent";
import TabelaEntregasContatosGerentesComponent from "../../components/jmonte/entregasPedidos/gerentes/TabelaEntregasContatosGerentesComponent";
import TabelaEntregasContatosAdminComponent from "../../components/jmonte/entregasPedidos/adm/TabelaEntregasContatosAdminComponent";

export default function EntregasPedidos() {
    
const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
const { idLoja, setIdLoja } = useContext(UsuarioContext)
const { subNivel1, setSubNivel1 } = useContext(UsuarioContext);

const [lojaSelecionadaResumo, setLojaSelecionadaResumo] = useState(0);
const [vendedoVendedorSelecionadoResumo, setVendedorSelecionadoResumo] = useState(0);
const [liberarListaVendedores, setLiberarListaVendedores] = useState(false);


    return (
        <div>
            <div>
                {idNivelUsuario === 3 || idNivelUsuario === 13 ? <TabelaEntregasContatosVendedoresComponent /> : null} {/*vendedores*/}
                {idNivelUsuario === 4 && subNivel1 === 3 ? <TabelaEntregasContatosGerentesComponent /> : null} {/*caixa*/}
                {idNivelUsuario === 12 || idNivelUsuario === 2 ? <TabelaEntregasContatosGerentesComponent /> : null}{/*gerentes*/}
                {idNivelUsuario === 1 || idNivelUsuario === 11 || idNivelUsuario === 9 ? <TabelaEntregasContatosAdminComponent /> : null}{/*admin,TI, compras*/}
            </div>
        </div>
    )
}