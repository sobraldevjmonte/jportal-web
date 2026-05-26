import { UsuarioContext } from "../../../../context/useContext";
import { Button, Card, Modal, Skeleton, Table, TableColumnsType, Typography, Badge } from "antd";
import { useContext, useEffect, useState } from "react";
import DashBoardVendedoresService from "../../../../service/DashBoardVendedores";

import DashboardDetalhesVendedores from "./DashboardDetalhesVendedoresClientes";
import { formatarSemDecimaisEmilhares } from "../../../../utils/formatarValores";
import { ReloadOutlined, TeamOutlined } from "@ant-design/icons";

const serviceDashBoardVendedor = new DashBoardVendedoresService();

interface DataTypeClientes {
    key: string;
    cod_cliente_pre: string;
    cliente: string;
    valortotal: number;
}

export default function DashboardGeralClienteComponent(props: any) {
    const [loading, setLoading] = useState(false);
    const { codigoUsuario } = useContext(UsuarioContext);
    const [totalGeralValor, setTotalGeralValor] = useState(0);
    const [dadosClientes, setDadosClientes] = useState<DataTypeClientes[]>([]);

    useEffect(() => {
        buscaDados();
    }, []);

    async function buscaDados() {
        try {
            setLoading(true);
            let rsClientes = await serviceDashBoardVendedor.listarDashBoardVendedorClienteLista(codigoUsuario);
            const lista = rsClientes.data.lista_clientes_desc || [];
            setDadosClientes(lista);
            const soma = lista.reduce((acc: number, curr: DataTypeClientes) => acc + (Number(curr.valortotal) || 0), 0);
            setTotalGeralValor(soma);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    }

    const columnsClientes: TableColumnsType<DataTypeClientes> = [
        {
            title: (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <TeamOutlined style={{ fontSize: '0.9rem', opacity: 0.85 }} />
                        CLIENTE
                    </span>
                    <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        backgroundColor: 'rgba(255,255,255,0.18)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        padding: '2px 9px',
                        borderRadius: '20px',
                        color: '#fff',
                    }}>
                        Total: {dadosClientes.length}
                    </span>
                </div>
            ),
            dataIndex: "cliente",
            key: "cliente",
            align: "left",
            render: (text: any, record: DataTypeClientes) => (
                <Button
                    type="link"
                    onClick={() => showModal(record)}
                    style={{
                        color: '#1a1a2e',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        letterSpacing: '0.02em',
                        padding: '0 4px',
                        height: 'auto',
                        transition: 'color 0.2s',
                    }}
                    className="cliente-btn"
                >
                    {record.cliente}
                </Button>
            ),
            onHeaderCell: () => ({
                style: {
                    background: 'linear-gradient(135deg, #9B1C1C 0%, #B22222 60%, #C0392B 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    letterSpacing: '0.08em',
                    borderBottom: '2px solid rgba(255,255,255,0.15)',
                },
            }),
        },
        {
            title: (
                <span style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.03em' }}>
                    {formatarSemDecimaisEmilhares(totalGeralValor)}
                </span>
            ),
            dataIndex: "valortotal",
            key: "valortotal",
            align: "right",
            width: 130,
            render: (value: number) => (
                <span style={{
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    color: '#7f1d1d',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.02em',
                }}>
                    {formatarSemDecimaisEmilhares(value)}
                </span>
            ),
            onHeaderCell: () => ({
                style: {
                    background: 'linear-gradient(135deg, #9B1C1C 0%, #B22222 60%, #C0392B 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    letterSpacing: '0.06em',
                    borderBottom: '2px solid rgba(255,255,255,0.15)',
                },
            }),
        },
    ];

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [clienteSelecionado, setClienteSelecionado] = useState<DataTypeClientes | null>(null);

    const showModal = (record: DataTypeClientes) => {
        setClienteSelecionado(record);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setClienteSelecionado(null);
        setIsModalVisible(false);
    };

    return (
        <>
            <style>{`
                .dashboard-cliente-card .ant-card-head {
                    border-bottom: 1px solid #f0e8e8;
                    padding: 14px 18px 10px;
                    min-height: unset;
                    background: #fff;
                    border-radius: 14px 14px 0 0;
                }
                .dashboard-cliente-card .ant-card-body {
                    padding: 0;
                }
                .dashboard-cliente-card .ant-table-thead > tr > th {
                    padding: 10px 12px;
                }
                .dashboard-cliente-card .ant-table-tbody > tr > td {
                    padding: 8px 12px;
                    border-bottom: 1px solid #fdf0f0;
                    transition: background 0.15s;
                }
                .dashboard-cliente-card .ant-table-tbody > tr:hover > td {
                    background: #fff5f5 !important;
                }
                .dashboard-cliente-card .ant-table-tbody > tr:last-child > td {
                    border-bottom: none;
                }
                .dashboard-cliente-card .ant-pagination {
                    padding: 10px 14px;
                    margin: 0 !important;
                    background: #fafafa;
                    border-top: 1px solid #f0e8e8;
                    border-radius: 0 0 14px 14px;
                }
                .dashboard-cliente-card .ant-table-bordered .ant-table-container {
                    border: none !important;
                }
                .dashboard-cliente-card .ant-table-bordered .ant-table-cell {
                    border-inline-end: none !important;
                }
                .cliente-btn:hover {
                    color: #B22222 !important;
                }
                .reload-btn-cliente {
                    transition: transform 0.3s, box-shadow 0.2s !important;
                }
                .reload-btn-cliente:hover {
                    transform: rotate(90deg) scale(1.08) !important;
                    box-shadow: 0 4px 12px rgba(76,175,80,0.4) !important;
                }
            `}</style>

            <div style={{ maxWidth: '520px', paddingBottom: '10px' }}>
                <Card
                    className="dashboard-cliente-card"
                    style={{
                        backgroundColor: '#FFFFFF',
                        padding: '0px',
                        borderRadius: '14px',
                        border: '1px solid #f3e6e6',
                        boxShadow: '0 2px 8px rgba(178,34,34,0.08), 0 8px 24px rgba(0,0,0,0.07)',
                        overflow: 'hidden',
                    }}
                    title={
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography.Text strong style={{
                                fontSize: '0.95rem',
                                lineHeight: '1.3',
                                color: '#1a1a2e',
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                            }}>
                                Pendências por Cliente
                            </Typography.Text>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                <span style={{
                                    display: 'inline-block',
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    backgroundColor: '#B22222',
                                    opacity: 0.7,
                                }} />
                                <Typography.Text style={{
                                    fontSize: '0.73rem',
                                    color: '#999',
                                    fontWeight: 500,
                                    letterSpacing: '0.04em',
                                }}>
                                    Últimos 180 dias
                                </Typography.Text>
                            </div>
                        </div>
                    }
                    extra={
                        <Button
                            className="reload-btn-cliente"
                            type="primary"
                            icon={<ReloadOutlined style={{ fontSize: '0.9rem' }} />}
                            onClick={buscaDados}
                            loading={loading}
                            style={{
                                background: 'linear-gradient(135deg, #43A047, #2E7D32)',
                                borderColor: 'transparent',
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                boxShadow: '0 3px 8px rgba(46,125,50,0.35)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        />
                    }
                >
                    <Skeleton active loading={loading} style={{ padding: '16px' }}>
                        <Table
                            columns={columnsClientes}
                            dataSource={dadosClientes}
                            size="small"
                            rowKey={(record) => record.cod_cliente_pre}
                            bordered={false}
                            pagination={{
                                defaultPageSize: 5,
                                pageSizeOptions: ['5', '10', '20'],
                                size: 'small',
                                showSizeChanger: true,
                            }}
                            style={{ borderRadius: 0 }}
                        />

                        <Modal
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 4,
                                        height: 20,
                                        borderRadius: 4,
                                        backgroundColor: '#B22222',
                                        marginRight: 4,
                                    }} />
                                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1a2e' }}>
                                        {clienteSelecionado?.cliente || ""}
                                    </span>
                                </div>
                            }
                            open={isModalVisible}
                            onCancel={handleCancel}
                            footer={null}
                            width={800}
                            styles={{
                                header: { borderBottom: '1px solid #f3e6e6', paddingBottom: 12 },
                            }}
                        >
                            {clienteSelecionado && (
                                <DashboardDetalhesVendedores
                                    codigo={clienteSelecionado.cod_cliente_pre}
                                    nome={clienteSelecionado.cliente}
                                />
                            )}
                        </Modal>
                    </Skeleton>
                </Card>
            </div>
        </>
    );
}