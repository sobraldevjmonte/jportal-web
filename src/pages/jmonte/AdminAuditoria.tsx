import { Table, Card, Button, Space, DatePicker, notification, Typography, Tag, Badge, Tooltip, Input } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { ReloadOutlined, HistoryOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AuditoriaService from '../../service/AuditoriaService';

const { Text } = Typography;
const { RangePicker } = DatePicker;

export default function AdminAuditoria() {
    const [dados, setDados] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const searchInput = useRef<any>(null);
    
    const [periodo, setPeriodo] = useState<any>([
        dayjs().startOf('month'),
        dayjs()
    ]);

    const carregarAuditoria = async () => {
        setLoading(true);
        try {
            const dataInicio = periodo ? periodo[0].format('YYYY-MM-DD') : dayjs().startOf('month').format('YYYY-MM-DD');
            const dataFim = periodo ? periodo[1].format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');

            const resp = await AuditoriaService.listarAuditoria(dataInicio, dataFim);
            setDados(resp || []);
        } catch (e) {
            notification.error({ message: "Erro ao carregar logs de auditoria" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { carregarAuditoria(); }, []);

    // --- REINCLUINDO A FUNÇÃO DE FILTRO ---
    const getColumnSearchProps = (dataIndex: string, title: string) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Buscar ${title}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
                        Filtrar
                    </Button>
                    <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
                        Limpar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value: any, record: any) =>
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
        onFilterDropdownVisibleChange: (visible: boolean) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const columns = [
        {
            title: 'DATA / HORA',
            dataIndex: 'data_acesso',
            key: 'data_acesso',
            width: 170,
            render: (data: string) => <Text strong>{dayjs(data).format('DD/MM/YYYY HH:mm:ss')}</Text>,
        },
        {
            title: 'LOJA',
            dataIndex: 'loja_viculada', 
            key: 'loja_viculada',
            width: 90,
            align: 'center' as const,
            render: (text: string, record: any) => (
                <Tag color="cyan" style={{ fontWeight: 'bold' }}>
                    {text || record.loja || 'N/A'}
                </Tag>
            ),
            filters: Array.from(new Set(dados.map((i: any) => i.loja_viculada || i.loja))).filter(Boolean).map(l => ({ text: l, value: l })),
            onFilter: (value: any, record: any) => (record.loja_viculada || record.loja) === value,
        },
        {
            title: 'USUÁRIO',
            dataIndex: 'nomeUsuario',
            key: 'nomeUsuario',
            width: 220,
            ...getColumnSearchProps('nomeUsuario', 'Usuário'), // Filtro reativado
            render: (text: string, record: any) => (
                <span>
                    <Text style={{ color: '#1890ff' }}>{text || 'Desconhecido'}</Text> <br />
                    <small style={{ color: '#999' }}>ID/Cód: {record.codigo_usuario}</small>
                </span>
            )
        },
        {
            title: 'OPERAÇÃO',
            dataIndex: 'operacao',
            key: 'operacao',
            ...getColumnSearchProps('operacao', 'Operação'), // Filtro reativado
        },
        {
            title: 'DETALHES',
            dataIndex: 'outros',
            key: 'outros',
            ...getColumnSearchProps('outros', 'Detalhes'), // Filtro reativado
            render: (text: string) => (
                <Tooltip title={text}>
                    <div style={{ fontSize: '11px', color: '#666', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {text}
                    </div>
                </Tooltip>
            )
        },
    ];

    return (
        <Card 
            title={
                <Space>
                    <HistoryOutlined /> 
                    <span>AUDITORIA DE ACESSOS</span>
                    <Badge count={dados.length} overflowCount={9999} showZero color="#108ee9" style={{ marginLeft: '10px' }} />
                </Space>
            }
            extra={
                <Space size="middle">
                    <RangePicker 
                        format="DD/MM/YYYY"
                        value={periodo}
                        onChange={(dates) => setPeriodo(dates)}
                        style={{ width: '280px' }}
                    />
                    <Button type="primary" icon={<ReloadOutlined />} onClick={carregarAuditoria} loading={loading}>
                        Filtrar Período
                    </Button>
                </Space>
            }
            style={{ margin: '10px', boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }}
        >
            <Table 
                dataSource={dados} 
                columns={columns} 
                rowKey="id" 
                loading={loading}
                size="small"
                bordered
                pagination={{ 
                    pageSize: 20, 
                    showTotal: (total) => `Total: ${total} registros`
                }}
            />
        </Card>
    );
}