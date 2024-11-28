import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../../../../context/useContext";
import EtapasService from "../../../../service/EtapasService";
import { Button, Col, Row, Spin, Table, TableColumnsType, Tooltip, Typography } from "antd";
import { FilePdfOutlined, PrinterOutlined, SyncOutlined } from "@ant-design/icons";
import TabelaPendenciasSomaEtapasAdminComponent from "./TabelaPendenciasSomaEtapasAdminComponent";
import TabelaPendeciasVendasLojasAdminComponent from "./TabelaPendeciasVendasLojasAdminComponent";

import { formatarMoeda } from "../../../../utils/formatarValores"

import { Notificacao } from '../../notificacoes/notification';

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

export default function TabelaPendeciasVendasAdministradorComponent() {
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
    const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idLoja, setIdLoja } = useContext(UsuarioContext);

    const [dados, setDados] = useState([]);
    const [quantidade, setQuantidade] = useState(0);
    const [tatalgx, setTotalGx] = useState(0);

    const [loading, setLoading] = useState(false);

    //******************** mes/ano  *************************/
    const dataAtual = new Date();
    let mesAtual: number;
    let anoAtual: number;
    //****************************************************/


    useEffect(() => {
        listaPendenciasVendasGerente()

        mesAtual = dataAtual.getMonth() + 1;
        anoAtual = dataAtual.getFullYear();
    }, [])

    async function listaPendenciasVendasGerente() {

        setLoading(true);
        try {
            let rs = await service.listaPendenciasVendasAdmin(idLoja);
            setDados(rs.data.pendenciasAdminVendas)
            setTotalGx(rs.data.totalgeral)
            setQuantidade(rs.data.quantidade)
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
            title: 'LOJA', dataIndex: 'fantasia', key: 'fantasia',
            sorter: (a: any, b: any) => a.fantasia.localeCompare(b.fantasia),
            // defaultSortOrder: 'ascend',
            render: (text: string) => <span style={{ fontSize: tamFonte, }}>{text}</span>
        },
        {
            title: 'TTL Vendas', dataIndex: 'totalvendas', key: 'totalvendas', width: '120px', align: 'right',
            sorter: (a: any, b: any) => a.totalvendas - b.totalvendas,
            defaultSortOrder: 'descend', // Ordem padrão descendente
            render: (totalvendas, record) => <span style={{ fontSize: tamFonte, }}>{totalvendas !== null ? formatarMoeda(+totalvendas) : formatarMoeda(0)}</span>
        },
        { title: '%', dataIndex: 'totalvendas', key: 'totalvendas', width: '40px', align: 'right', render: (totalvendas, record) => <span style={{ fontSize: tamFonte, }}>{totalvendas > 0 ? ((totalvendas / tatalgx) * 100).toFixed(2) : '0'}</span> },
        { title: 'BASICOS', dataIndex: 'etapa1', key: 'nomeVendedor', align: 'right', render: (etapa1, record) => <span style={{ fontSize: tamFonte, color: record.etapa1 > 1000 ? corDestaque : '#000' }}>{etapa1 !== null ? formatarMoeda(+etapa1) : '0.00'}</span> },
        { title: 'EPI/IMP/FERRAM', dataIndex: 'etapa2', key: 'nomeVendedor', align: 'right', render: (etapa2, record) => <span style={{ fontSize: tamFonte, color: record.etapa2 > 1000 ? corDestaque : '#000' }}>{etapa2 !== null ? formatarMoeda(+etapa2) : '0.00'}</span> },
        { title: 'HIDRAULICOS', dataIndex: 'etapa3', key: 'nomeVendedor', align: 'right', render: (etapa3, record) => <span style={{ fontSize: tamFonte, color: record.etapa3 > 1000 ? corDestaque : '#000' }}> {etapa3 !== null ? formatarMoeda(+etapa3) : '0.00'}</span> },
        { title: 'CABOS', dataIndex: 'etapa4', key: 'nomeVendedor', align: 'right', render: (etapa4, record) => <span style={{ fontSize: tamFonte, color: record.etapa4 > 1000 ? corDestaque : '#000' }}> {etapa4 !== null ? formatarMoeda(+etapa4) : '0.00'}</span> },
        { title: 'TOM/AC', dataIndex: 'etapa5', key: 'nomeVendedor', align: 'right', render: (etapa5, record) => <span style={{ fontSize: tamFonte, color: record.etapa5 > 1000 ? corDestaque : '#000' }}> {etapa5 !== null ? formatarMoeda(+etapa5) : '0.00'}</span> },
        { title: 'PISOS/REV/ACES/ARG/REJ', dataIndex: 'etapa6', key: 'nomeVendedor', align: 'right', render: (etapa6, record) => <span style={{ fontSize: tamFonte, color: record.etapa6 > 2000 ? corDestaque : '#000' }}> {etapa6 !== null ? formatarMoeda(+etapa6) : '0.00'}</span> },
        { title: 'LOUC/MET/PIAS/CB/GB/BAN', dataIndex: 'etapa7', key: 'nomeVendedor', align: 'right', render: (etapa7, record) => <span style={{ fontSize: tamFonte, color: record.etapa7 > 1000 ? corDestaque : '#000' }}> {etapa7 !== null ? formatarMoeda(+etapa7) : '0.00'}</span> },
        { title: 'PORTAS/FERRAG/FECH', dataIndex: 'etapa8', key: 'nomeVendedor', align: 'right', render: (etapa8, record) => <span style={{ fontSize: tamFonte, color: record.etapa8 > 1000 ? corDestaque : '#000' }}> {etapa8 !== null ? formatarMoeda(+etapa8) : '0.00'}</span> },
        { title: 'PINTURAS', dataIndex: 'etapa9', key: 'nomeVendedor', align: 'right', render: (etapa9, record) => <span style={{ fontSize: tamFonte, color: record.etapa9 > 1000 ? corDestaque : '#000' }}>{etapa9 !== null ? formatarMoeda(+etapa9) : '0.00'}</span> },
        { title: 'ILUMINACAO', dataIndex: 'etapa10', key: 'nomeVendedor', align: 'right', render: (etapa10, record) => <span style={{ fontSize: tamFonte, color: record.etapa10 > 1000 ? corDestaque : '#000' }}> {etapa10 !== null ? formatarMoeda(+etapa10) : '0.00'}</span> },
    ];

    //***************** Inserindo Componente TabelaPendenciasVendasVendedoreNps  ******************/
    const expandedRowRender = (record: any) => {
        let id = record.idLoja
        return <TabelaPendeciasVendasLojasAdminComponent idLoja={id} />;
    };

    const [notificacao, setNotificacao] = useState<{ message: string, description: string } | null>(null);

    async function gerarPdfObras() {
        try {
            setLoading(true);
            const response = await service.gerarPdfObras(idLoja);

            if (response.status === 200) {
                if (response.data.size === 0) { // Verifica se o PDF está vazio
                    alert('Sem dados para gerar o PDF');
                    return; // Interrompe o fluxo se não houver dados
                }

                // Criar um link de download para o PDF
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `pedidos_obras_${mesAtual}_${anoAtual}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove(); // Remove o link após o clique
            } else {
                alert('Nenhum registro para o período ' + mesAtual + "/" + anoAtual);
                setNotificacao({ message: 'Atenção!', description: 'Nenhum registro para o período ' + mesAtual + "/" + anoAtual });
            }

        } catch (error) {
            alert('Nenhum registro para o período ' + mesAtual + "/" + anoAtual);
            setNotificacao({ message: 'Atenção!', description: 'Nenhum registro para o período ' + mesAtual + "/" + anoAtual });
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
            <div style={{ maxWidth: '2800px' }}>
                <div>
                    <Button icon={<SyncOutlined />} onClick={() => listaPendenciasVendasGerente()} style={{ backgroundColor: '#2F4F4F', color: '#fff', borderColor: '#2F4F4F', marginRight: '5px', width: '130px' }} title="Atualizar todos os registros">Atualizar</Button>

                    <Tooltip title="Gerar pdf com todos marcados como OBRA." color="#000">
                        <Button icon={<FilePdfOutlined />} onClick={() => gerarPdfObras()} style={{ backgroundColor: '#ffF', color: '#000', borderColor: '#2F4F4F', marginRight: '5px', width: '130px' }} title="Atualizar todos os registros">Obras Pdf</Button>
                    </Tooltip>
                </div>
                <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '30%', transform: 'translate(-50%, -50%)' }}>
                    <div style={{ backgroundColor: '#fff' }}>
                        <TabelaPendenciasSomaEtapasAdminComponent />
                        <Row style={{ display: 'flex', flexDirection: 'column' }}>
                            <Col>
                                <Typography style={{ fontSize: '24px' }}>
                                    Resumo Etapas(Admin)
                                </Typography>
                            </Col>
                        </Row>
                    </div>
                    <div style={{ padding: '', position: 'relative' }}>
                        <Table
                            columns={columns}
                            dataSource={dados}
                            size="small"
                            rowKey={(record) => record.idLoja}
                            bordered
                            title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>Vendedores({quantidade})</Typography>}
                            expandedRowRender={expandedRowRender}
                        />
                    </div>
                </Spin>
            </div>
        </>
    )
}