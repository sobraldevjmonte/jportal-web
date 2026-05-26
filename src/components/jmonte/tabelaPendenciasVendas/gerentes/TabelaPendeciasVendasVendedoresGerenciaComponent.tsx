import {
    FileTextOutlined, SyncOutlined, HomeOutlined, RocketOutlined,
    SearchOutlined, ExclamationCircleFilled, PlusCircleOutlined,
} from "@ant-design/icons";
import {
    Button, Spin, Table, TableColumnsType, Tooltip, Typography,
    Space, Tag, Row, Col, Badge, Input, Modal, Form, Select,
    Divider, message,
} from "antd";
import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { UsuarioContext } from "../../../../context/useContext";
import EtapasService from "../../../../service/EtapasService";
import ModalGerentesNpsComponent from "./ModalGerentesNpsComponent";
import TabelaObrasEtapasComponent from "../../obras/TabelaObrasClienteComponent";
import TabelaPendenciasDaPendenciaComponent from "../TabelaPendenciasVendasContatosComponent";
import { formatarMoeda } from "../../../../utils/formatarValores";

const service = new EtapasService();

// ── Constantes de etapas ──────────────────────────────────────────
const SIGLAS_ETAPAS = ['BAS', 'EPI', 'HID', 'CAB', 'TOM', 'PIS', 'LOU', 'POR', 'PIN', 'ILU'];
const NOMES_ETAPAS = [
    "1 BÁSICO", "2 FERRAMEN E EPIS", "3 HIDRÁULICO", "4 CABOS E FIOS", "5 INTER E TOMADA",
    "6 PISOS E REVES", "7 LOUÇAS E METAIS", "8 PORTAS E FERRA", "9 PINTURA", "10 ILUMINAÇÃO",
];
const OPCOES_SITUACAO = [
    { value: 'FC', label: <span><b>FC</b> <span style={{ fontSize: '11px', color: '#8c8c8c' }}>(Falta Comprar)</span></span> },
    { value: 'JM', label: <span><b>JM</b> <span style={{ fontSize: '11px', color: '#8c8c8c' }}>(JMonte)</span></span> },
    { value: 'CC', label: <span><b>CC</b> <span style={{ fontSize: '11px', color: '#8c8c8c' }}>(Concorrente)</span></span> },
    { value: 'FM', label: <span><b>FM</b> <span style={{ fontSize: '11px', color: '#8c8c8c' }}>(Fora Mix)</span></span> },
];
const CORES_ETAPAS = [
    { solida: "#1f77b4", fundo: "#e6f4ff" }, { solida: "#ff7f0e", fundo: "#fff7e6" },
    { solida: "#2ca02c", fundo: "#f6ffed" }, { solida: "#d62728", fundo: "#fff1f0" },
    { solida: "#9467bd", fundo: "#f9f0ff" }, { solida: "#8c564b", fundo: "#fdf5f2" },
    { solida: "#e377c2", fundo: "#fff0f6" }, { solida: "#7f7f7f", fundo: "#f5f5f5" },
    { solida: "#bcbd22", fundo: "#fcffe6" }, { solida: "#17becf", fundo: "#e6fffb" },
];

interface PendenciasVendasType {
    key: string;
    seq: string;
    idvendedor: number;
    nomecliente: string;
    idcliente: number;
    total_pendente: number;
    total_faturado: number;
    nomeVendedor: string;
    codigoLoja: string;
    etapa1: number; etapa2: number; etapa3: number; etapa4: number; etapa5: number;
    etapa6: number; etapa7: number; etapa8: number; etapa9: number; etapa10: number;
    etapafinal1: number; etapafinal2: number; etapafinal3: number; etapafinal4: number; etapafinal5: number;
    etapafinal6: number; etapafinal7: number; etapafinal8: number; etapafinal9: number; etapafinal10: number;
    contatou: boolean;
    cliente_obra: string;
    tem_obra_ativa: boolean;
    total_obras: number;
    sequencia_obras?: number;
}

