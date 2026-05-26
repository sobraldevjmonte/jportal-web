import { SyncOutlined, PrinterOutlined, HomeOutlined, RocketOutlined } from "@ant-design/icons";
import { 
    Button, Card, Col, Row, Spin, Table, Typography, 
    Space, Modal, Select, message, Checkbox, 
    Tooltip, Tag, Badge
} from "antd";
import type { TableColumnsType } from 'antd';
import { useContext, useEffect, useState, useCallback } from "react";
import { UsuarioContext } from "../../../../context/useContext";
import EtapasService from "../../../../service/EtapasService";
import ObrasService from "../../../../service/ObrasService"; 
import TabelaPendeciasVendasVendedoresGerenciaComponent from "./TabelaPendeciasVendasVendedoresGerenciaComponent";
import TabelaPendenciasSomaEtapasGerentesComponent from "./TabelaPendenciasSomaEtapasGerentesComponent";
import { formatarMoeda } from "../../../../utils/formatarValores";

const service = new EtapasService();

interface PendenciasVendasType {
    codigoVendedor: string;
    nomevendedor: string;
    total_reais_pendencias: number;
    total_reais_faturadas: number;
    total_obras_vendedor?: number;
    etapa1: number; etapa2: number; etapa3: number; etapa4: number; etapa5: number;
    etapa6: number; etapa7: number; etapa8: number; etapa9: number; etapa10: number;
    etapafat1: number; etapafat2: number; etapafat3: number; etapafat4: number; etapafat5: number;
    etapafat6: number; etapafat7: number; etapafat8: number; etapafat9: number; etapafat10: number;
}

