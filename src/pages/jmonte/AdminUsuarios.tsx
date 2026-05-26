import { Table, Tag, Button, Space, Card, Modal, notification, Tooltip, Input } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { 
    LockOutlined, 
    UserDeleteOutlined, 
    UserAddOutlined, 
    ReloadOutlined, 
    SearchOutlined,
    UserOutlined 
} from '@ant-design/icons';
import LoginService from '../../service/LoginService';

const service = new LoginService();

export default function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const searchInput = useRef<any>(null);

    const carregarUsuarios = async () => {
        setLoading(true);
        try {
            const resp = await service.listarUsuarios();
            setUsuarios(resp || []);
        } catch (e) {
            notification.error({ message: "Erro ao carregar lista de usuários" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarUsuarios();
    }, []);

    // --- LÓGICA DE FILTRO "CONTÉM" (LIKE %valor%) ---
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
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Filtrar
                    </Button>
                    <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
                        Limpar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        // REGRA DE OURO: .includes() garante o comportamento de "CONTEÚDO"
        onFilter: (value: any, record: any) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible: boolean) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    // --- AÇÕES DO ADMIN ---
    const handleResetSenha = (record: any) => {
        Modal.confirm({
            title: `Resetar Senha`,
            content: `Confirmar reset da senha de ${record.nomeusuario}? A nova senha será "123".`,
            onOk: async () => {
                const res = await service.adminAlterarUsuario({
                    idUsuario: record.idusuario,
                    idLoja: record.idloja,
                    acao: 'RESET_SENHA'
                });
                if (res) {
                    notification.success({ message: "Senha resetada!" });
                    carregarUsuarios();
                }
            }
        });
    };

    const handleToggleStatus = async (record: any) => {
        const novoStatus = record.ativo === 'S' ? 'N' : 'S';
        await service.adminAlterarUsuario({
            idUsuario: record.idusuario,
            idLoja: record.idloja,
            acao: 'ALTERAR_STATUS',
            novoStatus
        });
        notification.info({ message: "Status alterado!" });
        carregarUsuarios();
    };

    const columns: any = [
        {
            title: 'NOME',
            dataIndex: 'nomeusuario',
            key: 'nomeusuario',
            ...getColumnSearchProps('nomeusuario', 'Nome'),
            sorter: (a: any, b: any) => a.nomeusuario.localeCompare(b.nomeusuario),
        },
        {
            title: 'CÓD. VENDEDOR',
            dataIndex: 'codigoVendedor',
            key: 'codigoVendedor',
            width: 150,
            ...getColumnSearchProps('codigoVendedor', 'Código'),
        },
        {
            title: 'LOJA',
            dataIndex: 'loja',
            key: 'loja',
            ...getColumnSearchProps('loja', 'Loja'), // Agora filtra "ken" em "Kennedy"
        },
        {
            title: 'SETOR',
            dataIndex: 'descricaoSetor',
            key: 'setor',
            ...getColumnSearchProps('setor', 'Setor'),
        },
        {
            title: 'STATUS',
            dataIndex: 'ativo',
            key: 'ativo',
            width: 120,
            align: 'center',
            filters: [
                { text: 'ATIVO', value: 'S' },
                { text: 'INATIVO', value: 'N' },
            ],
            onFilter: (value: any, record: any) => record.ativo === value,
            render: (ativo: string) => (
                <Tag color={ativo === 'S' ? 'green' : 'red'}>
                    {ativo === 'S' ? 'ATIVO' : 'INATIVO'}
                </Tag>
            )
        },
        {
            title: 'AÇÕES',
            key: 'acoes',
            width: 180,
            align: 'center',
            render: (_: any, record: any) => (
                <Space size="small">
                    <Tooltip title="Resetar Senha (123)">
                        <Button icon={<LockOutlined />} onClick={() => handleResetSenha(record)} />
                    </Tooltip>
                    <Button 
                        danger={record.ativo === 'S'}
                        icon={record.ativo === 'S' ? <UserDeleteOutlined /> : <UserAddOutlined />}
                        onClick={() => handleToggleStatus(record)}
                        style={{ width: '90px' }}
                    >
                        {record.ativo === 'S' ? 'Inativar' : 'Ativar'}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Card 
            title={<Space><UserOutlined /> GERENCIAMENTO DE USUÁRIOS</Space>}
            extra={<Button type="primary" icon={<ReloadOutlined />} onClick={carregarUsuarios} loading={loading}>Atualizar</Button>}
            style={{ margin: '10px', boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }}
        >
            <Table 
                dataSource={usuarios} 
                columns={columns} 
                rowKey="idusuario" 
                loading={loading}
                size="small"
                bordered
                pagination={{ 
                    pageSize: 15,
                    showTotal: (total) => `Total: ${total} usuários`
                }}
            />
        </Card>
    );
}