import {
    PlusOutlined,
    DeleteOutlined,
    HomeOutlined,
    InfoCircleOutlined,
    SyncOutlined,
    EditOutlined,
    CheckCircleOutlined,
    FilePdfOutlined
} from "@ant-design/icons";
import {
    Button, Table, Form, Input, Select, Row, Col, Divider,
    message, Popconfirm, Tag, Modal, Card, Tooltip, Space,
    Typography
} from "antd";
import type { ColumnsType } from 'antd/es/table';
import { useContext, useEffect, useState } from "react";
import EtapasService from "../../../service/EtapasService";
import { UsuarioContext } from "../../../context/useContext";
import obrasService from "../../../service/ObrasService";

const service = new EtapasService();
const { Text } = Typography;

interface ObraEtapaType {
    status: string;
    id: number;
    idcliente: string;
    idvendedor: string;
    endereco: string;
    contato: string;
    contato_arq: string;
    descricao: string;
    observacao?: string;
    e1: string; e2: string; e3: string; e4: string; e5: string;
    e6: string; e7: string; e8: string; e9: string; e10: string;
}

const nomesEtapas = [
    "1 BÁSICO", "2 FERRAMEN E EPIS", "3 HIDRÁULICO", "4 CABOS E FIOS", "5 INTER E TOMADA",
    "6 PISOS E REVES", "7 LOUÇAS E METAIS", "8 PORTAS E FERRA", "9 PINTURA", "10 ILUMINAÇÃO"
];

