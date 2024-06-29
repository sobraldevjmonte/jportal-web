import { FilterOutlined } from "@ant-design/icons";
import { Spin, Row, Col, Typography, Table, Button, DatePicker, Select, Space, TableColumnsType, Pagination } from "antd";
import Title from "antd/es/typography/Title";
import { SetStateAction, useContext, useEffect, useState } from "react";
import ListaVendedoresComponent from "../components/ListaVendedoresComponent";
import ListaLojasComponent from "../components/listaLojasComponent";
import EtapasService from "../service/EtapasService";
import TabelaPendeciasVendasVendedoresComponent from "../components/tabelaPendenciasVendas/vendedores/TabelaPendenciasVendasVendedoresComponent";
import TabelaPendeciasVendasGerentesComponent from '../components/tabelaPendenciasVendas/gerentes/TabelaPendeciasVendasGerentesComponent';

import { UsuarioContext } from "../context/useContext";
import TabelaPendeciasVendasAdministradorComponent from "../components/tabelaPendenciasVendas/adm/TabelaPendeciasVendasAdministradorComponent";

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

                {idNivelUsuario === 3 ? <TabelaPendeciasVendasVendedoresComponent/> : null}
                {idNivelUsuario === 2 ? <TabelaPendeciasVendasGerentesComponent /> : null}
                {idNivelUsuario === 1 ||  idNivelUsuario === 11 ? <TabelaPendeciasVendasAdministradorComponent /> : null}
            </div>
        </>
    )
}