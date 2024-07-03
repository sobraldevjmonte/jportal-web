import Typography from "antd/es/typography/Typography";
import { useContext, useEffect, useState } from "react";

import { formatarMoeda } from '../../../utils/formatarValores';
import { UsuarioContext } from "../../../context/useContext";
import AnaliseNpService from "../../../service/AnaliseNpService";
import { SyncOutlined, TagOutlined } from "@ant-design/icons";
import { TableColumnsType, Button, Col, Row, Spin, Table } from "antd";
import TabelaAnaliseNpProdutosAdminComponent from "./TabelaAnaliseNpProdutosAdminComponent";
const service = new AnaliseNpService()

interface AnaliseNpType {
    key: string;
    seq: string;
    chave: string;
    data: string;
    np: number;
    codvendedor: string;
    vendedor:   string;
    autorizacao: string;
    tipoentrega: string;
    codcliente: string;
    cliente: string;
    indicador: string;
    codformapgto: string;
    plano: string;
    tabela: string;
    promocao: string;
    f10: string;
}

interface PropsAnaliseProdutos {
    idNp: number;
}
export default function TablelaAnaliseNpAdminComponente() {

    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
    const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);

    const [dados, setDados] = useState([]);
    const [registros, setRegistros] = useState(0);
    const [loading, setLoading] = useState(false);


    

    const [valor, setValor] = useState(0)
    useEffect(() => {
        //setValor(formatarMoeda(2525522.25))
        listaNps()
    },[])

    async function listaNps() {

        setLoading(true);
        try {
            let rs = await service.listarNps();
            setDados(rs.data.lista_nps)
            setRegistros(rs.data.registros)
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    }

    const tamFonte = '0.9rem';
    const colorContatou = 'blue'
    const corDestaque = '#000'

    const columns: TableColumnsType<AnaliseNpType> = [
        { title: 'Np', dataIndex: 'np', key: 'np', },
        { title: 'DATA', dataIndex: 'data', key: 'data', },
        { title: 'F10', dataIndex: 'f10', key: 'f10', width: '400px'},
        { title: 'VENDEDOR', dataIndex: 'vendedor', key: 'vendedor', 
            render: (text: string, record: any) => 
                <span  style={{ fontSize: tamFonte}} >{record.vendedor} </span> },
                // <span  style={{ fontSize: tamFonte}} >({record.codvendedor}){record.vendedor} </span> },
        { title: 'AUTORIZADO', dataIndex: 'autorizacao', key: 'autorizacao'},
        { title: 'ENTREGA', dataIndex: 'tipoentrega', key: 'tipoentrega'},
        { title: 'CLIENTE', dataIndex: 'cliente', key: 'cliente', 
            render: (text: string, record: any) => 
                <span  style={{ fontSize: tamFonte}} >{record.cliente} </span> },
        { title: 'INDICADOR', dataIndex: 'indicador', key: 'indicador'},
        { title: 'PLANO', dataIndex: 'plano', key: 'plano'},
        { title: 'TAB', dataIndex: 'tabela', key: 'tabela'},
        { title: 'PROMO.', dataIndex: 'promocao', key: 'promocao'},
    ];

    const expandedRowRender = (record: any) => {
        let x = record.np
        return <TabelaAnaliseNpProdutosAdminComponent np={x} />;
    };
    
    return (
        <>
            <div>
                <div>
                    <Button icon={<SyncOutlined />} onClick={() => listaNps()} style={{ backgroundColor: '#2F4F4F', color: '#fff', borderColor:'#2F4F4F', marginRight: '5px', width: '130px' }} title="Atualizar todos os registros">Atualizar</Button>
                </div>
                <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div style={{ padding: '', position: 'relative' }}>
                        <Table
                            columns={columns}
                            dataSource={dados}
                            size="small"
                            rowKey={(record) => record.np}
                            bordered
                            title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>NPs 01/03/2024({registros}) </Typography>}
                            expandedRowRender={expandedRowRender}
                        />
                    </div>
                </Spin>
            </div>
        </>
    )
}