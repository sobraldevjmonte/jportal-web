import { Card, Skeleton, Table, TableColumnsType, Typography } from "antd";
import { useContext, useEffect, useState } from "react";

import { UsuarioContext } from "../../../../context/useContext";
import DashBoardVendedoresService from "../../../../service/DashBoardVendedores";
import { formatarSemDecimaisEmilhares } from "../../../../utils/formatarValores";

const serviceDashBoardVendedor = new DashBoardVendedoresService();

interface DataTypeClientes {
    key: string;
    cod_vendedor_pre: string;
    nome: string;
    umDia: number;
    semanaAnterior: number;
    mesAnterior: number;
    centoOitentaDias: number;
}

export default function DashboardGeralVendedorDetalhesGerenteComponent(props: any) {
    const [loading, setLoading] = useState(false);
    const { icomp } = useContext(UsuarioContext);

    const [dadosClientes, setDadosClientes] = useState<DataTypeClientes[]>([]);
    const [codClienteAtual, setCodClienteAtual] = useState<string | null>(null);

    useEffect(() => {
        buscaListaVendasDetalhe();
    }, [props]);

    async function buscaListaVendasDetalhe() {
        setLoading(true);
        try {
            let rsClientes = await serviceDashBoardVendedor.listarDashBoardGerenteVendedoresListaDetalhes(icomp, props.codigo);
            const lista = rsClientes.data.lista_detalhes_vendedores || [];
            setDadosClientes(lista);
            if (lista.length > 0) {
                setCodClienteAtual(lista[0].cliente);
            }
        } catch (error) {
            console.error('Erro ao buscar dados detalhes vendedor:', error);
        } finally {
            setLoading(false);
        }
    }

    const headerCellStyle = {
        background: 'linear-gradient(135deg, #9B1C1C 0%, #B22222 60%, #C0392B 100%)',
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: '0.78rem',
        letterSpacing: '0.08em',
        borderBottom: '2px solid rgba(255,255,255,0.15)',
    };

    const columnsClientes: TableColumnsType<DataTypeClientes> = [
        {
            title: "DIA ANT.",
            dataIndex: "umDia",
            key: "umDia",
            align: "right",
            render: (_: any, record: any) => (
                <span style={{
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    color: record.umDia > 0 ? '#7f1d1d' : '#bbb',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.02em',
                }}>
                    {record.umDia > 0 ? formatarSemDecimaisEmilhares(record.umDia) : '—'}
                </span>
            ),
            onHeaderCell: () => ({ style: headerCellStyle }),
        },
        {
            title: "SEMANA ANT.",
            dataIndex: "semanaAnterior",
            key: "semanaAnterior",
            align: "right",
            render: (_: any, record: any) => (
                <span style={{
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    color: record.semanaAnterior > 0 ? '#7f1d1d' : '#bbb',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.02em',
                }}>
                    {record.semanaAnterior > 0 ? formatarSemDecimaisEmilhares(record.semanaAnterior) : '—'}
                </span>
            ),
            onHeaderCell: () => ({ style: headerCellStyle }),
        },
        {
            title: "MÊS ANT.",
            dataIndex: "mesAnterior",
            key: "mesAnterior",
            align: "right",
            render: (_: any, record: any) => (
                <span style={{
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    color: record.mesAnterior > 0 ? '#7f1d1d' : '#bbb',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.02em',
                }}>
                    {record.mesAnterior > 0 ? formatarSemDecimaisEmilhares(record.mesAnterior) : '—'}
                </span>
            ),
            onHeaderCell: () => ({ style: headerCellStyle }),
        },
        {
            title: "180 DIAS",
            dataIndex: "centoOitentaDias",
            key: "centoOitentaDias",
            align: "right",
            render: (_: any, record: any) => (
                <span style={{
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    color: record.centoOitentaDias > 0 ? '#7f1d1d' : '#bbb',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.02em',
                }}>
                    {record.centoOitentaDias > 0 ? formatarSemDecimaisEmilhares(record.centoOitentaDias) : '—'}
                </span>
            ),
            onHeaderCell: () => ({ style: headerCellStyle }),
        },
    ];

    return (
        <>
            <style>{`
                .dashboard-detalhes-vendedor-card .ant-card-head {
                    border-bottom: 1px solid #f0e8e8;
                    padding: 14px 18px 10px;
                    min-height: unset;
                    background: #fff;
                    border-radius: 14px 14px 0 0;
                }
                .dashboard-detalhes-vendedor-card .ant-card-body {
                    padding: 0;
                }
                .dashboard-detalhes-vendedor-card .ant-table-thead > tr > th {
                    padding: 10px 12px;
                }
                .dashboard-detalhes-vendedor-card .ant-table-tbody > tr > td {
                    padding: 8px 12px;
                    border-bottom: 1px solid #fdf0f0;
                    transition: background 0.15s;
                }
                .dashboard-detalhes-vendedor-card .ant-table-tbody > tr:hover > td {
                    background: #fff5f5 !important;
                }
                .dashboard-detalhes-vendedor-card .ant-table-tbody > tr:last-child > td {
                    border-bottom: none;
                }
                .dashboard-detalhes-vendedor-card .ant-pagination {
                    padding: 10px 14px;
                    margin: 0 !important;
                    background: #fafafa;
                    border-top: 1px solid #f0e8e8;
                    border-radius: 0 0 14px 14px;
                }
                .dashboard-detalhes-vendedor-card .ant-table-container {
                    border: none !important;
                }
            `}</style>

            <Card
                className="dashboard-detalhes-vendedor-card"
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
                            Detalhes de Vendas
                        </Typography.Text>
                        {codClienteAtual && (
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
                                    Cód.: {codClienteAtual}
                                </Typography.Text>
                            </div>
                        )}
                    </div>
                }
            >
                <Skeleton active loading={loading} style={{ padding: '16px' }}>
                    <Table
                        columns={columnsClientes}
                        dataSource={dadosClientes}
                        size="small"
                        rowKey={(record) => record.cod_vendedor_pre || record.nome}
                        bordered={false}
                        pagination={{
                            defaultPageSize: 5,
                            pageSizeOptions: ['5', '10', '20'],
                            size: 'small',
                            showSizeChanger: true,
                        }}
                    />
                </Skeleton>
            </Card>
        </>
    );
}