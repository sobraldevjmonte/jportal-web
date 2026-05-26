import { Button, Card, Modal, Skeleton, Table, TableColumnsType, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../../../../context/useContext";
import DashBoardVendedoresService from "../../../../service/DashBoardVendedores";

import { formatarSemDecimaisEmilhares } from "../../../../utils/formatarValores";
import { ReloadOutlined, CalendarOutlined } from "@ant-design/icons";
import DashboardGerenteGeralNps from "./DashboardGerenteGeralNps";

const serviceDashBoardVendedor = new DashBoardVendedoresService();

interface DataType {
    key: string;
    periodo: string;
    acumulado: number;
    nps?: number;
}

export default function DashboardGeralGerenteComponent() {
    const [loading, setLoading] = useState(false);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { icomp, setIcomp } = useContext(UsuarioContext);
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);

    const [dadosHoje, setDadosHoje] = useState<number>(0);
    const [dadosUmDia, setDadosUmDia] = useState<number>(0);
    const [dadosSemana, setDadosSemana] = useState(0);
    const [dadosMesAnterior, setDadosMesAnterior] = useState(0);
    const [dadosSeisMeses, setDadosSeisMeses] = useState(0);

    const [registrosdadosHoje, setRegistrosDadosHoje] = useState<number>(0);
    const [registrosdadosUmDia, setRegistrosDadosUmDia] = useState<number>(0);
    const [registrosdadosUmaSemana, setRegistrosDadosUmaSemana] = useState<number>(0);
    const [registrosdadosMesAnterior, setRegistrosDadosMesAnterior] = useState<number>(0);
    const [registrosdadosSeisMeses, setRegistrosDadosSeisMeses] = useState<number>(0);

    const [totalGeralRegistros, setTotalGeralRegistros] = useState<number>(0);
    const [totalGeralValor, setTotalGeralValor] = useState<number>(0);

    useEffect(() => {
        buscaDados();
    }, []);

    async function buscaDados() {
        try {
            setLoading(true);
            const [
                rsHoje,
                rsUmDia,
                rsUmaSemana,
                rsMesAnterior,
                rsSeisMeses,
                rsCountRegistros,
                rsSomaValores,
            ] = await Promise.all([
                serviceDashBoardVendedor.listarDashBoardGerenteHoje(icomp),
                serviceDashBoardVendedor.listarDashBoardGerenteUmDia(icomp),
                serviceDashBoardVendedor.listarDashBoardGerenteSemanaAnterior(icomp),
                serviceDashBoardVendedor.listarDashBoardGerenteMesAnterior(icomp),
                serviceDashBoardVendedor.listarDashBoardGerenteSeisMeses(icomp),
                serviceDashBoardVendedor.somaGeralPedidosGerente(icomp),
                serviceDashBoardVendedor.somaGeralValoresGerente(icomp),
            ]);

            setTotalGeralRegistros(rsCountRegistros.data.soma_geral_pedidos);
            setTotalGeralValor(rsSomaValores.data.soma_geral_valores);

            setRegistrosDadosHoje(rsHoje.data.total_pedidos || 0);
            setRegistrosDadosUmDia(rsUmDia.data.total_pedidos || 0);
            setRegistrosDadosUmaSemana(rsUmaSemana.data.total_pedidos || 0);
            setRegistrosDadosMesAnterior(rsMesAnterior.data.total_pedidos || 0);
            setRegistrosDadosSeisMeses(rsSeisMeses.data.total_pedidos || 0);

            setDadosHoje(rsHoje.data.lista_um_hoje);
            setDadosUmDia(rsUmDia.data.acumuladoumdia);
            setDadosSemana(rsUmaSemana.data.acumuladosemananterior);
            setDadosMesAnterior(rsMesAnterior.data.acumuladomesanterior);
            setDadosSeisMeses(rsSeisMeses.data.acumuladoseismeses);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    }

    const dadosGeral: DataType[] = [
        { key: "1", periodo: "HOJE", acumulado: dadosHoje > 0 ? dadosHoje : 0, nps: registrosdadosHoje },
        { key: "2", periodo: "DIA ANT.", acumulado: dadosUmDia > 0 ? dadosUmDia : 0, nps: registrosdadosUmDia },
        { key: "3", periodo: "SEMANA ANT.", acumulado: dadosSemana > 0 ? dadosSemana : 0, nps: registrosdadosUmaSemana },
        { key: "4", periodo: "MÊS ANT.", acumulado: dadosMesAnterior > 0 ? dadosMesAnterior : 0, nps: registrosdadosMesAnterior },
        { key: "5", periodo: "180 DIAS", acumulado: dadosSeisMeses > 0 ? dadosSeisMeses : 0, nps: registrosdadosSeisMeses },
    ];

    const headerStyle = {
        background: 'linear-gradient(135deg, #9B1C1C 0%, #B22222 60%, #C0392B 100%)',
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: '0.78rem',
        letterSpacing: '0.08em',
        borderBottom: '2px solid rgba(255,255,255,0.15)',
    };

    const columnsGeral: TableColumnsType<DataType> = [
        {
            title: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CalendarOutlined style={{ fontSize: '0.9rem', opacity: 0.85 }} />
                    PERÍODO
                </span>
            ),
            dataIndex: "periodo",
            key: "periodo",
            align: "left",
            render: (value: string) => (
                <Button
                    type="link"
                    onClick={() => showModal(value)}
                    className="gerente-periodo-btn"
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
                    {value}
                </Button>
            ),
            onHeaderCell: () => ({ style: headerStyle }),
        },
        {
            title: (
                <span style={{ fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em' }}>
                    NPs({formatarSemDecimaisEmilhares(totalGeralRegistros)})
                </span>
            ),
            dataIndex: "nps",
            key: "nps",
            align: "right",
            width: 110,
            render: (value: number) => (
                <span style={{
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    color: value > 0 ? '#7f1d1d' : '#bbb',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.02em',
                }}>
                    {value > 0 ? formatarSemDecimaisEmilhares(value) : '—'}
                </span>
            ),
            onHeaderCell: () => ({ style: { ...headerStyle, textAlign: 'right' as const } }),
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
            onHeaderCell: () => ({ style: { ...headerStyle, textAlign: 'right' as const } }),
        },
    ];

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [periodoSelecionado, setPeriodoSelecionado] = useState<any>(null);

    const showModal = (periodo: any) => {
        setPeriodoSelecionado(periodo);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setPeriodoSelecionado(null);
        setIsModalVisible(false);
    };

    return (
        <>
            <style>{`
                .dashboard-gerente-card .ant-card-head {
                    border-bottom: 1px solid #f0e8e8;
                    padding: 14px 18px 10px;
                    min-height: unset;
                    background: #fff;
                    border-radius: 14px 14px 0 0;
                }
                .dashboard-gerente-card .ant-card-body {
                    padding: 0;
                }
                .dashboard-gerente-card .ant-table-thead > tr > th {
                    padding: 10px 12px;
                }
                .dashboard-gerente-card .ant-table-tbody > tr > td {
                    padding: 8px 12px;
                    border-bottom: 1px solid #fdf0f0;
                    transition: background 0.15s;
                }
                .dashboard-gerente-card .ant-table-tbody > tr:hover > td {
                    background: #fff5f5 !important;
                }
                .dashboard-gerente-card .ant-table-tbody > tr:last-child > td {
                    border-bottom: none;
                }
                .dashboard-gerente-card .ant-pagination {
                    padding: 10px 14px;
                    margin: 0 !important;
                    background: #fafafa;
                    border-top: 1px solid #f0e8e8;
                    border-radius: 0 0 14px 14px;
                }
                .dashboard-gerente-card .ant-table-container {
                    border: none !important;
                }
                .gerente-periodo-btn:hover {
                    color: #B22222 !important;
                }
                .reload-btn-gerente {
                    transition: transform 0.3s, box-shadow 0.2s !important;
                }
                .reload-btn-gerente:hover {
                    transform: rotate(90deg) scale(1.08) !important;
                    box-shadow: 0 4px 12px rgba(46,125,50,0.4) !important;
                }
            `}</style>

            <div style={{ maxWidth: '520px', paddingBottom: '10px' }}>
                <Card
                    className="dashboard-gerente-card"
                    bordered={false}
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
                                Pendências (Loja)
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
                            className="reload-btn-gerente"
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
                            columns={columnsGeral}
                            dataSource={dadosGeral}
                            size="small"
                            rowKey={(record) => record.key}
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
                                        Detalhes do Período: {periodoSelecionado || ""}
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
                            {periodoSelecionado && (
                                <DashboardGerenteGeralNps
                                    periodo={periodoSelecionado}
                                    nome={periodoSelecionado}
                                />
                            )}
                        </Modal>
                    </Skeleton>
                </Card>
            </div>
        </>
    );
}