export default function TabelaPendeciasVendasGerentesComponent() {
    const { idLoja, nivelUsuario, codigoUsuario } = useContext(UsuarioContext);
    
    const [dados, setDados] = useState<PendenciasVendasType[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalObrasLoja, setTotalObrasLoja] = useState(0);
    const [isModalRelatorio, setIsModalRelatorio] = useState(false);
    const [vendedoresLoja, setVendedoresLoja] = useState<any[]>([]);
    const [selecionados, setSelecionados] = useState<string[]>([]);
    const [gerandoPdf, setGerandoPdf] = useState(false);
    const [verFaturados, setVerFaturados] = useState(true);

    const buscarDadosObras = useCallback(async (vendedoresAtuais: PendenciasVendasType[]) => {
        try {
            const rs = await ObrasService.listarTodasObrasGeral({ idLoja, idNivelUsuario: nivelUsuario, codigoVendedor: codigoUsuario });
            if (Array.isArray(rs.data)) {
                setTotalObrasLoja(rs.data.length);
                setDados(vendedoresAtuais.map(vend => ({
                    ...vend,
                    total_obras_vendedor: rs.data.filter((o: any) => String(o.idvendedor) === String(vend.codigoVendedor)).length,
                })));
            }
        } catch (error) {
            console.error("Erro ao processar contagem de obras:", error);
        }
    }, [idLoja, nivelUsuario, codigoUsuario]);

    const listaPendenciasVendasGerente = useCallback(async () => {
        setLoading(true);
        try {
            const rs = await service.listaPendenciasVendasGerentes(idLoja, 'DESC');
            const listaVendedores = rs.data.vendedores || [];
            setDados(listaVendedores);
            await buscarDadosObras(listaVendedores);
        } catch (error) {
            console.error(error);
            message.error("Erro ao carregar dashboard.");
        } finally {
            setLoading(false);
        }
    }, [idLoja, buscarDadosObras]);

    useEffect(() => { listaPendenciasVendasGerente(); }, [listaPendenciasVendasGerente]);

    const carregarVendedoresRelatorio = async () => {
        try { const rs = await service.fitlrarVendedores(idLoja); setVendedoresLoja(rs.data.vendedores || []); }
        catch { message.error("Erro ao buscar vendedores."); }
    };

    const handleGerarRelatorioObras = async () => {
        setGerandoPdf(true);
        try {
            const listaParaEnvio = selecionados.length > 0 ? selecionados : vendedoresLoja.map(v => v.codigoVendedor);
            const response = await service.downloadRelatorioObras(idLoja, listaParaEnvio);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Relatorio_Obras_${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setIsModalRelatorio(false);
        } catch { message.error("Erro ao gerar PDF."); }
        finally { setGerandoPdf(false); }
    };

    const onSelectAll = (e: any) => {
        setSelecionados(e.target.checked ? vendedoresLoja.map(v => v.codigoVendedor) : []);
    };

    const coresEtapas = [
        { solida: "#1f77b4", fundo: "#e6f4ff" }, { solida: "#ff7f0e", fundo: "#fff7e6" },
        { solida: "#2ca02c", fundo: "#f6ffed" }, { solida: "#d62728", fundo: "#fff1f0" },
        { solida: "#9467bd", fundo: "#f9f0ff" }, { solida: "#8c564b", fundo: "#fdf5f2" },
        { solida: "#e377c2", fundo: "#fff0f6" }, { solida: "#7f7f7f", fundo: "#f5f5f5" },
        { solida: "#bcbd22", fundo: "#fcffe6" }, { solida: "#17becf", fundo: "#e6fffb" },
    ];
    const siglas = ['BAS', 'EPI', 'HID', 'CAB', 'TOM', 'PIS', 'LOU', 'POR', 'PIN', 'ILU'];

    const columns: TableColumnsType<PendenciasVendasType> = [
        {
            title: 'Vendedor', dataIndex: 'nomevendedor', width: 220, fixed: 'left',
            render: (text, record) => (
                <Space size="small">
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{text}</span>
                    <Badge count={record.total_obras_vendedor || 0} showZero
                        color={Number(record.total_obras_vendedor) > 0 ? "#faad14" : "#d9d9d9"}
                        size="small" style={{ fontSize: '10px' }}
                    />
                    <Typography.Text type="secondary" style={{ fontSize: '10px' }}>obras</Typography.Text>
                </Space>
            ),
        },
        {
            title: 'TTL Vendas', align: 'right', width: 130, fixed: 'left',
            render: (_, record: any) => (
                <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 'bold' }}>{formatarMoeda(Number(record.total_reais_pendencias || 0))}</div>
                    {verFaturados && <div style={{ fontSize: '0.72rem', color: '#52c41a', fontWeight: 'bold' }}>Fat: {formatarMoeda(Number(record.total_reais_faturadas || 0))}</div>}
                </div>
            ),
        },
        ...coresEtapas.map((cor, i) => ({
            title: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.1' }}>
                    <span style={{ fontSize: '0.65rem', color: cor.solida, fontWeight: 'bold' }}>({i + 1})</span>
                    <span style={{ fontSize: '0.65rem' }}>{siglas[i]}</span>
                </div>
            ),
            dataIndex: `etapa${i + 1}`, align: 'right' as const, width: 90,
            onHeaderCell: () => ({ style: { backgroundColor: cor.fundo, padding: '4px' } }),
            render: (val: any, record: any) => {
                const faturado = record[`etapafat${i + 1}`];
                return (
                    <div style={{ lineHeight: '1.2' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>{val ? formatarMoeda(Number(val)) : '0,00'}</div>
                        {verFaturados && <div style={{ fontSize: '0.7rem', color: '#52c41a', borderTop: '1px dashed #e8e8e8', marginTop: '2px', fontWeight: 600 }}>{faturado > 0 ? formatarMoeda(Number(faturado)) : '0,00'}</div>}
                    </div>
                );
            },
        })),
    ];

    return (
        <>
            {/* CSS global para conter overflow em toda a página */}
            <style>{`
                .gerente-page-wrapper { width: 100%; max-width: 100%; overflow-x: hidden; box-sizing: border-box; }
                .gerente-page-wrapper .ant-card { max-width: 100%; }
                .gerente-page-wrapper .ant-table-wrapper { width: 100% !important; }
                /* Row expandida: sem margin extra */
                .gerente-page-wrapper .ant-table-expanded-row > td {
                    padding: 4px 4px 4px 0 !important;
                }
            `}</style>

            <div className="gerente-page-wrapper" style={{ padding: '12px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
                <Card bordered={false} style={{ borderRadius: '8px', overflow: 'hidden' }}>

                    {/* Totais de etapas */}
                    <TabelaPendenciasSomaEtapasGerentesComponent verFaturados={verFaturados} />

                    {/* Barra de controles */}
                    <Row justify="space-between" align="middle" style={{ marginTop: 12, marginBottom: 12 }}>
                        <Col>
                            <Space size="middle">
                                <Typography.Title level={4} style={{ margin: 0 }}>
                                    <HomeOutlined /> Gestão de Pendências
                                </Typography.Title>
                                <Space split={<span style={{ color: '#ccc' }}>|</span>}>
                                    <Space size={4}>
                                        <Badge count={dados.length} showZero color="#108ee9" overflowCount={999} />
                                        <Typography.Text type="secondary" style={{ fontSize: '0.85rem' }}>Vendedores</Typography.Text>
                                    </Space>
                                    <Space size={4}>
                                        <Badge count={totalObrasLoja} showZero color="#faad14" overflowCount={9999} />
                                        <Typography.Text type="secondary" style={{ fontSize: '0.85rem' }}>Obras na Loja</Typography.Text>
                                    </Space>
                                </Space>
                                {verFaturados && <Tag color="volcano" style={{ fontWeight: 'bold' }}>MODO: PENDENTE + FATURADO</Tag>}
                            </Space>
                        </Col>
                        <Col>
                            <Space>
                                <Tooltip title={verFaturados ? "Ocultar faturados" : "Exibir faturados"}>
                                    <Button icon={<RocketOutlined />} danger={verFaturados} type={verFaturados ? "primary" : "default"} onClick={() => setVerFaturados(!verFaturados)}>
                                        {verFaturados ? "Ocultar Faturados" : "Incluir Faturados"}
                                    </Button>
                                </Tooltip>
                                <Button icon={<PrinterOutlined />} onClick={() => { setIsModalRelatorio(true); carregarVendedoresRelatorio(); }}>PDF de Obras</Button>
                                <Button type="primary" icon={<SyncOutlined spin={loading} />} onClick={listaPendenciasVendasGerente} style={{ backgroundColor: '#2F4F4F', borderColor: '#2F4F4F' }}>Atualizar</Button>
                            </Space>
                        </Col>
                    </Row>

                    {/* Tabela de vendedores — scroll horizontal contido */}
                    <Spin spinning={loading}>
                        <div style={{ width: '100%', overflowX: 'auto' }}>
                            <Table
                                columns={columns}
                                dataSource={dados}
                                size="small"
                                rowKey="codigoVendedor"
                                bordered
                                scroll={{ x: 1200 }}
                                expandable={{
                                    expandedRowRender: (record) => (
                                        <TabelaPendeciasVendasVendedoresGerenciaComponent
                                            codigoVendedor={record.codigoVendedor}
                                            nomeVendedor={record.nomevendedor}
                                        />
                                    ),
                                }}
                            />
                        </div>
                    </Spin>
                </Card>

                {/* Modal relatório */}
                <Modal
                    title={<b>RELATÓRIO DE OBRAS - FILTRO</b>}
                    open={isModalRelatorio}
                    onOk={handleGerarRelatorioObras}
                    onCancel={() => setIsModalRelatorio(false)}
                    confirmLoading={gerandoPdf}
                    okText="Gerar PDF"
                    cancelText="Cancelar"
                >
                    <div style={{ marginBottom: 15 }}>
                        <Checkbox onChange={onSelectAll} checked={selecionados.length === vendedoresLoja.length && vendedoresLoja.length > 0}>
                            <b>Selecionar Todos os Vendedores</b>
                        </Checkbox>
                    </div>
                    <Typography.Text type="secondary">Ou selecione alguns especificamente:</Typography.Text>
                    <Select mode="multiple" placeholder="Deixe vazio para gerar de todos" style={{ width: '100%', marginTop: 8 }}
                        value={selecionados} onChange={setSelecionados} maxTagCount="responsive">
                        {vendedoresLoja.map(v => (
                            <Select.Option key={v.codigoVendedor} value={v.codigoVendedor}>{v.nomeUsuario}</Select.Option>
                        ))}
                    </Select>
                </Modal>
            </div>
        </>
    );
}