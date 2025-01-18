import { Button, Col, Row, Spin, Table, TableColumnsType, Tooltip, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import EtapasService from "../../../../service/EtapasService";

import { FilePdfOutlined, SyncOutlined } from "@ant-design/icons";
import { UsuarioContext } from "../../../../context/useContext";
import TabelaPendeciasVendasVendedoresGerenciaComponent from "../gerentes/TabelaPendeciasVendasVendedoresGerenciaComponent";

import { formatarMoeda } from "../../../../utils/formatarValores"


const service = new EtapasService()

interface PendenciasVendasType {
    key: string;
    idvendedor: number;
    idLoja: number;
    codigoVendedor: string;
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

interface PropsPendencias {
    idLoja: number;
    idVendedor: number;
}

export default function TabelaPendeciasVendasLojasAdminComponent(props: any) {
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
    const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idLoja, setIdLoja } = useContext(UsuarioContext);

    const [dados, setDados] = useState([]);
    const [quantidade, setQuantidade] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        listaPendenciasVendasGerente()
    }, [])

    async function listaPendenciasVendasGerente() {

        setLoading(true);
        try {
            let rs = await service.listaPendenciasVendasGerentes(props.idLoja, 'DESC');
            setDados(rs.data.vendedores)
            setQuantidade(rs.data.quantidade)
            console.log('****** etapas gerentes ******');
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    }

    const tamFonte = '0.9rem';
    const corDestaque = '#000'

    const columns: TableColumnsType<PendenciasVendasType> = [
        {
            title: 'Vendedor', dataIndex: 'nomevendedor', key: 'nomevendedor',
            sorter: (a: any, b: any) => a.nomevendedor.localeCompare(b.nomevendedor),
            render: (text: string) => <span style={{ fontSize: tamFonte, }}>{text}</span>
        },
        {
            title: 'TTL Vendas', dataIndex: 'total_reais_pendencias', key: 'total_reais_pendencias', width: '120px', align: 'right',
            sorter: (a: any, b: any) => a.total_reais_pendencias - b.total_reais_pendencias,
            defaultSortOrder: 'descend', // Ordem padrão descendente
            render: (total_reais_pendencias, record) => <span style={{ fontSize: tamFonte, }}>{total_reais_pendencias !== null ? total_reais_pendencias : '0.00'}</span>
        },
        {
            title: 'BASICOS', dataIndex: 'etapa1', key: 'nomeVendedor', align: 'right',
            render: (etapa1, record) => <span style={{ fontSize: tamFonte, color: record.etapa1 > 1000 ? corDestaque : '#000' }}> {etapa1 !== null ? formatarMoeda(+etapa1) : '0.00'}</span>
        },
        {
            title: 'EPI/IMP/FERRAM', dataIndex: 'etapa2', key: 'nomeVendedor', align: 'right',
            render: (etapa2, record) => <span style={{ fontSize: tamFonte, color: record.etapa2 > 1000 ? corDestaque : '#000' }}> {etapa2 !== null ? formatarMoeda(+etapa2) : '0.00'}</span>
        },
        {
            title: 'HIDRAULICOS', dataIndex: 'etapa3', key: 'nomeVendedor', align: 'right',
            render: (etapa3, record) => <span style={{ fontSize: tamFonte, color: record.etapa3 > 1000 ? corDestaque : '#000' }}> {etapa3 !== null ? formatarMoeda(+etapa3) : '0.00'}</span>
        },
        {
            title: 'CABOS', dataIndex: 'etapa4', key: 'nomeVendedor', align: 'right',
            render: (etapa4, record) => <span style={{ fontSize: tamFonte, color: record.etapa4 > 1000 ? corDestaque : '#000' }}> {etapa4 !== null ? formatarMoeda(+etapa4) : '0.00'}</span>
        },
        {
            title: 'TOM/AC', dataIndex: 'etapa5', key: 'nomeVendedor', align: 'right',
            render: (etapa5, record) => <span style={{ fontSize: tamFonte, color: record.etapa5 > 1000 ? corDestaque : '#000' }}> {etapa5 !== null ? formatarMoeda(+etapa5) : '0.00'}</span>
        },
        {
            title: 'PISOS/REV/ACES/ARG/REJ', dataIndex: 'etapa6', key: 'nomeVendedor', align: 'right',
            render: (etapa6, record) => <span style={{ fontSize: tamFonte, color: record.etapa6 > 2000 ? corDestaque : '#000' }}>{etapa6 !== null ? formatarMoeda(+etapa6) : '0.00'}</span>
        },
        {
            title: 'LOUC/MET/PIAS/CB/GB/BAN', dataIndex: 'etapa7', key: 'nomeVendedor', align: 'right',
            render: (etapa7, record) => <span style={{ fontSize: tamFonte, color: record.etapa7 > 1000 ? corDestaque : '#000' }}> {etapa7 !== null ? formatarMoeda(+etapa7) : '0.00'}</span>
        },
        {
            title: 'PORTAS/FERRAG/FECH', dataIndex: 'etapa8', key: 'nomeVendedor', align: 'right',
            render: (etapa8, record) => <span style={{ fontSize: tamFonte, color: record.etapa8 > 1000 ? corDestaque : '#000' }}> {etapa8 !== null ? formatarMoeda(+etapa8) : '0.00'}</span>
        },
        {
            title: 'PINTURAS', dataIndex: 'etapa9', key: 'nomeVendedor', align: 'right',
            render: (etapa9, record) => <span style={{ fontSize: tamFonte, color: record.etapa9 > 1000 ? corDestaque : '#000' }}> {etapa9 !== null ? formatarMoeda(+etapa9) : '0.00'}</span>
        },
        {
            title: 'ILUMINACAO', dataIndex: 'etapa10', key: 'nomeVendedor', align: 'right',
            render: (etapa10, record) => <span style={{ fontSize: tamFonte, color: record.etapa10 > 1000 ? corDestaque : '#000' }}> {etapa10 !== null ? formatarMoeda(+etapa10) : '0.00'}</span>
        },
    ];

    //***************** Inserindo Componente TabelaPendenciasVendasVendedoreNps  ******************/
    const expandedRowRender = (record: any) => {
        let id = record.codigoVendedor
        return <TabelaPendeciasVendasVendedoresGerenciaComponent codigoVendedor={id} />;
    };

    const [notificacao, setNotificacao] = useState<{ message: string, description: string } | null>(null);

    async function gerarPdfObrasLoja() {
        try {
            setLoading(true);
            const response = await service.gerarPdfObrasLoja(props.idLoja);

            if (response.status === 200) {
                if (response.data.size === 0) { // Verifica se o PDF está vazio
                    alert('Sem dados para gerar o PDF');
                    return; // Interrompe o fluxo se não houver dados
                }

                // Criar um link de download para o PDF
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `pedidos_obras_.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove(); // Remove o link após o clique
            } else {
                alert('Nenhum registro para o período ');
                setNotificacao({ message: 'Atenção!', description: 'Nenhum registro para o período '  });
            }

        } catch (error) {
            alert('Nenhum registro para o período ' );
            setNotificacao({ message: 'Atenção!', description: 'Nenhum registro para o período ' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div>
                <div>
                    <Button icon={<SyncOutlined />} onClick={() => listaPendenciasVendasGerente()} style={{ backgroundColor: '', color: '', borderColor: '#000', margin: '15px', marginTop: '15px', width: '130px' }} title="Atualizar todos os registros">Atualizar</Button>
                
                    <Tooltip title="Gerar pdf com todos os clientes marcados como OBRA(Somente da loja)" color="#000">
                        <Button icon={<FilePdfOutlined />} onClick={() => gerarPdfObrasLoja()} style={{ backgroundColor: '#ffF', color: '#000', borderColor: '#2F4F4F', marginRight: '5px', width: '130px' }} title="Gerar pdf com todos os clientes marcados como OBRA(Somente da loja)">Obras Pdf</Button>
                    </Tooltip>
                </div>
                <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '30%', transform: 'translate(-50%, -50%)' }}>
                    <div style={{ backgroundColor: '#fff' }}>
                        <Row style={{ display: 'flex', flexDirection: 'column' }}>
                            <Col>
                                <Typography style={{ fontSize: '24px', marginBottom: '10px' }}>
                                    Resumo Etapas(Vendedores)
                                </Typography>
                            </Col>
                        </Row>
                    </div>
                    <div style={{ paddingTop: '20px', paddingLeft: '0px', position: 'relative', backgroundColor: '#B0E0E6' }}>
                        <Table
                            columns={columns}
                            dataSource={dados}
                            size="small"
                            rowKey={(record) => record.codigoVendedor}
                            bordered
                            style={{ backgroundColor: '#B0E0E6', width: '99%' }}
                            title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>Vendedores({quantidade})</Typography>}
                            expandedRowRender={expandedRowRender}
                        />
                    </div>
                </Spin>
            </div>
        </>
    )
}