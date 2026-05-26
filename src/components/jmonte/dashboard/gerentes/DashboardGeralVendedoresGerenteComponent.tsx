import { UsuarioContext } from "../../../../context/useContext";
import { Button, Card, Modal, Skeleton, Table, TableColumnsType, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import DashBoardVendedoresService from "../../../../service/DashBoardVendedores";

import DashboardGeralVendedorDetalhesGerenteComponent from "./DashboardGeralVendedorDetalhesGerenteComponent";

import { formatarSemDecimaisEmilhares } from "../../../../utils/formatarValores";
import { ReloadOutlined, ShopOutlined } from "@ant-design/icons";

const serviceDashBoardVendedor = new DashBoardVendedoresService();

interface DataTypeClientes {
    key: string;
    cod_vendedor_pre: string;
    nome: string;
    acumulado: number;
}

export default function DashboardGeralVendedoresGerenteComponent(props: any) {
    const [loading, setLoading] = useState(false);
    const { icomp } = useContext(UsuarioContext);

    const [dadosVendedores, setDadosVendedores] = useState<DataTypeClientes[]>([]);
    const [totalGeralValor, setTotalGeralValor] = useState(0);

    useEffect(() => {
        buscaDados();
    }, []);

    async function buscaDados() {
        try {
            setLoading(true);
            let rsClientes = await serviceDashBoardVendedor.listarDashBoardGerenteVendedoresLista(icomp);

            const lista = rsClientes.data.lista_vendedores_desc || [];
            setDadosVendedores(lista);

            const soma = lista.reduce((acc: number, curr: DataTypeClientes) => acc + (Number(curr.acumulado) || 0), 0);
            setTotalGeralValor(soma);
        } catch (error) {
            console.error('Erro ao buscar dados vendedores gerente:', error);
        } finally {
            setLoading(false);
        }
    }

    const columnsClientes: TableColumnsType<DataTypeClientes> = [
        {
            title: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ShopOutlined style={{ fontSize: '0.9rem', opacity: 0.85 }} />
                        VENDEDOR
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
                        Total: {dadosVendedores.length}
                    </span>
                </div>
            ),
            dataIndex: "nome",
            key: "nome",
            align: "left",
            render: (_: any, record: any) => (
                <Button
                    type="link"
                    onClick={() => showModal(record)}
                    className="vendedor-gerente-btn"
                    style={{
                        color: '#1a1a2e',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        letterSpacing: '0.02em',
                        padding: '0 4px',
                        height: 'auto',
                    }}
                >
                    {record.nome}
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
            dataIndex: "acumulado",
            key: "acumulado",
            align: "right",
            width: 130,
            render: (value: number) => (
                <span style={{
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    color: value > 0 ? '#7f1d1d' : '#bbb',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.02em',
                }}>
                    {value > 0 ? formatarSemDecimaisEmilhares(value) : '—'}
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
                    textAlign: 'right' as const,
                },
            }),
        },
    ];

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);

    const showModal = (record: any) => {
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
                .dashboard-vendedores-gerente-card .ant-card-head {
                    border-bottom: 1px solid #f0e8e8;
                    padding: 14px 18px 10px;
                    min-height: unset;
                    background: #fff;
                    border-radius: 14px 14px 0 0;
                }
                .dashboard-vendedores-gerente-card .ant-card-body {
                    padding: 0;
                }
                .dashboard-vendedores-gerente-card .ant-table-thead > tr > th {
                    padding: 10px 12px;
                }
                .dashboard-vendedores-gerente-card .ant-table-tbody > tr > td {
                    padding: 8px 12px;
                    border-bottom: 1px solid #fdf0f0;
                    transition: background 0.15s;
                }
                .dashboard-vendedores-gerente-card .ant-table-tbody > tr:hover > td {
                    background: #fff5f5 !important;
                }
                .dashboard-vendedores-gerente-card .ant-table-tbody > tr:last-child > td {
                    border-bottom: none;
                }
                .dashboard-vendedores-gerente-card .ant-pagination {
                    padding: 10px 14px;
                    margin: 0 !important;
                    background: #fafafa;
                    border-top: 1px solid #f0e8e8;
                    border-radius: 0 0 14px 14px;
                }
                .dashboard-vendedores-gerente-card .ant-table-container {
                    border: none !important;
                }
                .vendedor-gerente-btn:hover {
                    color: #B22222 !important;
                }
                .reload-btn-vendedores-gerente {
                    transition: transform 0.3s, box-shadow 0.2s !important;
                }
                .reload-btn-vendedores-gerente:hover {
                    transform: rotate(90deg) scale(1.08) !important;
                    box-shadow: 0 4px 12px rgba(46,125,50,0.4) !important;
                }
            `}</style>

            <div style={{ maxWidth: '520px', paddingBottom: '10px' }}>
                <Card
                    className="dashboard-vendedores-gerente-card"
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
                                Pendências por Vendedor
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
                            className="reload-btn-vendedores-gerente"
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
                            dataSource={dadosVendedores}
                            size="small"
                            rowKey={(record) => record.cod_vendedor_pre}
                            bordered={false}
                            pagination={{
                                defaultPageSize: 5,
                                pageSizeOptions: ['5', '10', '20'],
                                size: 'small',
                                showSizeChanger: true,
                            }}
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
                                        {clienteSelecionado?.nome || ""}
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
                                <DashboardGeralVendedorDetalhesGerenteComponent
                                    codigo={clienteSelecionado.cod_vendedor_pre}
                                    nome={clienteSelecionado.nome}
                                />
                            )}
                        </Modal>
                    </Skeleton>
                </Card>
            </div>
        </>
    );
}