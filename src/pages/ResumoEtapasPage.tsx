import { Row } from "antd";
import { useContext, useState } from "react";
import ListaVendedoresComponent from "../components/ListaVendedoresComponent";
import TabelaPendeciasVendasGerentesComponent from '../components/tabelaPendenciasVendas/gerentes/TabelaPendeciasVendasGerentesComponent';
import TabelaPendeciasVendasVendedoresComponent from "../components/tabelaPendenciasVendas/vendedores/TabelaPendenciasVendasVendedoresComponent";

import TabelaPendeciasVendasAdministradorComponent from "../components/tabelaPendenciasVendas/adm/TabelaPendeciasVendasAdministradorComponent";
import { UsuarioContext } from "../context/useContext";


export default function ResumoEtapasPage() {

    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
    const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
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
                {idNivelUsuario === 12 || idNivelUsuario === 2 ? <TabelaPendeciasVendasGerentesComponent /> : null}{/*gerentes*/}
                {idNivelUsuario === 1 || idNivelUsuario === 11 || idNivelUsuario === 9 ? <TabelaPendeciasVendasAdministradorComponent /> : null}{/*admin,TI, compras*/}
            </div>
        </>
    )
}