export default function TabelaObrasEtapasComponent({ idCliente, idVendedor, nomeCliente, idObra }: { idCliente: string, idVendedor: string, nomeCliente: string, idObra?: number; }) {
    const [form] = Form.useForm();
    const [obras, setObras] = useState<ObraEtapaType[]>([]);
    const [loading, setLoading] = useState(false);
    const [gerandoPdf, setGerandoPdf] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { idNivelUsuario, codigoUsuario } = useContext(UsuarioContext);

    const carregarObras = async () => {
        setLoading(true);
        try {
            let rs;
            if (idObra) {
                rs = await obrasService.buscarObraPorId(idObra);
                setObras(rs.data ? [rs.data] : []);
            } else {
                rs = await service.listarObrasPorCliente(idCliente);
                setObras(rs.data || []);
            }
        } catch (e) {
            message.error("Erro ao carregar obras.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { carregarObras(); }, [idCliente, idObra]);

    const handleGerarPdfIndividual = async () => {
        setGerandoPdf(true);
        try {
            // Se estivermos vendo uma obra específica (idObra), filtramos o PDF para ela
            const filtros = {
                idLoja: 'TODAS',
                status: 'TODOS',
                idNivelUsuario,
                codigoVendedor: codigoUsuario,
                idObra: idObra || undefined
            };

            const response = await obrasService.downloadRelatorioObrasGestao(filtros);
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Relatorio_Obra_${nomeCliente}_${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            message.success("PDF gerado com sucesso!");
        } catch (e) {
            message.error("Erro ao gerar PDF.");
        } finally {
            setGerandoPdf(false);
        }
    };

    const abrirNovo = () => {
        setEditingId(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const abrirEdicao = (record: ObraEtapaType) => {
        setEditingId(record.id);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const onFinish = async (values: any) => {
        try {
            if (editingId) {
                await service.editarObraEtapa(editingId, values);
                message.success("Obra atualizada!");
            } else {
                await service.salvarObraEtapa({ ...values, idcliente: idCliente, idvendedor: idVendedor });
                message.success("Obra cadastrada!");
            }
            setIsModalOpen(false);
            carregarObras();
        } catch (e) {
            message.error("Erro na operação.");
        }
    };

    const confirmarExclusao = async (id: number) => {
        try {
            await service.excluirObraEtapa(id);
            message.success("Removido!");
            carregarObras();
        } catch (e) {
            message.error("Erro ao excluir.");
        }
    };

    const handleFinalizar = async (id: number) => {
        try {
            setLoading(true);
            await service.finalizarObra(id);
            message.success("Obra finalizada!");
            carregarObras();
        } catch (error) {
            message.error("Erro ao finalizar.");
        } finally {
            setLoading(false);
        }
    };

    const renderTagEtapa = (val: string) => {
        const cores: any = { 'JM': 'green', 'CC': 'red', 'FC': 'orange', 'FM': 'blue' };
        return <Tag color={cores[val] || 'default'} style={{ fontSize: '10px', fontWeight: 'bold', margin: 0 }}>{val || '-'}</Tag>;
    };

    const headerStyle = {
        background: '#fffbe6',
        color: '#856404',
        fontWeight: 700,
        borderBottom: '2px solid #ffe58f',
        fontSize: '11px'
    };
    const columns: ColumnsType<ObraEtapaType> = [
        {
            title: 'ITEM',
            key: 'index',
            width: 45,
            align: 'center',
            fixed: 'left', // Fixado à esquerda
            onHeaderCell: () => ({ style: headerStyle }),
            render: (_: any, __: any, index: number) => <b>{index + 1}</b>
        },
        {
            title: 'OBRA / ENDEREÇO',
            key: 'obra_endereco',
            fixed: 'left', // Fixado à esquerda para não sumir ao rolar
            width: 180,
            onHeaderCell: () => ({ style: headerStyle }),
            render: (record: any) => (
                <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '170px' }}>
                    <Text strong style={{ color: '#0054a6', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {record.descricao}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '10px' }}>
                        <Tooltip title={record.endereco}>
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {record.endereco}
                            </div>
                        </Tooltip>
                    </Text>
                </div>
            )
        },
        ...nomesEtapas.map((nome, i) => ({
            title: (
                <Tooltip title={nome}>
                    <span>{i + 1} <InfoCircleOutlined style={{ fontSize: '8px' }} /></span>
                </Tooltip>
            ),
            dataIndex: `e${i + 1}`,
            align: 'center' as const,
            width: 40, // Colunas de etapas bem estreitas
            onHeaderCell: () => ({ style: { ...headerStyle, textAlign: 'center' as const } }),
            render: (val: string) => renderTagEtapa(val)
        })),
        {
            title: 'ST',
            dataIndex: 'status',
            align: 'center',
            width: 50,
            onHeaderCell: () => ({ style: headerStyle }),
            render: (status: string) => (
                <Tag color={status === 'F' ? 'green' : 'blue'} style={{ fontSize: '9px', fontWeight: 'bold', margin: 0 }}>
                    {status === 'F' ? 'F' : 'A'}
                </Tag>
            ),
        },
        {
            title: 'AÇÕES',
            align: 'center',
            fixed: 'right', // CRÍTICO: Fixado à direita para não sumir do campo de visão
            width: 90,
            onHeaderCell: () => ({ style: headerStyle }),
            render: (_, record) => {
                const podeGerenciar = [1, 11, 2].includes(Number(idNivelUsuario));
                return (
                    <Space size={4}>
                        {podeGerenciar && record.status !== 'F' && (
                            <Popconfirm title="Finalizar?" onConfirm={() => handleFinalizar(record.id)}>
                                <Button type="text" icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />} size="small" style={{ padding: '0 4px' }} />
                            </Popconfirm>
                        )}
                        <Button type="text" icon={<EditOutlined style={{ color: '#1890ff' }} />} size="small" onClick={() => abrirEdicao(record)} style={{ padding: '0 4px' }} />
                        {podeGerenciar && (
                            <Popconfirm title="Excluir?" onConfirm={() => confirmarExclusao(record.id)}>
                                <Button type="text" danger icon={<DeleteOutlined />} size="small" style={{ padding: '0 4px' }} />
                            </Popconfirm>
                        )}
                    </Space>
                );
            }
        }
    ];

    return (
        <Card
            size="small"
            bordered={false}
            style={{ width: '100%', margin: '4px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            title={
                <Space>
                    <HomeOutlined style={{ color: '#0054a6' }} />
                    <span style={{ fontWeight: 600 }}>
                        OBRAS: {nomeCliente}
                        <span style={{ color: '#8c8c8c', marginLeft: '8px', fontWeight: 400 }}>
                            ({obras.length})
                        </span>
                    </span>
                </Space>
            }
            extra={
                <Space>
                    <Button size="small" danger icon={<FilePdfOutlined />} loading={gerandoPdf} onClick={handleGerarPdfIndividual}>
                        PDF
                    </Button>
                    <Button size="small" icon={<SyncOutlined spin={loading} />} onClick={carregarObras} disabled={loading}>
                        Atualizar
                    </Button>
                    <Button type="primary" size="small" icon={<PlusOutlined />} onClick={abrirNovo} style={{ backgroundColor: '#2f4f4f', borderColor: '#2f4f4f' }}>
                        Nova Obra
                    </Button>
                </Space>
            }
        >
            <Table
                dataSource={obras}
                columns={columns}
                size="small"
                pagination={false}
                scroll={{ x: 1000, y: 350 }}
                loading={loading}
                rowKey="id"
                bordered
            />

            <Modal
                title={editingId ? <b>EDITAR OBRA</b> : <b>NOVA OBRA</b>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                width={900}
                centered
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={Object.fromEntries(nomesEtapas.map((_, i) => [`e${i + 1}`, 'FC']))}>
                    <Row gutter={12}>
                        <Col span={24}><Form.Item name="descricao" label="Identificação" rules={[{ required: true }]}><Input /></Form.Item></Col>
                        <Col span={24}><Form.Item name="endereco" label="Endereço" rules={[{ required: true }]}><Input /></Form.Item></Col>
                        <Col span={12}><Form.Item name="contato" label="Contato Comprador"><Input /></Form.Item></Col>
                        <Col span={12}><Form.Item name="contato_arq" label="Contato Arquiteto"><Input /></Form.Item></Col>
                        <Col span={24}><Form.Item name="observacao" label="Observações"><Input.TextArea rows={2} /></Form.Item></Col>
                    </Row>
                    <Divider plain style={{ fontSize: '11px' }}>ETAPAS</Divider>
                    <Row gutter={[4, 4]}>
                        {nomesEtapas.map((nome, i) => (
                            <Col key={i} span={4} style={{ maxWidth: '20%' }}>
                                <Form.Item name={`e${i + 1}`} label={<span style={{ fontSize: '10px' }}>{nome}</span>}>
                                    <Select
                                        size="small"
                                        dropdownMatchSelectWidth={false} // Evita que o texto longo fique espremido no dropdown
                                        options={[
                                            { value: 'FC', label: <span><b>FC</b> <span style={{ fontSize: '11px', color: '#8c8c8c' }}>(Falta Comprar)</span></span> },
                                            { value: 'JM', label: <span><b>JM</b> <span style={{ fontSize: '11px', color: '#8c8c8c' }}>(JMonte)</span></span> },
                                            { value: 'CC', label: <span><b>CC</b> <span style={{ fontSize: '11px', color: '#8c8c8c' }}>(Concorrente)</span></span> },
                                            { value: 'FM', label: <span><b>FM</b> <span style={{ fontSize: '11px', color: '#8c8c8c' }}>(Fora Mix)</span></span> },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        ))}
                    </Row>
                </Form>
            </Modal>
        </Card>
    );
}