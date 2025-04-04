import { Row } from "antd";
import { useContext, useState } from "react";

import { UsuarioContext } from "../../context/useContext";
import ListaVendedoresComponent from "../../components/jmonte/ListaVendedoresComponent";
import TabelaPendeciasVendasVendedoresComponent from "../../components/jmonte/tabelaPendenciasVendas/vendedores/TabelaPendenciasVendasVendedoresComponent";
import TabelaPendeciasVendasGerentesComponent from "../../components/jmonte/tabelaPendenciasVendas/gerentes/TabelaPendeciasVendasGerentesComponent";
import TabelaPendeciasVendasAdministradorComponent from "../../components/jmonte/tabelaPendenciasVendas/adm/TabelaPendeciasVendasAdministradorComponent";

export default function ResumoEtapasPage() {

    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
    const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { subNivel1, setSubNivel1 } = useContext(UsuarioContext); 
    // subNivel1 = 2 profissionais premios
    // subNivel1 = 3 etapas nao gerente
    const { idLoja, setIdLoja } = useContext(UsuarioContext)

    const [lojaSelecionadaResumo, setLojaSelecionadaResumo] = useState(0);
    const [vendedoVendedorSelecionadoResumo, setVendedorSelecionadoResumo] = useState(0);
    const [liberarListaVendedores, setLiberarListaVendedores] = useState(false);

    return (
        <>
            <div>
                <Row>
                    {liberarListaVendedores ? <ListaVendedoresComponent idLoja={lojaSelecionadaResumo} /> : null}
                </Row>

                {idNivelUsuario === 3 || idNivelUsuario === 13 ? <TabelaPendeciasVendasVendedoresComponent /> : null} {/*vendedores*/}
                {idNivelUsuario === 4 && subNivel1 === 3 ? <TabelaPendeciasVendasGerentesComponent /> : null} {/*vendedores*/}
                {idNivelUsuario === 12 || idNivelUsuario === 2 ? <TabelaPendeciasVendasGerentesComponent /> : null}{/*gerentes*/}
                {idNivelUsuario === 1 || idNivelUsuario === 11 || idNivelUsuario === 9 ? <TabelaPendeciasVendasAdministradorComponent /> : null}{/*admin,TI, compras*/}
            </div>
        </>
    )
}