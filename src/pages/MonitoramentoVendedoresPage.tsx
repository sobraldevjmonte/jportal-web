import { Badge, Button, Card, Table, Tooltip, Typography, Space, message, Row, Col } from "antd";
import { EnvironmentOutlined, SyncOutlined, GlobalOutlined, TeamOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState, useCallback } from "react";
import TrackerService from "../service/TrackerService";
import { UsuarioContext } from "../context/useContext";

const trackerService = new TrackerService();

export default function MonitoramentoVendedoresComponent() {
    const { idLoja } = useContext(UsuarioContext);
    const [dados, setDados] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const carregarStatus = useCallback(async () => {
        if (!idLoja || idLoja === 999999) return;
        setLoading(true);
        try {
            const rs = await trackerService.listarStatusVendedores(idLoja);
            setDados(rs.data || []);
        } catch (error) {
            message.error("Erro ao carregar status dos vendedores");
        } finally {
            setLoading(false);
        }
    }, [idLoja]);

    useEffect(() => {
        carregarStatus();
        // Atualiza o dashboard a cada 60 segundos
        const interval = setInterval(carregarStatus, 30000);
        return () => clearInterval(interval);
    }, [carregarStatus]);

    const columns = [
        {
            title: 'Status',
            dataIndex: 'is_online',
            key: 'is_online',
            width: 120,
            render: (status: string) => (
                <Badge 
                    status={status === 'S' ? "success" : "error"} 
                    text={status === 'S' ? "Online" : "Offline"} 
                />
            )
        },
        {
            title: 'Código',
            dataIndex: 'codigoVendedor',
            key: 'codigoVendedor',
            width: 100,
        },
        {
            title: 'Vendedor',
            dataIndex: 'nomeUsuario',
            key: 'nomeUsuario',
            render: (text: string) => <b>{text}</b>
        },
        {
            title: 'Última Batida',
            dataIndex: 'ultima_batida',
            key: 'ultima_batida',
            render: (data: string) => data ? new Date(data).toLocaleString('pt-BR') : <span style={{color: '#ccc'}}>Nunca logou</span>
        },
        {
            title: 'Localização',
            key: 'mapa',
            align: 'center' as const,
            width: 100,
            render: (_: any, record: any) => (
                <Tooltip title={record.ultima_lat ? "Abrir no Google Maps" : "Sem coordenadas disponíveis"}>
                    <Button 
                        type="primary"
                        shape="circle"
                        icon={<GlobalOutlined />}
                        // Desabilita se o vendedor nunca enviou GPS (lat estiver null)
                        disabled={!record.ultima_lat}
                        onClick={() => {
                            const url = `https://www.google.com/maps/search/?api=1&query=${record.ultima_lat},${record.ultima_lng}`;
                            window.open(url, '_blank');
                        }}
                    />
                </Tooltip>
            )
        }
    ];

    // Cálculos para o resumo
    const totalVendedores = dados.length;
    const totalOnline = dados.filter(d => d.is_online === 'S').length;

    return (
        <div style={{ padding: '5px' }}>
            {/* --- DASHBOARD SUMMARY --- */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <Typography.Text type="secondary"><TeamOutlined /> Total Vendedores</Typography.Text>
                        <Typography.Title level={3} style={{ margin: 0 }}>{totalVendedores}</Typography.Title>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid #52c41a' }}>
                        <Typography.Text type="secondary"><Badge status="success" /> Online Agora</Typography.Text>
                        <Typography.Title level={3} style={{ margin: 0, color: '#52c41a' }}>{totalOnline}</Typography.Title>
                    </Card>
                </Col>
            </Row>

            {/* --- TABELA DE MONITORAMENTO --- */}
            <Card 
                title={
                    <Space>
                        <EnvironmentOutlined style={{ color: '#1890ff' }} />
                        <span>Rastreamento em Tempo Real - Loja {idLoja}</span>
                    </Space>
                }
                extra={
                    <Button 
                        type="dashed"
                        icon={<SyncOutlined spin={loading} />} 
                        onClick={carregarStatus}
                    >
                        Atualizar Agora
                    </Button>
                }
                bodyStyle={{ padding: '0px' }}
            >
                <Table 
                    dataSource={dados} 
                    columns={columns} 
                    rowKey="codigoVendedor" // Usando o código estável como chave da linha
                    loading={loading}
                    pagination={false}
                    bordered
                    size="middle"
                />
            </Card>
        </div>
    );
}