import { Badge, Button, Card, Table, Tooltip, Typography, Space, message, Modal, Timeline, Spin, Empty, Select, Row, Col, Popconfirm, Tag } from "antd";
import { EnvironmentOutlined, SyncOutlined, GlobalOutlined, HistoryOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState, useCallback } from "react";
import TrackerService from "../../../service/TrackerService";
import RtService from "../../../service/RtService"; 
import { UsuarioContext } from "../../../context/useContext";

const trackerService = new TrackerService();
const rtService = new RtService();

interface LojasType {
    cod_loja_pre: number;
    id_loja: string;
    descricao: string;
}

export default function MonitoramentoVendedoresComponent() {
    const { idLoja: idLojaContext, idNivelUsuario, subNivel1 } = useContext(UsuarioContext);
    
    const [dados, setDados] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Filtros e Lojas
    const [lojas, setLojas] = useState<LojasType[]>([]);
    const [lojaSelecionada, setLojaSelecionada] = useState<string | number>(idLojaContext);

    // Modais e Mapas
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mapUrl, setMapUrl] = useState("");
    const [loadingMapa, setLoadingMapa] = useState<string | null>(null);
    const [loadingIframe, setLoadingIframe] = useState(true);
    const [logs, setLogs] = useState<any[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [modalHistoricoVisible, setModalHistoricoVisible] = useState(false);
    const [vendedorSelecionado, setVendedorSelecionado] = useState("");

    const isAdminMaster = idNivelUsuario === 11 && subNivel1 === 1;

    const carregarLojas = useCallback(async () => {
        try {
            const rs = await rtService.listarLojas();
            setLojas(rs.data.lojas || []);
        } catch (error) {
            console.error('Erro ao buscar lojas:', error);
        }
    }, []);

    const carregarStatus = useCallback(async () => {
        const lojaAlvo = isAdminMaster ? lojaSelecionada : idLojaContext;
        if (!lojaAlvo) return;

        setLoading(true);
        try {
            const rs = await trackerService.listarStatusVendedores(Number(lojaAlvo));
            const lista = rs.data || [];
            // Online primeiro, depois por nome
            const ordenados = [...lista].sort((a, b) => (a.is_online === 'S' ? -1 : 1));
            setDados(ordenados);
        } catch (error) {
            message.error("Erro ao carregar dados dos vendedores");
        } finally {
            setLoading(false);
        }
    }, [lojaSelecionada, idLojaContext, isAdminMaster]);

    useEffect(() => {
        if (isAdminMaster) carregarLojas();
    }, [isAdminMaster, carregarLojas]);

    useEffect(() => {
        carregarStatus();
        const interval = setInterval(carregarStatus, 30000);
        return () => clearInterval(interval);
    }, [carregarStatus]);

    const handleAlterarStatus = async (record: any) => {
        // Tenta pegar idUsuario ou idusuario (prevenção de case-sensitivity)
        const idParaAlterar = record.idUsuario || record.idusuario;
        const lojaParaAlterar = record.idLoja || record.idloja || lojaSelecionada;
        const novoStatus = record.ativo === 'S' ? 'N' : 'S';
    
        if (!idParaAlterar) {
            message.error("ID do usuário não encontrado no registro.");
            console.error("Record completo:", record);
            return;
        }
    
        try {
            await trackerService.alterarStatusUsuario(idParaAlterar, lojaParaAlterar, novoStatus);
            message.success(`Vendedor ${novoStatus === 'N' ? 'bloqueado' : 'ativado'} com sucesso!`);
            carregarStatus();
        } catch (error) {
            message.error("Erro ao alterar status.");
        }
    };

    const abrirHistorico = async (codigoVendedor: string) => {
        setVendedorSelecionado(codigoVendedor);
        setLoadingLogs(true);
        setModalHistoricoVisible(true);
        setLogs([]);

        try {
            const rs = await trackerService.buscarLogsVendedor(codigoVendedor);
            const logsIniciais = rs.data || [];
            setLogs(logsIniciais);

            const logsParaProcessar = logsIniciais.filter((l: any) => 
                l.latitude && (!l.endereco_texto || l.endereco_texto === "PENDENTE" || l.endereco_texto === "Aguardando consulta...")
            );

            if (logsParaProcessar.length > 0) {
                for (const log of logsParaProcessar) {
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${log.latitude}&lon=${log.longitude}&zoom=18`,
                            { headers: { 'Accept-Language': 'pt-BR', 'User-Agent': 'JMonte_Auditoria_V3' } }
                        );
                        const data = await response.json();
                        if (data.display_name) {
                            await trackerService.atualizarEnderecoLog(log.id, data.display_name);
                            setLogs(prev => prev.map(item => item.id === log.id ? { ...item, endereco_texto: data.display_name } : item));
                        }
                        await new Promise(res => setTimeout(res, 1200));
                    } catch (e) { console.error("Erro geocode:", log.id); }
                }
            }
        } catch (error) {
            message.error("Erro ao buscar logs");
        } finally {
            setLoadingLogs(false);
        }
    };

    const columns = [
        {
            title: 'Status',
            dataIndex: 'is_online',
            key: 'is_online',
            width: 110,
            render: (status: string, record: any) => (
                <Space direction="vertical" size={0}>
                    <Badge
                        status={status === 'S' ? "success" : "error"}
                        text={<b style={{ color: status === 'S' ? '#52c41a' : '#ff4d4f', fontSize: '10px' }}>{status === 'S' ? "ONLINE" : "OFFLINE"}</b>}
                    />
                    {record.ativo === 'N' && <Tag color="red" style={{ fontSize: '9px' }}>BLOQUEADO</Tag>}
                </Space>
            )
        },
        { title: 'Cod.', dataIndex: 'codigoVendedor', key: 'codigoVendedor', width: 70 },
        { title: 'Vendedor', dataIndex: 'nomeUsuario', key: 'nomeUsuario', render: (t: string) => <b style={{ fontSize: '12px' }}>{t}</b> },
        {
            title: 'Última Batida',
            dataIndex: 'ultima_batida',
            key: 'ultima_batida',
            render: (data: string) => data ? <span style={{ fontSize: '11px' }}>{new Date(data).toLocaleString('pt-BR')}</span> : '---'
        },
        {
            title: 'Ações',
            key: 'acoes',
            align: 'center' as const,
            width: 150,
            render: (_: any, record: any) => (
                <Space>
                    <Tooltip title="Ver no Mapa">
                        <Button
                            type="primary" size="small" shape="circle" icon={<GlobalOutlined />}
                            loading={loadingMapa === record.codigoVendedor}
                            disabled={!record.ultima_lat}
                            onClick={() => {
                                setLoadingMapa(record.codigoVendedor);
                                setMapUrl(`https://maps.google.com/maps?q=${record.ultima_lat},${record.ultima_lng}&z=15&output=embed`);
                                setTimeout(() => { setIsModalOpen(true); setLoadingMapa(null); }, 600);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Histórico">
                        <Button size="small" shape="circle" icon={<HistoryOutlined />} onClick={() => abrirHistorico(record.codigoVendedor)} />
                    </Tooltip>
                    
                    <Popconfirm
                        title={record.ativo === 'S' ? "Bloquear usuário?" : "Desbloquear usuário?"}
                        onConfirm={() => handleAlterarStatus(record)}
                        okText="Sim" cancelText="Não"
                    >
                        <Tooltip title={record.ativo === 'S' ? "Bloquear Acesso" : "Liberar Acesso"}>
                            <Button 
                                size="small" shape="circle" 
                                danger={record.ativo === 'S'}
                                icon={record.ativo === 'S' ? <LockOutlined /> : <UnlockOutlined />}
                                style={record.ativo === 'N' ? {backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a'} : {}}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '10px' }}>
            <Card
                title={
                    <Row gutter={16} align="middle">
                        <Col><EnvironmentOutlined /> <b>Monitoramento</b></Col>
                        {isAdminMaster && (
                            <Col style={{ marginLeft: '20px' }}>
                                <Space>
                                    <span>Loja:</span>
                                    <Select
                                        showSearch style={{ width: 300 }}
                                        optionFilterProp="label"
                                        value={String(lojaSelecionada)}
                                        onChange={(val) => setLojaSelecionada(val)}
                                    >
                                        {lojas.map(l => (
                                            <Select.Option key={l.id_loja} value={l.id_loja} label={`${l.id_loja} - ${l.descricao}`}>
                                                <b style={{ color: '#1890ff' }}>{l.id_loja}</b> - {l.descricao}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Space>
                            </Col>
                        )}
                    </Row>
                }
                extra={<Button type="primary" ghost icon={<SyncOutlined spin={loading} />} onClick={carregarStatus}>Sincronizar</Button>}
                bodyStyle={{ padding: '0px' }}
            >
                <Table dataSource={dados} columns={columns} rowKey="codigoVendedor" loading={loading} pagination={false} bordered size="small" />
            </Card>

            <Modal
                title={<span><HistoryOutlined /> Histórico - {vendedorSelecionado}</span>}
                open={modalHistoricoVisible} onCancel={() => setModalHistoricoVisible(false)}
                footer={[<Button key="fechar" onClick={() => setModalHistoricoVisible(false)}>Fechar</Button>]}
                width={700} centered destroyOnClose
            >
                <Spin spinning={loadingLogs}>
                    <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '10px' }}>
                        {logs.length > 0 ? (
                            <Timeline mode="left">
                                {logs.map((log, i) => (
                                    <Timeline.Item key={i} color={log.latitude ? "green" : "gray"} label={new Date(log.data_log).toLocaleString('pt-BR')}>
                                        <Card size="small" style={{ marginBottom: 5 }}>
                                            <Typography.Text style={{ fontSize: '12px' }}><EnvironmentOutlined /> {log.endereco_texto || "---"}</Typography.Text>
                                        </Card>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        ) : <Empty />}
                    </div>
                </Spin>
            </Modal>

            <Modal
                title="Localização Atual" open={isModalOpen} onCancel={() => { setIsModalOpen(false); setLoadingIframe(true); }}
                footer={null} width={900} centered bodyStyle={{ padding: 0, height: '550px' }}
            >
                {loadingIframe && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Spin size="large" /></div>}
                <iframe title="mapa" width="100%" height="100%" style={{ border: 0 }} src={mapUrl} allowFullScreen onLoad={() => setLoadingIframe(false)} />
            </Modal>
        </div>
    );
}