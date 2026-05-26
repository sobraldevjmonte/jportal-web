import { useContext, useEffect, useState, useCallback } from "react";
import { UsuarioContext } from "../../../../context/useContext";
import EtapasService from "../../../../service/EtapasService";
import ObrasService from "../../../../service/ObrasService";
import {
    Button, Col, Row, Space, Spin, Table, TableColumnsType,
    Tooltip, Typography, Select, Card, message, Tag, Badge
} from "antd";
import { FilePdfOutlined, SyncOutlined, RocketOutlined, HomeOutlined } from "@ant-design/icons";
import TabelaPendenciasSomaEtapasAdminComponent from "./TabelaPendenciasSomaEtapasAdminComponent";
import TabelaPendeciasVendasLojasAdminComponent from "./TabelaPendeciasVendasLojasAdminComponent";
import { formatarMoeda } from "../../../../utils/formatarValores";

const service = new EtapasService();
const { Option } = Select;

export default function TabelaPendeciasVendasAdministradorComponent() {
    const { idLoja: lojaContext } = useContext(UsuarioContext);

    const [dados, setDados] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [lojas, setLojas] = useState<any[]>([]);
    const [vendedores, setVendedores] = useState<any[]>([]);
    const [totalObrasGeral, setTotalObrasGeral] = useState(0);

    const [selLoja, setSelLoja] = useState<number>(0);
    const [selVendedores, setSelVendedores] = useState<string[]>([]);
    const [verFaturados, setVerFaturados] = useState(true);

    /**
     * Busca o total geral de obras e a contagem específica para cada loja da lista
     */
    const processarContagemObras = useCallback(async (listaLojasVendas: any[]) => {
        try {
            // 1. Busca o Total Geral do Grupo (sem filtros)
            const resGeral = await ObrasService.listarTodasObrasGeral({});
            if (Array.isArray(resGeral.data)) {
                setTotalObrasGeral(resGeral.data.length);
            }

            // 2. Busca Individual por Loja (evita duplicidade e erros de match no front)
            const dadosComContagemReal = await Promise.all(
                listaLojasVendas.map(async (loja) => {
                    try {
                        const rs = await ObrasService.listarTodasObrasGeral({
                            idLoja: loja.idLoja 
                        });

                        return {
                            ...loja,
                            obras_count: Array.isArray(rs.data) ? rs.data.length : 0
                        };
                    } catch (err) {
                        return { ...loja, obras_count: 0 };
                    }
                })
            );

            setDados(dadosComContagemReal);
        } catch (error) {
            console.error("Erro ao sincronizar contagem de obras:", error);
        }
    }, []);

    /**
     * Carrega as pendências de vendas e dispara a contagem de obras
     */
    const carregarDadosVendas = useCallback(async () => {
        setLoading(true);
        try {
            const rs: any = await service.listaPendenciasVendasAdmin(lojaContext);
            const listaVendas = rs.data.pendenciasAdminVendas || [];

            // Dispara o cruzamento com o banco de obras para cada unidade
            await processarContagemObras(listaVendas);
        } catch (e) {
            message.error("Erro ao carregar dados de vendas");
        } finally {
            setLoading(false);
        }
    }, [lojaContext, processarContagemObras]);

    const carregarCombos = useCallback(async () => {
        try {
            const [resLojas, resVendedores] = await Promise.all([
                service.listarLojas(),
                service.listarVendedoresGeral()
            ]);
            setLojas(resLojas.data.lojas);
            setVendedores(resVendedores.data.vendedores);
        } catch (e) { 
            message.error("Erro ao carregar filtros"); 
        }
    }, []);

    useEffect(() => {
        carregarCombos();
        carregarDadosVendas();
    }, [carregarCombos, carregarDadosVendas]);

    const siglas = ['BAS', 'EPI', 'HID', 'CAB', 'TOM', 'PIS', 'LOU', 'POR', 'PIN', 'ILU'];
    const coresEtapas = [
        { solida: "#1f77b4", fundo: "#e6f4ff" }, { solida: "#ff7f0e", fundo: "#fff7e6" },
        { solida: "#2ca02c", fundo: "#f6ffed" }, { solida: "#d62728", fundo: "#fff1f0" },
        { solida: "#9467bd", fundo: "#f9f0ff" }, { solida: "#8c564b", fundo: "#fdf5f2" },
        { solida: "#e377c2", fundo: "#fff0f6" }, { solida: "#7f7f7f", fundo: "#f5f5f5" },
        { solida: "#bcbd22", fundo: "#fcffe6" }, { solida: "#17becf", fundo: "#e6fffb" },
    ];

    const columns: TableColumnsType<any> = [
        {
            title: 'LOJA',
            dataIndex: 'fantasia',
            key: 'fantasia',
            width: 250, // Define um tamanho mínimo fixo para a coluna não espremer
            render: (t, record) => (
                <Space direction="vertical" size={0} style={{ width: '100%' }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        flexWrap: 'nowrap', // Impede que o badge e a palavra "obras" caiam para a linha de baixo
                        whiteSpace: 'nowrap' 
                    }}>
                        <b style={{ fontSize: '0.85rem' }}>{t}</b>
                        <Space size={4} style={{ display: 'flex', alignItems: 'center' }}>
                            <Badge
                                count={record.obras_count || 0}
                                showZero
                                color={Number(record.obras_count) > 0 ? "#faad14" : "#d9d9d9"}
                                size="small"
                                style={{ fontSize: '10px' }}
                            />
                            <Typography.Text type="secondary" style={{ fontSize: '10px' }}>
                                obras
                            </Typography.Text>
                        </Space>
                    </div>
                    <div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>
                        ID: {record.codigoloja}
                    </div>
                </Space>
            )
        },
        {
            title: 'TTL Vendas', align: 'right' as const, width: 140,
            render: (_, record) => (
                <div style={{ lineHeight: '1.2' }}>
                    <div style={{ fontWeight: 'bold' }}>{formatarMoeda(+record.totalvendas)}</div>
                    {verFaturados && (
                        <div style={{ fontSize: '11px', color: '#52c41a', fontWeight: 'bold' }}>
                            Fat: {formatarMoeda(+record.totalfaturado || 0)}
                        </div>
                    )}
                </div>
            )
        },
        ...coresEtapas.map((cor, i) => ({
            title: <div style={{ textAlign: 'center', fontSize: '0.7rem' }}>({i + 1})<br />{siglas[i]}</div>,
            dataIndex: `etapa${i + 1}`, align: 'right' as const, width: 105,
            onHeaderCell: () => ({ style: { backgroundColor: cor.fundo, padding: '4px' } }),
            render: (val: any, record: any) => {
                const faturado = record[`etapafat${i + 1}`];
                return (
                    <div style={{ lineHeight: '1.2' }}>
                        <div style={{ fontSize: '0.85rem' }}>{formatarMoeda(+val || 0)}</div>
                        {verFaturados && (
                            <div style={{ fontSize: '11px', color: '#52c41a', borderTop: '1px dashed #eee', marginTop: '2px' }}>
                                {formatarMoeda(+faturado || 0)}
                            </div>
                        )}
                    </div>
                );
            }
        })),
    ];

    return (
        <div style={{ padding: '15px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <Card size="small" style={{ marginBottom: '15px', borderRadius: '8px' }}>
                <Row gutter={16} align="bottom">
                    <Col span={6}>
                        <Typography.Text strong>Unidade:</Typography.Text>
                        <Select style={{ width: '100%' }} value={selLoja} onChange={setSelLoja} allowClear>
                            <Option value={0}>TODAS AS LOJAS</Option>
                            {lojas.map(l => <Option key={l.idLoja} value={l.idLoja}>{l.codigoLoja}</Option>)}
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Typography.Text strong>Vendedores:</Typography.Text>
                        <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="Todos" value={selVendedores} onChange={setSelVendedores} disabled={selLoja === 0}>
                            {vendedores.filter(v => v.idLoja === selLoja).map(v => (
                                <Option key={v.codigoVendedor} value={v.codigoVendedor}>{v.codigoVendedor} - {v.nomeUsuario}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col>
                        <Space>
                            <Button type="primary" icon={<SyncOutlined />} onClick={carregarDadosVendas}>Atualizar</Button>
                            <Tooltip title={verFaturados ? "Ocultar faturados" : "Exibir faturados da unidade"}>
                                <Button icon={<RocketOutlined />} danger={verFaturados} type={verFaturados ? "primary" : "default"} onClick={() => setVerFaturados(!verFaturados)}>
                                    {verFaturados ? "Ocultar Fat" : "Ver Fat"}
                                </Button>
                            </Tooltip>
                            <Button danger icon={<FilePdfOutlined />} onClick={() => message.info("Relatório PDF disponível em breve.")}>Obras PDF</Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            <Spin spinning={loading} tip="Carregando dados globais...">
                <TabelaPendenciasSomaEtapasAdminComponent />

                <Row align="middle" style={{ margin: '15px 0' }} gutter={16}>
                    <Col>
                        {verFaturados && <Tag color="volcano" style={{ fontWeight: 'bold' }}>PENDENTE + FATURADO</Tag>}
                    </Col>
                    <Col>
                        <Space>
                            <HomeOutlined style={{ color: '#888' }} />
                            <Typography.Text type="secondary">Total Geral de Obras no Grupo:</Typography.Text>
                            <Badge count={totalObrasGeral} showZero color="#faad14" overflowCount={99999} />
                        </Space>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={dados}
                    rowKey="idLoja"
                    bordered
                    size="small"
                    pagination={false}
                    title={() => <Typography.Text strong>DashBoard Administrativo por Unidade</Typography.Text>}
                    expandedRowRender={(record) => (
                        <TabelaPendeciasVendasLojasAdminComponent
                            idLoja={record.idLoja}
                            verFaturadosAdmin={verFaturados}
                        />
                    )}
                />
            </Spin>
        </div>
    );
}