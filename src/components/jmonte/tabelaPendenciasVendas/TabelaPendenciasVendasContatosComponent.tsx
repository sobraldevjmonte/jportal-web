import {
    PlusOutlined, DeleteOutlined, EditOutlined,
    CheckCircleOutlined, SyncOutlined, ExclamationCircleOutlined,
    CalendarOutlined, UserOutlined, EyeOutlined,
} from "@ant-design/icons";
import {
    Button, Table, Form, Input, Select, Row, Col, Divider,
    message, Popconfirm, Tag, Modal, Card, Tooltip, Space,
    Typography, Badge, Alert,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useContext, useEffect, useMemo, useState } from "react";
import EtapasService from "../../../service/EtapasService";
import { UsuarioContext } from "../../../context/useContext";

const service = new EtapasService();
const { Text } = Typography;

interface PendenciaDaPendenciaType {
    id: number;
    idcliente: number;
    idvendedor: string;
    nomevendedor?: string;
    data_formatada?: string;
    data_lancamento: string;
    observacao?: string;
    status: string; // 'A' = Aberto | 'F' = Finalizado
    e1?: string; e2?: string; e3?: string; e4?: string; e5?: string;
    e6?: string; e7?: string; e8?: string; e9?: string; e10?: string;
}

const SIGLAS = ['BAS', 'EPI', 'HID', 'CAB', 'TOM', 'PIS', 'LOU', 'POR', 'PIN', 'ILU'];
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
const CORES_SITUACAO: Record<string, string> = { JM: 'green', CC: 'red', FC: 'orange', FM: 'blue' };

interface Props {
    idCliente: number | string;
    idVendedor: number | string;
    nomeCliente: string;
    onAtualizar?: () => void;
    somenteLeitura?: boolean; // true = vendedor (oculta botão "Nova Tarefa")
}

