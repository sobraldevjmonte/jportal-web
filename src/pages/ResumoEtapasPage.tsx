import { Row } from "antd";
import { useContext, useState } from "react";
import ListaVendedoresComponent from "../components/ListaVendedoresComponent";
import TabelaPendeciasVendasGerentesComponent from '../components/tabelaPendenciasVendas/gerentes/TabelaPendeciasVendasGerentesComponent';
import TabelaPendeciasVendasVendedoresComponent from "../components/tabelaPendenciasVendas/vendedores/TabelaPendenciasVendasVendedoresComponent";
import EtapasService from "../service/EtapasService";

import TabelaPendeciasVendasAdministradorComponent from "../components/tabelaPendenciasVendas/adm/TabelaPendeciasVendasAdministradorComponent";
import { UsuarioContext } from "../context/useContext";

const service = new EtapasService()



interface PendenciasVendasType {
    key: string;
    seq: string;
    idvendedor: number;
    nomecliente: string;
    totalcliente: string;
    nomeVendedor: string;
    codigoLoja: string;
    etapa1: number;
    etapa2: number;
    etapa3: number;
    etapa4: number;
    etapa5: number;
    etapa6: number;
    etapa7: number;
    etapa8: number;
    etapa9: number;
    etapa10: number;
}

interface LojasType {
    cod_loja_pre: number;
    codloja: string;
    descricao: string;
}

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
                    {/*<ListaLojasComponent funcao={_selecionarLoja} /> */}
                    {liberarListaVendedores ? <ListaVendedoresComponent idLoja={lojaSelecionadaResumo} /> : null}
                </Row>

                {idNivelUsuario === 3 ? <TabelaPendeciasVendasVendedoresComponent/> : null} {/*vendedores*/}
                {idNivelUsuario === 13 ? <TabelaPendeciasVendasVendedoresComponent/> : null} {/*promotores*/}
                {idNivelUsuario === 9 ? <TabelaPendeciasVendasAdministradorComponent /> : null}{/*compras*/}
                {idNivelUsuario === 12 ? <TabelaPendeciasVendasGerentesComponent /> : null}{/*gerentes*/}
                {idNivelUsuario === 2 ? <TabelaPendeciasVendasGerentesComponent /> : null}{/*gerentes*/}
                {idNivelUsuario === 1 ||  idNivelUsuario === 11 ? <TabelaPendeciasVendasAdministradorComponent /> : null}{/*admin e TI*/}
            </div>
        </>
    )
}