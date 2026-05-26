import {
    Table, Card, Input, Space, Button, Tag, Typography,
    Tooltip, Modal, Row, Col, Statistic, Select, message
} from "antd";
import {
    SearchOutlined, HomeOutlined, UserOutlined,
    EditOutlined, BuildOutlined,
    CheckCircleOutlined, SyncOutlined, ShopOutlined,
    FilePdfOutlined
} from "@ant-design/icons";
import { useContext, useEffect, useState, useCallback } from "react";
import { UsuarioContext } from "../../../context/useContext";
import obrasService from "../../../service/ObrasService";
import RtService from "../../../service/RtService";
import TabelaObrasEtapasComponent from "./TabelaObrasClienteComponent";

const serviceRt = new RtService();
const { Text } = Typography;

export default function GestaoObrasComponent() {
    const { codigoUsuario, idNivelUsuario, idLoja: idLojaPadrao } = useContext(UsuarioContext);

    const [gerandoPdf, setGerandoPdf] = useState(false);

    // Estados de Dados e Loading
    const [dados, setDados] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Estados de Filtros
    const [filtroTexto, setFiltroTexto] = useState("");
    const [filtroStatus, setFiltroStatus] = useState<string>("TODOS");
    const [lojas, setLojas] = useState<any[]>([]);
    const [lojaSelecionada, setLojaSelecionada] = useState<string | number | undefined>(idLojaPadrao);

    // Estados de UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [obraSelecionada, setObraSelecionada] = useState<any>(null);

    // Permissões
    const isAdmin = idNivelUsuario === 1 || idNivelUsuario === 11;
    const isGestor = isAdmin || idNivelUsuario === 2;

    const carregarLojas = useCallback(async () => {
        try {
            const rs = await serviceRt.listarLojas();
            if (rs.data && Array.isArray(rs.data.lojas)) {
                setLojas(rs.data.lojas);
            }
        } catch (e) {
            console.error("Erro ao carregar lojas");
        }
    }, []);

    const carregarDados = useCallback(async () => {
        setDados([]);
        setLoading(true);
        try {
            const rs = await obrasService.listarTodasObrasGeral({
                codigoVendedor: codigoUsuario,
                idNivelUsuario: Number(idNivelUsuario),
                // Se 'TODAS' estiver selecionado, envia undefined para o backend ignorar o filtro de loja
                idLoja: isAdmin ? (lojaSelecionada === "TODAS" ? undefined : lojaSelecionada) : idLojaPadrao
            });
            setDados(Array.isArray(rs.data) ? rs.data : []);
        } catch (e) {
            setDados([]);
            message.error("Erro ao carregar lista de obras.");
        } finally {
            setLoading(false);
        }
    }, [codigoUsuario, idNivelUsuario, idLojaPadrao, lojaSelecionada, isAdmin]);

    useEffect(() => {
        if (isAdmin) carregarLojas();
        carregarDados();
    }, [carregarDados, carregarLojas, isAdmin]);

    const handleGerarPdf = async () => {
        if (!isGestor) return;
        
        setGerandoPdf(true);
        try {
            const response = await obrasService.downloadRelatorioObrasGestao({
                idLoja: isAdmin ? (lojaSelecionada === "TODAS" ? "TODOS" : lojaSelecionada) : idLojaPadrao,
                status: filtroStatus,
                idNivelUsuario: idNivelUsuario,
                codigoVendedor: "TODOS" // O Admin quer ver todos os vendedores daquela loja agrupados
            });
    
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Relatorio_Agrupado_Obras_${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (e) {
            message.error("Erro ao gerar PDF agrupado.");
        } finally {
            setGerandoPdf(false);
        }
    };

    // Lógica de Filtro em tela (Client-side)
    const dadosFiltrados = dados.filter((d: any) => {
        const correspondeTexto = d.nomeCliente?.toLowerCase().includes(filtroTexto.toLowerCase()) ||
            d.descricao?.toLowerCase().includes(filtroTexto.toLowerCase());
        const correspondeStatus = filtroStatus === "TODOS" || d.status === filtroStatus;
        return correspondeTexto && correspondeStatus;
    });

    // Cálculos de Estatísticas
    const totalObras = dadosFiltrados.length;
    const obrasFinalizadas = dadosFiltrados.filter((d: any) => d.status === 'F').length;
    const obrasEmAndamento = totalObras - obrasFinalizadas;

    const columns = [
        {
            title: 'CLIENTE / OBRA',
            key: 'cliente_obra',
            render: (record: any) => (
                <Space direction="vertical" size={0}>
                    <Text strong style={{ color: '#0054a6' }}>{record.nomeCliente}</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>{record.descricao}</Text>
                </Space>
            )
        },
        {
            title: 'LOCALIZAÇÃO',
            dataIndex: 'endereco',
            render: (end: string) => <Tooltip title={end}>{end}</Tooltip>
        },
        {
            title: 'VENDEDOR',
            dataIndex: 'Vendedor',
            render: (text: string) => <Tag icon={<UserOutlined />}>{text}</Tag>
        },
        {
            title: 'LOJA',
            dataIndex: 'fantasia',
            render: (text: string) => <Tag color="blue" icon={<ShopOutlined />}>{text}</Tag>
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            align: 'center' as const,
            render: (status: string) => (
                <Tag color={status === 'F' ? 'green' : 'orange'} style={{ fontWeight: 'bold' }}>
                    {status === 'F' ? 'FINALIZADO' : 'EM ANDAMENTO'}
                </Tag>
            )
        },
        {
            title: 'AÇÕES',
            align: 'center' as const,
            render: (record: any) => (
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => {
                        setObraSelecionada(record);
                        setIsModalOpen(true);
                    }}
                >
                    Etapas
                </Button>
            )
        }
    ];

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>

            {/* Cards de Resumo */}
            <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col span={8}>
                    <Card bordered={false} style={{ borderLeft: '4px solid #0054a6' }}>
                        <Statistic title="Total Exibido" value={totalObras} prefix={<BuildOutlined style={{ color: '#0054a6' }} />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} style={{ borderLeft: '4px solid #fa8c16' }}>
                        <Statistic title="Em Andamento" value={obrasEmAndamento} valueStyle={{ color: '#fa8c16' }} prefix={<SyncOutlined spin={loading} />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} style={{ borderLeft: '4px solid #52c41a' }}>
                        <Statistic title="Finalizadas" value={obrasFinalizadas} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} />
                    </Card>
                </Col>
            </Row>

            <Card
                title={
                    <Space size="middle">
                        <Space><HomeOutlined /> <b>GESTÃO DE OBRAS</b></Space>
                        {isAdmin && (
                            <Select
                                placeholder="Filtrar Loja"
                                style={{ width: 220 }}
                                value={lojaSelecionada}
                                onChange={(val) => setLojaSelecionada(val)}
                                options={[
                                    { label: '--- TODAS AS LOJAS ---', value: 'TODAS' },
                                    ...lojas.map(l => ({ label: l.descricao, value: l.id_loja }))
                                ]}
                                showSearch
                                optionFilterProp="label"
                            />
                        )}
                        <Select
                            value={filtroStatus}
                            style={{ width: 160 }}
                            onChange={setFiltroStatus}
                            options={[
                                { label: 'Todos Status', value: 'TODOS' },
                                { label: 'Em Andamento', value: 'A' },
                                { label: 'Finalizadas', value: 'F' },
                            ]}
                        />
                    </Space>
                }
                extra={
                    <Space>
                        {isGestor && (
                            <Button
                                danger
                                icon={<FilePdfOutlined />}
                                onClick={handleGerarPdf}
                                loading={gerandoPdf} // Usa o estado de carregamento do PDF
                            >
                                PDF
                            </Button>
                        )}
                        <Input
                            placeholder="Buscar cliente ou obra..."
                            prefix={<SearchOutlined />}
                            allowClear
                            onChange={e => setFiltroTexto(e.target.value)}
                            style={{ width: 250 }}
                        />
                        <Button icon={<SyncOutlined spin={loading} />} onClick={carregarDados}>Atualizar</Button>
                    </Space>
                }
            >
                <Table
                    dataSource={dadosFiltrados}
                    columns={columns}
                    rowKey={(record) => `${record.id}-${record.idcliente}`}
                    loading={loading}
                    size="small"
                    bordered
                    pagination={{ pageSize: 15 }}
                />
            </Card>

            <Modal
                open={isModalOpen}
                onCancel={() => { setIsModalOpen(false); carregarDados(); }}
                footer={[<Button key="fechar" onClick={() => setIsModalOpen(false)}>Sair</Button>]}
                width="98%"
                style={{ top: 10 }}
                destroyOnClose
            >
                {obraSelecionada && (
                    <TabelaObrasEtapasComponent
                        idObra={obraSelecionada.id}
                        idCliente={obraSelecionada.idcliente}
                        idVendedor={obraSelecionada.idvendedor}
                        nomeCliente={obraSelecionada.nomeCliente}
                    />
                )}
            </Modal>
        </div>
    );
}