export default function TabelaPendenciasDaPendenciaComponent({
    idCliente,
    idVendedor,
    nomeCliente,
    onAtualizar,
    somenteLeitura = false,
}: Props) {
    const [form] = Form.useForm();
    const [dados, setDados] = useState<PendenciaDaPendenciaType[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modoVisualizacao, setModoVisualizacao] = useState(false); // true = só leitura no modal
    const [editingId, setEditingId] = useState<number | null>(null);

    const { idNivelUsuario } = useContext(UsuarioContext);
    const podeExcluir = [1, 2, 11].includes(Number(idNivelUsuario));

    // ── Verifica se existe algum registro ABERTO ──────────────────
    const temAberto = useMemo(
        () => dados.some(d => d.status === 'A'),
        [dados]
    );

    const carregarDados = async () => {
        setLoading(true);
        try {
            const rs = await service.listarPendenciasDaPendencia(idCliente, idVendedor);
            setDados(rs.data?.lista || []);
        } catch {
            message.error("Erro ao carregar pendências.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { carregarDados(); }, [idCliente, idVendedor]);

    // ── Abre modal para NOVO registro ─────────────────────────────
    const abrirNovo = () => {
        if (temAberto) {
            message.warning("Existe uma pendência em aberto para este cliente. Finalize-a antes de criar uma nova.");
            return;
        }
        setEditingId(null);
        setModoVisualizacao(false);
        form.resetFields();
        form.setFieldsValue(Object.fromEntries(SIGLAS.map((_, i) => [`e${i + 1}`, 'FC'])));
        setIsModalOpen(true);
    };

    // ── Abre modal para EDITAR ────────────────────────────────────
    const abrirEdicao = (record: PendenciaDaPendenciaType) => {
        setEditingId(record.id);
        setModoVisualizacao(false);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    // ── Abre modal somente leitura para VISUALIZAR ────────────────
    const abrirVisualizacao = (record: PendenciaDaPendenciaType) => {
        setEditingId(record.id);
        setModoVisualizacao(true);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const onFinish = async (values: any) => {
        try {
            if (editingId) {
                await service.editarPendenciaDaPendencia(editingId, values);
                message.success("Registro atualizado!");
            } else {
                await service.salvarPendenciaDaPendencia({
                    ...values,
                    idcliente: idCliente,
                    idvendedor: idVendedor,
                });
                message.success("Registro salvo!");
            }
            setIsModalOpen(false);
            carregarDados();
            onAtualizar?.();
        } catch {
            message.error("Erro na operação.");
        }
    };

    const confirmarExclusao = async (id: number) => {
        try {
            await service.excluirPendenciaDaPendencia(id);
            message.success("Removido!");
            carregarDados();
            onAtualizar?.();
        } catch {
            message.error("Erro ao excluir.");
        }
    };

    // ── Finalizar / Reabrir — todos os níveis podem alterar status ─
    const handleAlterarStatus = async (record: PendenciaDaPendenciaType) => {
        try {
            setLoading(true);
            if (record.status === 'A') {
                await service.finalizarPendenciaDaPendencia(record.id);
                message.success("Finalizado!");
            } else {
                // Reabre — chama editar só alterando status (ou endpoint dedicado se preferir)
                await service.editarPendenciaDaPendencia(record.id, {
                    ...record,
                    status: 'A',
                });
                message.success("Reaberto!");
            }
            carregarDados();
            onAtualizar?.();
        } catch {
            message.error("Erro ao alterar status.");
        } finally {
            setLoading(false);
        }
    };

    const renderTag = (val?: string) => {
        if (!val) return <span style={{ color: '#d9d9d9' }}>—</span>;
        return (
            <Tag
                color={CORES_SITUACAO[val] || 'default'}
                style={{ fontSize: '10px', fontWeight: 700, margin: 0, padding: '0 5px' }}
            >
                {val}
            </Tag>
        );
    };

    const headerStyle = {
        background: 'linear-gradient(135deg, #9B1C1C 0%, #B22222 60%, #C0392B 100%)',
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: '0.72rem',
        letterSpacing: '0.07em',
        borderBottom: '2px solid rgba(255,255,255,0.15)',
        padding: '8px 10px',
    };

    const abertos = dados.filter(d => d.status === 'A').length;
    const finalizados = dados.filter(d => d.status === 'F').length;

    const columns: ColumnsType<PendenciaDaPendenciaType> = [
        {
            // Sem fixed — sem width grande — deixa a tabela distribuir
            title: '#', key: 'index', align: 'center',
            onHeaderCell: () => ({ style: headerStyle }),
            render: (_: any, __: any, i: number) => (
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7f1d1d' }}>{i + 1}</span>
            ),
        },
        {
            title: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <CalendarOutlined style={{ opacity: 0.85 }} /> DATA
                </span>
            ),
            dataIndex: 'data_formatada', key: 'data_formatada',
            onHeaderCell: () => ({ style: headerStyle }),
            render: (val: string) => (
                <span style={{ fontSize: '0.72rem', fontWeight: 500, color: '#1a1a2e', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                    {val || '—'}
                </span>
            ),
        },
        {
            title: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <UserOutlined style={{ opacity: 0.85 }} /> VENDEDOR
                </span>
            ),
            dataIndex: 'nomevendedor', key: 'nomevendedor',
            onHeaderCell: () => ({ style: headerStyle }),
            render: (val: string) => (
                <span style={{ fontSize: '0.72rem', fontWeight: 500, color: '#1a1a2e' }}>{val || '—'}</span>
            ),
        },
        // 10 colunas de etapas — sem largura fixa, distribuem proporcionalmente
        ...SIGLAS.map((sigla, i) => ({
            title: (
                <Tooltip title={NOMES_ETAPAS[i]}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.1 }}>
                        <span style={{ fontSize: '0.55rem', opacity: 0.75 }}>({i + 1})</span>
                        <span style={{ fontSize: '0.65rem' }}>{sigla}</span>
                    </div>
                </Tooltip>
            ),
            dataIndex: `e${i + 1}`, key: `e${i + 1}`, align: 'center' as const,
            onHeaderCell: () => ({ style: { ...headerStyle, textAlign: 'center' as const, padding: '5px 2px' } }),
            render: (val: string) => renderTag(val),
        })),
        {
            title: 'ST', dataIndex: 'status', key: 'status', align: 'center',
            onHeaderCell: () => ({ style: { ...headerStyle, textAlign: 'center' as const } }),
            render: (status: string, record: PendenciaDaPendenciaType) => (
                <Tooltip title={status === 'A' ? 'Clique para finalizar' : 'Clique para reabrir'}>
                    <Tag
                        color={status === 'F' ? 'green' : 'processing'}
                        style={{ fontSize: '9px', fontWeight: 700, margin: 0, cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleAlterarStatus(record)}
                    >
                        {status === 'F' ? 'FIN' : 'ABT'}
                    </Tag>
                </Tooltip>
            ),
        },
        {
            title: 'OBS', dataIndex: 'observacao', key: 'observacao',
            onHeaderCell: () => ({ style: headerStyle }),
            render: (val: string) => (
                <span style={{
                    fontSize: '0.78rem',
                    color: val ? '#555' : '#bbb',
                    fontStyle: val ? 'normal' : 'italic',
                    whiteSpace: 'pre-wrap',       // respeita quebras de linha
                    wordBreak: 'break-word',       // quebra palavras longas
                    display: 'block',
                    maxWidth: 220,
                }}>
                    {val || '—'}
                </span>
            ),
        },
        {
            title: 'AÇÕES', align: 'center', width: 100,
            onHeaderCell: () => ({ style: { ...headerStyle, textAlign: 'center' as const } }),
            render: (_: any, record: PendenciaDaPendenciaType) => (
                <Space size={2}>
                    {/* Visualizar — todos */}
                    <Tooltip title="Visualizar">
                        <Button
                            type="text"
                            icon={<EyeOutlined style={{ color: '#8c8c8c', fontSize: '14px' }} />}
                            size="small"
                            onClick={() => abrirVisualizacao(record)}
                        />
                    </Tooltip>

                    {/* Editar — todos */}
                    <Tooltip title="Editar">
                        <Button
                            type="text"
                            icon={<EditOutlined style={{ color: '#1890ff', fontSize: '14px' }} />}
                            size="small"
                            onClick={() => abrirEdicao(record)}
                        />
                    </Tooltip>

                    {/* Finalizar / Reabrir — todos os níveis */}
                    <Popconfirm
                        title={record.status === 'A' ? 'Finalizar esta pendência?' : 'Reabrir esta pendência?'}
                        onConfirm={() => handleAlterarStatus(record)}
                        okText="Sim"
                        cancelText="Não"
                        okButtonProps={{
                            style: {
                                background: record.status === 'A'
                                    ? 'linear-gradient(135deg, #43A047, #2E7D32)'
                                    : 'linear-gradient(135deg, #fa8c16, #d46b08)',
                                borderColor: 'transparent',
                            }
                        }}
                    >
                        <Tooltip title={record.status === 'A' ? 'Finalizar' : 'Reabrir'}>
                            <Button
                                type="text"
                                size="small"
                                icon={
                                    record.status === 'A'
                                        ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
                                        : <SyncOutlined style={{ color: '#fa8c16', fontSize: '14px' }} />
                                }
                            />
                        </Tooltip>
                    </Popconfirm>

                    {/* Excluir — somente admins e gerentes */}
                    {podeExcluir && (
                        <Popconfirm
                            title="Excluir permanentemente?"
                            onConfirm={() => confirmarExclusao(record.id)}
                            icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
                        >
                            <Tooltip title="Excluir">
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined style={{ fontSize: '14px' }} />}
                                    size="small"
                                />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="pdp-wrapper">            <style>{`
                .pdp-wrapper { width: 100%; max-width: 100%; overflow: hidden; box-sizing: border-box; }
                /* tableLayout fixed: células respeitam a largura do container */
                .pdp-table { width: 100% !important; table-layout: fixed !important; }
                .pdp-table .ant-table { width: 100% !important; }
                .pdp-table .ant-table-container { width: 100% !important; overflow: hidden; }
                .pdp-table .ant-spin-container { width: 100% !important; overflow: hidden; }
                .pdp-table colgroup col { min-width: 0 !important; }

                .pdp-table .ant-table-thead > tr > th {
                    padding: 6px 3px !important;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .pdp-table .ant-table-tbody > tr > td {
                    padding: 5px 3px !important;
                    border-bottom: 1px solid #fdf0f0 !important;
                    transition: background 0.15s;
                    overflow: hidden;
                }
                .pdp-table .ant-table-tbody > tr:hover > td { background: #fff5f5 !important; }
                .pdp-table .ant-table-tbody > tr:last-child > td { border-bottom: none !important; }
                .pdp-table .ant-table-container {
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid #f3e6e6 !important;
                }
                .pdp-row-finalizada > td { opacity: 0.55; }
            `}</style>

            <Card
                size="small"
                bordered={false}
                bodyStyle={{ padding: 0 }}
                style={{
                    width: '100%',
                    maxWidth: '100%',
                    margin: '4px 0',
                    borderRadius: 8,
                    border: '1px solid #f3e6e6',
                    boxShadow: '0 1px 4px rgba(178,34,34,0.07)',
                    overflow: 'hidden',
                    boxSizing: 'border-box' as const,
                }}
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0 4px' }}>
                        <span style={{ display: 'inline-block', width: 4, height: 18, borderRadius: 4, backgroundColor: '#B22222' }} />
                        <ExclamationCircleOutlined style={{ color: '#B22222', fontSize: '0.9rem' }} />
                        <Text strong style={{ fontSize: '0.88rem', color: '#1a1a2e', letterSpacing: '0.04em' }}>
                            Pendências da Pendência
                        </Text>
                        <Text style={{ fontSize: '0.78rem', color: '#999' }}>— {nomeCliente}</Text>
                        <span style={{
                            fontSize: '0.68rem', fontWeight: 600,
                            backgroundColor: 'rgba(178,34,34,0.08)', border: '1px solid rgba(178,34,34,0.2)',
                            color: '#B22222', padding: '1px 8px', borderRadius: 20,
                        }}>
                            Total: {dados.length}
                        </span>
                        {abertos > 0 && (
                            <Badge count={abertos} color="#fa8c16" title={`${abertos} em aberto`} style={{ fontSize: '10px' }} />
                        )}
                        {finalizados > 0 && (
                            <Badge count={finalizados} color="#52c41a" title={`${finalizados} finalizado(s)`} style={{ fontSize: '10px' }} />
                        )}
                    </div>
                }
                extra={
                    <Space size={6}>
                        <Button
                            size="small"
                            icon={<SyncOutlined spin={loading} />}
                            onClick={carregarDados}
                            disabled={loading}
                            style={{ borderRadius: 8, borderColor: '#f3e6e6', color: '#7f1d1d', fontWeight: 600 }}
                        >
                            Atualizar
                        </Button>

                        {/* Botão "Nova Tarefa" — oculto para vendedor (somenteLeitura)
                            e desabilitado se já existir um registro aberto */}
                        {!somenteLeitura && (
                            <Tooltip
                                title={temAberto
                                    ? "Existe uma pendência em aberto. Finalize-a antes de criar uma nova."
                                    : "Registrar nova pendência da pendência"
                                }
                            >
                                <Button
                                    type="primary"
                                    size="small"
                                    icon={<PlusOutlined />}
                                    onClick={abrirNovo}
                                    disabled={temAberto}
                                    style={{
                                        background: temAberto
                                            ? undefined
                                            : 'linear-gradient(135deg, #9B1C1C, #B22222)',
                                        borderColor: 'transparent',
                                        borderRadius: 8,
                                        fontWeight: 700,
                                        boxShadow: temAberto ? 'none' : '0 2px 8px rgba(178,34,34,0.3)',
                                    }}
                                >
                                    Nova Tarefa
                                </Button>
                            </Tooltip>
                        )}
                    </Space>
                }
            >
                {/* Aviso inline quando já existe aberto */}
                {temAberto && !somenteLeitura && (
                    <Alert
                        type="warning"
                        showIcon
                        message="Existe uma pendência em aberto. Finalize-a para poder criar uma nova."
                        style={{
                            margin: '8px 12px 0',
                            borderRadius: 8,
                            fontSize: '0.8rem',
                            padding: '6px 12px',
                        }}
                    />
                )}

                <div style={{ width: '100%', overflowX: 'auto' }}>
                <Table
                    className="pdp-table"
                    dataSource={dados}
                    columns={columns}
                    size="small"
                    pagination={{ pageSize: 5, size: 'small', showSizeChanger: false }}
                    loading={loading}
                    rowKey="id"
                    bordered={false}
                    tableLayout="fixed"
                    style={{ width: '100%' }}
                    rowClassName={(record) => record.status === 'F' ? 'pdp-row-finalizada' : ''}
                />
                </div>
            </Card>

            {/* ── Modal Criar / Editar / Visualizar ── */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ display: 'inline-block', width: 4, height: 20, borderRadius: 4, backgroundColor: '#B22222', marginRight: 4 }} />
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1a2e' }}>
                            {modoVisualizacao ? 'Detalhes' : editingId ? 'Editar Registro' : 'Nova Tarefa de Pendência'}
                        </span>
                        <span style={{
                            fontSize: '0.75rem', color: '#B22222', fontWeight: 500,
                            background: 'rgba(178,34,34,0.08)', padding: '1px 8px',
                            borderRadius: 20, border: '1px solid rgba(178,34,34,0.2)',
                        }}>
                            {nomeCliente}
                        </span>
                    </div>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                // No modo visualização: sem botão OK
                footer={modoVisualizacao
                    ? [
                        <Button key="fechar" onClick={() => setIsModalOpen(false)} style={{ borderRadius: 8 }}>
                            Fechar
                        </Button>,
                        <Button
                            key="editar"
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => setModoVisualizacao(false)}
                            style={{
                                background: 'linear-gradient(135deg, #1890ff, #096dd9)',
                                borderColor: 'transparent', borderRadius: 8, fontWeight: 700,
                            }}
                        >
                            Editar
                        </Button>,
                    ]
                    : undefined
                }
                onOk={modoVisualizacao ? undefined : () => form.submit()}
                okText={editingId ? "Salvar Alterações" : "Cadastrar"}
                cancelText="Cancelar"
                width={860}
                centered
                destroyOnClose
                styles={undefined}
                okButtonProps={{
                    style: {
                        background: 'linear-gradient(135deg, #9B1C1C, #B22222)',
                        borderColor: 'transparent', borderRadius: 8,
                        fontWeight: 700, height: 38, paddingInline: 24,
                        boxShadow: '0 3px 8px rgba(178,34,34,0.35)',
                    },
                }}
                cancelButtonProps={{ style: { borderRadius: 8, height: 38 } }}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Form.Item
                                name="observacao"
                                label={<span style={{ fontWeight: 600, fontSize: '0.82rem', color: '#1a1a2e' }}>Observação</span>}
                            >
                                <Input.TextArea
                                    rows={2}
                                    placeholder="Descreva a situação desta pendência..."
                                    disabled={modoVisualizacao}
                                    style={{ borderRadius: 8, fontSize: '0.85rem' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider plain style={{ fontSize: '0.78rem', fontWeight: 700, color: '#B22222', borderColor: '#fde8e8', marginBlock: 8 }}>
                        SITUAÇÃO POR ETAPA
                    </Divider>

                    <Row gutter={[8, 4]}>
                        {NOMES_ETAPAS.map((nome, i) => (
                            <Col key={i} xs={12} sm={8} md={6} lg={4}>
                                <Form.Item
                                    name={`e${i + 1}`}
                                    label={
                                        <span style={{ fontSize: '10px', fontWeight: 600, color: '#7f1d1d', letterSpacing: '0.02em' }}>
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
                                        disabled={modoVisualizacao}
                                        options={OPCOES_SITUACAO}
                                        style={{ borderRadius: 6 }}
                                    />
                                </Form.Item>
                            </Col>
                        ))}
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}