export default function TabelaPendeciasVendasVendedoresGerenciaComponent(props: any) {
    const { nivelUsuario, idNivelUsuario, codigoUsuario } = useContext(UsuarioContext);

    // ── Controle de nível: gerente = 2, vendedor = 3 ──
    const isGerente = [1, 2, 11].includes(Number(idNivelUsuario));

    const [dados, setDados] = useState<PendenciasVendasType[]>([]);
    const [quantidade, setQuantidade] = useState(0);
    const [loading, setLoading] = useState(false);
    const [ordem] = useState('DESC');
    const [verFaturados, setVerFaturados] = useState(true);

    // ── Modal NPs ──
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [clienteModal, setClienteModal] = useState('');
    const [idClienteModal, setIdClienteModal] = useState(0);

    // ── Filtros dinâmicos ──
    const [totalFiltradosGrid, setTotalFiltradosGrid] = useState<number | null>(null);
    const [totalObrasFiltradasGrid, setTotalObrasFiltradasGrid] = useState<number | null>(null);

    // ── PdP: Set de clientes marcados e mapa de quantidade ──
    const [clientesComPdp, setClientesComPdp] = useState<Set<number>>(new Set());
    const [qtdPdpPorCliente, setQtdPdpPorCliente] = useState<Map<number, number>>(new Map());

    // ── Modal criação rápida de PdP (somente gerente) ──
    const [formPdp] = Form.useForm();
    const [modalPdpVisible, setModalPdpVisible] = useState(false);
    const [clientePdpSelecionado, setClientePdpSelecionado] = useState<PendenciasVendasType | null>(null);
    const [salvandoPdp, setSalvandoPdp] = useState(false);

    // ── Memos ──
    const totalClientesComObras = useMemo(() => dados.filter(d => (Number(d.total_obras) || 0) > 0).length, [dados]);
    const totalClientesComPdp = useMemo(() => clientesComPdp.size, [clientesComPdp]);

    // ── Carrega marcações PdP ──
    const carregarClientesComPdp = useCallback(async (vendedor: string | number) => {
        try {
            const rs = await service.listarPendenciasDaPendenciaPorVendedor(vendedor);
            const lista: any[] = rs.data?.lista || [];
            // Apenas registros em aberto
            const abertos = lista.filter((item: any) => item.status === 'A');

            const novoSet = new Set<number>();
            const novoMap = new Map<number, number>();

            // DEDUPLICAR por idcliente: conta quantos clientes DISTINTOS têm PdP aberta
            // (não quantas linhas, pois o mesmo cliente pode aparecer N vezes na tabela de vendas)
            abertos.forEach((item: any) => {
                const id = Number(item.idcliente);
                novoSet.add(id);
                // Conta registros PdP abertos por cliente (para o tooltip)
                novoMap.set(id, (novoMap.get(id) || 0) + 1);
            });

            setClientesComPdp(novoSet);
            setQtdPdpPorCliente(novoMap);
        } catch {
            // silencioso
        }
    }, []);

    // ── Carrega lista principal ──
    const listaPendenciasVendas = useCallback(async () => {
        setLoading(true);
        try {
            const rs: any = await service.listaPendenciasVendas(props.codigoVendedor, ordem);
            const lista = rs.data?.pendenciasVendas || rs.pendenciasVendas || [];
            setDados(lista);
            setQuantidade(rs.data?.quantidade || rs.quantidade || 0);
            setTotalFiltradosGrid(null);
            setTotalObrasFiltradasGrid(null);
            await carregarClientesComPdp(props.codigoVendedor);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            setDados([]);
        } finally {
            setLoading(false);
        }
    }, [props.codigoVendedor, ordem, carregarClientesComPdp]);

    useEffect(() => { listaPendenciasVendas(); }, [listaPendenciasVendas]);

    const handleTableChange = (_pagination: any, filters: any, _sorter: any, extra: any) => {
        const possuiFiltrosAtivos = Object.values(filters).some(f => Array.isArray(f) && f.length > 0);
        if (possuiFiltrosAtivos) {
            const filtrados = extra.currentDataSource || [];
            setTotalFiltradosGrid(filtrados.length);
            setTotalObrasFiltradasGrid(filtrados.filter((d: any) => (Number(d.total_obras) || 0) > 0).length);
        } else {
            setTotalFiltradosGrid(null);
            setTotalObrasFiltradasGrid(null);
        }
    };

    function abrirModalNps(nomeCliente: string, idCliente: number) {
        setClienteModal(nomeCliente);
        setIdClienteModal(idCliente);
        setModalVisible(true);
    }

    // ── Abre modal de criação rápida de PdP (somente gerente) ──
    function abrirModalCriarPdp(record: PendenciasVendasType) {
        if (!isGerente) return;
        // Bloqueia se já existe registro aberto para este cliente
        if (qtdPdpPorCliente.has(Number(record.idcliente))) {
            message.warning(`${record.nomecliente} já possui uma pendência em aberto. Finalize-a antes de criar uma nova.`);
            return;
        }
        setClientePdpSelecionado(record);
        formPdp.resetFields();
        formPdp.setFieldsValue(
            Object.fromEntries(SIGLAS_ETAPAS.map((_, i) => [`e${i + 1}`, 'FC']))
        );
        setModalPdpVisible(true);
    }

    async function salvarPdpRapido(values: any) {
        if (!clientePdpSelecionado) return;
        setSalvandoPdp(true);
        try {
            await service.salvarPendenciaDaPendencia({
                ...values,
                idcliente: clientePdpSelecionado.idcliente,
                idvendedor: props.codigoVendedor,
            });
            message.success(`Pendência registrada para ${clientePdpSelecionado.nomecliente}!`);
            setModalPdpVisible(false);
            await carregarClientesComPdp(props.codigoVendedor);
        } catch {
            message.error("Erro ao salvar pendência.");
        } finally {
            setSalvandoPdp(false);
        }
    }

    // Callback do filho TabelaPendenciasDaPendenciaComponent
    const handlePdpAtualizada = useCallback(() => {
        carregarClientesComPdp(props.codigoVendedor);
    }, [props.codigoVendedor, carregarClientesComPdp]);

    // ── Colunas ──────────────────────────────────────────────────
    const columns: TableColumnsType<PendenciasVendasType> = [
        {
            title: 'NPs.', align: 'center', width: 60,
            render: (_, record) => (
                <Tooltip title={`Lista de NPs - ${record.nomecliente}`} color="#000">
                    <Button size="small" icon={<FileTextOutlined />} onClick={() => abrirModalNps(record.nomecliente, record.idcliente)} />
                </Tooltip>
            ),
        },
        {
            title: 'OBRA', align: 'center', width: 110, key: 'total_obras',
            filters: [
                { text: 'Com Obras', value: 'com_obra' },
                { text: 'Sem Obras', value: 'sem_obra' },
            ],
            filterMultiple: false,
            onFilter: (value, record) => {
                const total = Number(record.total_obras) || 0;
                if (value === 'com_obra') return total > 0;
                if (value === 'sem_obra') return total === 0;
                return true;
            },
            render: (_, record) => {
                const temObraAtiva = record.tem_obra_ativa;
                const total = Number(record.total_obras) || 0;
                const seqObras = record.sequencia_obras;
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        {total > 0 && seqObras && (
                            <span style={{ fontSize: '10px', color: '#0054a6', fontWeight: 'bold' }}>{seqObras}º</span>
                        )}
                        <Tooltip title={total > 0 ? `${total} obra(s) cadastradas` : "Sem obras"}>
                            {total > 0 ? (
                                <Badge count={total} size="small" offset={[5, 0]} style={{ backgroundColor: temObraAtiva ? '#52c41a' : '#bfbfbf', fontSize: '10px', boxShadow: '0 0 0 1px #fff' }}>
                                    <HomeOutlined style={{ color: temObraAtiva ? '#52c41a' : '#d9d9d9', fontSize: '17px' }} />
                                </Badge>
                            ) : <span style={{ color: '#d9d9d9' }}>-</span>}
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            title: 'Cliente',
            dataIndex: 'nomecliente',
            key: 'nomecliente',
            width: 300,
            sorter: (a, b) => a.nomecliente.localeCompare(b.nomecliente),
            filters: [
                { text: 'Com Pendência da Pendência', value: 'com_pdp' },
                { text: 'Sem Pendência da Pendência', value: 'sem_pdp' },
            ],
            filterMultiple: false,
            onFilter: (value, record) => {
                const tem = clientesComPdp.has(Number(record.idcliente));
                if (value === 'com_pdp') return tem;
                if (value === 'sem_pdp') return !tem;
                return true;
            },
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Buscar cliente..."
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
                            Filtrar
                        </Button>
                        <Button onClick={() => { if (clearFilters) clearFilters(); confirm(); }} size="small" style={{ width: 90 }}>
                            Limpar
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined, fontSize: '14px' }} />
            ),
            render: (text, record) => {
                const temPdp = clientesComPdp.has(Number(record.idcliente));
                const qtdPdp = qtdPdpPorCliente.get(Number(record.idcliente)) || 0;

                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

                        {/* ── Ícone de alerta quando tem PdP ── */}
                        {temPdp && (
                            <Tooltip
                                title={`${qtdPdp} pendência${qtdPdp > 1 ? 's' : ''} da pendência em aberto`}
                                color="#B22222"
                            >
                                <Badge count={qtdPdp} size="small" color="#B22222" overflowCount={9}>
                                    <ExclamationCircleFilled style={{
                                        color: '#B22222',
                                        fontSize: '14px',
                                        filter: 'drop-shadow(0 0 3px rgba(178,34,34,0.4))',
                                    }} />
                                </Badge>
                            </Tooltip>
                        )}

                        {/* ── Nome do cliente ── */}
                        <span style={{
                            fontSize: '0.85rem',
                            fontWeight: temPdp ? 700 : (record.contatou ? 600 : 400),
                            color: temPdp ? '#B22222' : (record.contatou ? 'blue' : '#000'),
                            textDecoration: temPdp ? 'underline' : 'none',
                            textDecorationStyle: temPdp ? 'dotted' : undefined,
                            textDecorationColor: temPdp ? '#B22222' : undefined,
                            cursor: isGerente ? 'pointer' : 'default',
                            transition: 'opacity 0.15s',
                        }}>
                            {text}
                        </span>

                        {/* ── Tag PdP quando marcado ── */}
                        {temPdp && (
                            <Tag color="error" style={{
                                fontSize: '9px', fontWeight: 700,
                                padding: '0 4px', margin: 0,
                                lineHeight: '16px', borderRadius: 4,
                            }}>
                                PdP
                            </Tag>
                        )}

                        {/* ── Botão "+" para gerente criar PdP ── */}
                        {isGerente && (
                            <Tooltip
                                title={
                                    temPdp
                                        ? `Já existe pendência em aberto — finalize antes de criar nova`
                                        : `Marcar ${record.nomecliente} com pendência da pendência`
                                }
                                color={temPdp ? '#fa8c16' : '#B22222'}
                            >
                                <Button
                                    type="text"
                                    size="small"
                                    icon={
                                        <PlusCircleOutlined style={{
                                            color: temPdp ? '#d9d9d9' : '#bbb',
                                            fontSize: '15px',
                                            transition: 'color 0.2s',
                                        }} />
                                    }
                                    disabled={temPdp}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        abrirModalCriarPdp(record);
                                    }}
                                    style={{ padding: '0 2px', height: 'auto' }}
                                    className="btn-criar-pdp"
                                />
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Total Vendas', align: 'right', width: 130,
            render: (_, record) => (
                <div style={{ lineHeight: '1.2', textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{formatarMoeda(Number(record.total_pendente || 0))}</div>
                    {verFaturados && <div style={{ fontSize: '0.7rem', color: '#52c41a' }}>Fat: {formatarMoeda(Number(record.total_faturado || 0))}</div>}
                </div>
            ),
        },
        ...CORES_ETAPAS.map((cor, i) => ({
            title: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.1' }}>
                    <span style={{ fontSize: '0.7rem', color: cor.solida, fontWeight: 'bold' }}>({i + 1})</span>
                    <span style={{ fontSize: '0.8rem' }}>{SIGLAS_ETAPAS[i]}</span>
                </div>
            ),
            dataIndex: `etapa${i + 1}`, align: 'right' as const, width: 100,
            onHeaderCell: () => ({ style: { backgroundColor: cor.fundo, padding: '4px' } }),
            render: (val: any, record: any) => {
                const faturado = record[`etapafinal${i + 1}`];
                return (
                    <div style={{ lineHeight: '1.2' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{val > 0 ? formatarMoeda(Number(val)) : '0,00'}</div>
                        {verFaturados && <div style={{ fontSize: '0.7rem', color: '#52c41a', borderTop: '1px dashed #eee', marginTop: '2px' }}>{faturado > 0 ? formatarMoeda(Number(faturado)) : '0,00'}</div>}
                    </div>
                );
            },
        })),
    ];

    // ── Render ───────────────────────────────────────────────────
    return (
        <>
            <style>{`
                /* Linha com PdP: fundo rosado + borda esquerda vermelha */
                .pdp-row-marcado > td {
                    background: #fff8f8 !important;
                }
                .pdp-row-marcado:hover > td {
                    background: #fff0f0 !important;
                }
                .pdp-row-marcado > td:first-child {
                    border-left: 3px solid #B22222 !important;
                }
                /* Botão "+" fica visível ao passar o mouse na linha */
                .btn-criar-pdp {
                    opacity: 0.3;
                    transition: opacity 0.2s !important;
                }
                tr:hover .btn-criar-pdp {
                    opacity: 1 !important;
                }
                tr.pdp-row-marcado .btn-criar-pdp {
                    opacity: 1 !important;
                }
            `}</style>

            <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', padding: '6px 6px 6px 2px', backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: '6px', margin: '2px 2px 2px 0', boxSizing: 'border-box' }}>

                <ModalGerentesNpsComponent
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    idCliente={idClienteModal}
                    nomeCliente={clienteModal}
                />

                {/* ── Cabeçalho ── */}
                <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
                    <Col>
                        <Space size="large">
                            <Typography.Title level={4} style={{ margin: 0 }}>
                                Pendências do Vendedor: {props.nomeVendedor || ''}
                            </Typography.Title>
                            {verFaturados && <Tag color="green">DETALHADO: PENDENTE + FATURADO</Tag>}
                            {isGerente && (
                                <Tag color="volcano" style={{ fontSize: '11px' }}>
                                    Clique em <PlusCircleOutlined /> no cliente para criar uma PdP
                                </Tag>
                            )}
                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <Tooltip title={verFaturados ? "Ocultar faturados" : "Exibir valores faturados"}>
                                <Button
                                    icon={<RocketOutlined />}
                                    type={verFaturados ? "primary" : "default"}
                                    danger={verFaturados}
                                    size="small"
                                    onClick={() => setVerFaturados(!verFaturados)}
                                >
                                    {verFaturados ? "Ocultar Faturados" : "Ver Faturados"}
                                </Button>
                            </Tooltip>
                            <Button size="small" icon={<SyncOutlined />} onClick={listaPendenciasVendas}>
                                Sincronizar Vendedor
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Spin spinning={loading} tip="Carregando dados do vendedor...">
                    <div style={{ width: '100%', overflowX: 'auto' }}>
                    <Table
                        columns={columns}
                        dataSource={dados}
                        size="small"
                        rowKey="idcliente"
                        bordered
                        scroll={{ x: 1100 }}
                        pagination={{ pageSize: 15 }}
                        onChange={handleTableChange}
                        rowClassName={(record) =>
                            clientesComPdp.has(Number(record.idcliente)) ? 'pdp-row-marcado' : ''
                        }
                        title={() => (
                            <Row justify="start" align="middle">
                                <Col>
                                    <Space size="middle">
                                        <Typography.Text strong>Resumo do Vendedor:</Typography.Text>

                                        <Badge
                                            count={totalFiltradosGrid !== null ? totalFiltradosGrid : quantidade}
                                            showZero color={totalFiltradosGrid !== null ? "cyan" : "#108ee9"}
                                            title="Total de Clientes" overflowCount={9999}
                                        />
                                        <span style={{ color: '#8c8c8c' }}>
                                            {totalFiltradosGrid !== null ? "Filtrados na busca" : "Clientes na lista"}
                                        </span>

                                        <Badge
                                            count={totalObrasFiltradasGrid !== null ? totalObrasFiltradasGrid : totalClientesComObras}
                                            showZero color="#faad14"
                                            title="Clientes com Obra" overflowCount={9999}
                                        />
                                        <span style={{ color: '#8c8c8c' }}>Com obras vinculadas</span>

                                        {/* Contador PdP — aparece só quando há algum */}
                                        {totalClientesComPdp > 0 && (
                                            <>
                                                <Badge count={totalClientesComPdp} showZero color="#B22222"
                                                    title="Clientes com Pendência da Pendência" overflowCount={9999}
                                                />
                                                <span style={{ color: '#B22222', fontWeight: 600, fontSize: '0.82rem' }}>
                                                    Com pendência da pendência
                                                </span>
                                            </>
                                        )}
                                    </Space>
                                </Col>
                            </Row>
                        )}
                        expandedRowRender={(record) => (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '4px 0 4px 0' }}>
                                <TabelaObrasEtapasComponent
                                    idCliente={String(record.idcliente)}
                                    idVendedor={String(record.idvendedor)}
                                    nomeCliente={record.nomecliente}
                                />
                                <TabelaPendenciasDaPendenciaComponent
                                    idCliente={record.idcliente}
                                    idVendedor={String(record.idvendedor)}
                                    nomeCliente={record.nomecliente}
                                    onAtualizar={handlePdpAtualizada}
                                    somenteLeitura={Number(idNivelUsuario) === 3}
                                />
                            </div>
                        )}
                    />
                    </div>
                </Spin>
            </div>

            {/* ── Modal criação rápida de PdP (somente gerente) ── */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                            display: 'inline-block', width: 4, height: 20,
                            borderRadius: 4, backgroundColor: '#B22222', marginRight: 4,
                        }} />
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1a2e' }}>
                            Nova Pendência da Pendência
                        </span>
                        <span style={{
                            fontSize: '0.75rem', color: '#B22222', fontWeight: 500,
                            background: 'rgba(178,34,34,0.08)', padding: '1px 8px',
                            borderRadius: 20, border: '1px solid rgba(178,34,34,0.2)',
                        }}>
                            {clientePdpSelecionado?.nomecliente}
                        </span>
                    </div>
                }
                open={modalPdpVisible}
                onCancel={() => setModalPdpVisible(false)}
                onOk={() => formPdp.submit()}
                okText="Registrar Pendência"
                cancelText="Cancelar"
                confirmLoading={salvandoPdp}
                width={860}
                centered
                destroyOnClose
                styles={{
                    header: { borderBottom: '1px solid #f3e6e6', paddingBottom: 12 },
                }}
                okButtonProps={{
                    style: {
                        background: 'linear-gradient(135deg, #9B1C1C, #B22222)',
                        borderColor: 'transparent',
                        borderRadius: 8,
                        fontWeight: 700,
                        height: 38,
                        paddingInline: 24,
                        boxShadow: '0 3px 8px rgba(178,34,34,0.35)',
                    },
                }}
                cancelButtonProps={{ style: { borderRadius: 8, height: 38 } }}
            >
                <Form
                    form={formPdp}
                    layout="vertical"
                    onFinish={salvarPdpRapido}
                >
                    <Form.Item
                        name="observacao"
                        label={
                            <span style={{ fontWeight: 600, fontSize: '0.82rem', color: '#1a1a2e' }}>
                                Observação
                            </span>
                        }
                    >
                        <Input.TextArea
                            rows={2}
                            placeholder="Descreva a situação desta pendência..."
                            style={{ borderRadius: 8, fontSize: '0.85rem' }}
                        />
                    </Form.Item>

                    <Divider plain style={{
                        fontSize: '0.78rem', fontWeight: 700, color: '#B22222',
                        borderColor: '#fde8e8', marginBlock: 8,
                    }}>
                        SITUAÇÃO POR ETAPA
                    </Divider>

                    <Row gutter={[8, 4]}>
                        {NOMES_ETAPAS.map((nome, i) => (
                            <Col key={i} xs={12} sm={8} md={6} lg={4}>
                                <Form.Item
                                    name={`e${i + 1}`}
                                    label={
                                        <span style={{
                                            fontSize: '10px', fontWeight: 600,
                                            color: '#7f1d1d', letterSpacing: '0.02em',
                                        }}>
                                            {nome}
                                        </span>
                                    }
                                    style={{ marginBottom: 8 }}
                                >
                                    <Select
                                        size="small"
                                        dropdownMatchSelectWidth={false}
                                        placeholder="—"
                                        allowClear
                                        options={OPCOES_SITUACAO}
                                        style={{ borderRadius: 6 }}
                                    />
                                </Form.Item>
                            </Col>
                        ))}
                    </Row>
                </Form>
            </Modal>
        </>
    );
}