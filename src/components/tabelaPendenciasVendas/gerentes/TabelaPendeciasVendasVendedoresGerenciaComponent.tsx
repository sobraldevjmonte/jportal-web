import { EditOutlined, FileSearchOutlined, SyncOutlined } from "@ant-design/icons";
import { TableColumnsType, Button, Modal, Typography, Spin, Row, Col, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useContext, useState, useEffect } from "react";
import { UsuarioContext } from "../../../context/useContext";
import TabelaPendenciasVendasContatosComponent from "../TabelaPendenciasVendasContatosComponent";
import TabelaPendenciasSomaEtapasComponent from "../vendedores/TabelaPendenciasSomaEtapasComponent";
import EtapasService from "../../../service/EtapasService";

const service = new EtapasService()

interface PendenciasVendasType {
    key: string;
    seq: string;
    idvendedor: number;
    nomecliente: string;
    idcliente: number;
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
    contatou: boolean;
}

interface PropsPendencias {
    idLoja: number;
    idVendedor: number;
}
export default function TabelaPendeciasVendasVendedoresGerenciaComponent(props: any){
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
    const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);

    const [dados, setDados] = useState([]);
    const [quantidade, setQuantidade] = useState(0);
    const [loading, setLoading] = useState(false);

    const[ ordem, setOrdem] = useState('DESC');


    useEffect(() => {
        listaPendenciasVendas()
    }, [])

    async function listaPendenciasVendas() {

        setLoading(true);
        try {
            let rs = await service.listaPendenciasVendas(props.codigoVendedor, ordem);
            console.log(rs.data)
            setDados(rs.data.pendenciasVendas)
            setQuantidade(rs.data.quantidade)
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    }

    const tamFonte = '0.9rem';
    const colorContatou = 'blue'
    const corDestaque = 'red'

    const columns: TableColumnsType<PendenciasVendasType> = [
        {
            title: 'Cliente',
            dataIndex: 'nomecliente',
            key: 'nomecliente',
            sorter: (a: any, b: any) => a.nomecliente.localeCompare(b.nomecliente),
            render: (text, record) => {
                const truncatedText = text.length > 30 ? `${text.substring(0, 30)}...` : text;
                return (
                    <span
                        title={record.contatou ? 'Cliente já foi contatado.' : ''}
                        style={{ fontSize: tamFonte, color: record.contatou ? colorContatou : '#000' }}
                        className="cliente-cell"
                    >
                        {truncatedText}
                    </span>
                );
            },
        },
        {
            title: 'TTL Vendas',
            dataIndex: 'totalcliente',
            key: 'totalcliente',
            width: '120px',
            align: 'right',
            sorter: (a: any, b: any) => a.totalcliente - b.totalcliente,
            render: (totalcliente) => (
                <span title="Total em R$ das pendências do cliente" style={{ fontSize: tamFonte }}>
                    R$ {Number(totalcliente).toFixed(2)}
                </span>
            ),
        },
        { title: 'BASICOS', dataIndex: 'etapa1', key: 'nomeVendedor', align: 'right', render: (etapa1, record) => <span style={{ fontSize: tamFonte, color: record.etapa1 > 1000 ? corDestaque : '#000' }}>R$ {etapa1 !== null ? etapa1 : '0.00'}</span> },
        { title: 'EPI/IMP/FERRAM', dataIndex: 'etapa2', key: 'nomeVendedor', align: 'right', render: (etapa2, record) => <span style={{ fontSize: tamFonte, color: record.etapa2 > 1000 ? corDestaque : '#000' }}>R$ {etapa2 !== null ? etapa2 : '0.00'}</span> },
        { title: 'HIDRAULICOS', dataIndex: 'etapa3', key: 'nomeVendedor', align: 'right', render: (etapa3, record) => <span style={{ fontSize: tamFonte, color: record.etapa3 > 1000 ? corDestaque : '#000' }}>R$ {etapa3 !== null ? etapa3 : '0.00'}</span> },
        { title: 'CABOS', dataIndex: 'etapa4', key: 'nomeVendedor', align: 'right', render: (etapa4, record) => <span style={{ fontSize: tamFonte, color: record.etapa4 > 1000 ? corDestaque : '#000' }}>R$ {etapa4 !== null ? etapa4 : '0.00'}</span> },
        { title: 'TOM/AC', dataIndex: 'etapa5', key: 'nomeVendedor', align: 'right', render: (etapa5, record) => <span style={{ fontSize: tamFonte, color: record.etapa5 > 1000 ? corDestaque : '#000' }}>R$ {etapa5 !== null ? etapa5 : '0.00'}</span> },
        { title: 'PISOS/REV/ACES/ARG/REJ', dataIndex: 'etapa6', key: 'nomeVendedor', align: 'right', render: (etapa6, record) => <span style={{ fontSize: tamFonte, color: record.etapa6 > 2000 ? corDestaque : '#000' }}>R$ {etapa6 !== null ? etapa6 : '0.00'}</span> },
        { title: 'LOUC/MET/PIAS/CB/GB/BAN', dataIndex: 'etapa7', key: 'nomeVendedor', align: 'right', render: (etapa7, record) => <span style={{ fontSize: tamFonte, color: record.etapa7 > 1000 ? corDestaque : '#000' }}>R$ {etapa7 !== null ? etapa7 : '0.00'}</span> },
        { title: 'PORTAS/FERRAG/FECH', dataIndex: 'etapa8', key: 'nomeVendedor', align: 'right', render: (etapa8, record) => <span style={{ fontSize: tamFonte, color: record.etapa8 > 1000 ? corDestaque : '#000' }}>R$ {etapa8 !== null ? etapa8 : '0.00'}</span> },
        { title: 'PINTURAS', dataIndex: 'etapa9', key: 'nomeVendedor', align: 'right', render: (etapa9, record) => <span style={{ fontSize: tamFonte, color: record.etapa9 > 1000 ? corDestaque : '#000' }}>R$ {etapa9 !== null ? etapa9 : '0.00'}</span> },
        { title: 'ILUMINACAO', dataIndex: 'etapa10', key: 'nomeVendedor', align: 'right', render: (etapa10, record) => <span style={{ fontSize: tamFonte, color: record.etapa10 > 1000 ? corDestaque : '#000' }}>R$ {etapa10 !== null ? etapa10 : '0.00'}</span> },
    ];

    //***************** Inserindo Componente TabelaPendenciasVendasVendedoreNps  ******************/
    const expandedRowRender = (record: any) => {
        let x = record.idcliente
        return <TabelaPendenciasVendasContatosComponent idCliente={x} />;
    };

    return (
        <>
            <div style={{ paddingTop: '10px', backgroundColor: '#FFF5EE' }} >
                <div>
                    <Button type="primary" icon={<SyncOutlined />} onClick={() => listaPendenciasVendas()} style={{ marginTop: '5px', marginBottom: '15px',  marginLeft: '15px',  width: '130px' }} title="Atualizar registros do vendedor">Atualizar</Button>
                </div>
                <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', margin: '0px', left: '50%', top: '30%', transform: 'translate(-50%, -50%)' }}>
                    <div style={{ paddingTop: '10px', paddingLeft: '0px', width: '99%', position: 'relative',backgroundColor: '#FFF5EE' }}>
                        <Table
                            columns={columns}
                            dataSource={dados}
                            //style={{backgroundColor: '#B0E0E6'}}
                            size="small"
                            rowKey={(record) => record.idcliente}
                            bordered
                            style={{backgroundColor: '#FFF5EE'}}
                            title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>Clientes({quantidade})</Typography>}
                            expandedRowRender={expandedRowRender}
                        />
                    </div>
                </Spin>
            </div>
        </>
    )
}