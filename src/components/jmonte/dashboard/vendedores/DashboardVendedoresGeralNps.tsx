import { Spin, Table, TableColumnsType, Typography } from "antd";
import { useContext, useEffect, useState, useCallback } from "react";

import DashBoardVendedoresService from "../../../../service/DashBoardVendedores";
import { UsuarioContext } from "../../../../context/useContext";
import { formatarSemDecimaisEmilhares } from "../../../../utils/formatarValores";
import TabelaAnaliseNpProdutosAdminComponentDashboard from "../../tabelaAnaliseNp/adm/TabelaAnaliseNpProdutosAdminComponentDashboard";
import { FileTextOutlined, UserOutlined } from "@ant-design/icons";

const serviceDashBoardVendedor = new DashBoardVendedoresService();

interface DataTypeClientes {
    key: string;
    acumulado: number;
    np: number;
    cliente: string;
}

export default function DashboardVendedoresGeralNps(props: any) {
    const [loading, setLoading] = useState(false);
    const { icomp, codigoUsuario } = useContext(UsuarioContext);

    const [dadosClientes, setDadosClientes] = useState<DataTypeClientes[]>([]);
    const [quant, setQuant] = useState(0);
    const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([]);

    const buscaListaVendasDetalhe = useCallback(async () => {
        setDadosClientes([]);
        setQuant(0);
        setExpandedRowKeys([]);
        setLoading(true);

        try {
            const rsClientes = await serviceDashBoardVendedor.listaDadosVendedorGeralNps(
                icomp,
                props.periodo,
                codigoUsuario
            );

            if (rsClientes?.data?.lista_nps_cliente) {
                setDadosClientes(rsClientes.data.lista_nps_cliente);
                setQuant(rsClientes.data.lista_nps_cliente.length);
            }
        } catch (error) {
            console.error('Erro ao buscar detalhe de vendas:', error);
        } finally {
            setLoading(false);
        }
    }, [icomp, props.periodo, codigoUsuario]);

    useEffect(() => {
        buscaListaVendasDetalhe();
        return () => {
            setDadosClientes([]);
            setQuant(0);
            setExpandedRowKeys([]);
        };
    }, [buscaListaVendasDetalhe]);

    const headerStyle = {
        background: 'linear-gradient(135deg, #9B1C1C 0%, #B22222 60%, #C0392B 100%)',
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: '0.75rem',
        letterSpacing: '0.08em',
        borderBottom: '2px solid rgba(255,255,255,0.15)',
    };

    const columnsClientes: TableColumnsType<DataTypeClientes> = [
        {
            title: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <FileTextOutlined style={{ fontSize: '0.8rem', opacity: 0.85 }} />
                    NP
                </span>
            ),
            dataIndex: "np",
            key: "np",
            align: "left",
            width: 100,
            render: (text: string) => (
                <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#1a1a2e',
                    letterSpacing: '0.02em',
                }}>
                    {text}
                </span>
            ),
            onHeaderCell: () => ({ style: headerStyle }),
        },
        {
            title: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <UserOutlined style={{ fontSize: '0.8rem', opacity: 0.85 }} />
                    CLIENTE
                </span>
            ),
            dataIndex: "cliente",
            key: "cliente",
            align: "left",
            render: (text: string) => (
                <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    color: '#1a1a2e',
                    letterSpacing: '0.01em',
                }}>
                    {text}
                </span>
            ),
            onHeaderCell: () => ({ style: headerStyle }),
        },
        {
            title: (
                <span style={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.06em' }}>
                    TOTAL (R$)
                </span>
            ),
            dataIndex: "acumulado",
            key: "acumulado",
            align: "right",
            width: 130,
            render: (value: number) => (
                <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
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

    const onExpand = (expanded: boolean, record: DataTypeClientes) => {
        setExpandedRowKeys(expanded ? [record.np] : []);
    };

    const expandedRowRender = (record: DataTypeClientes) => (
        <div style={{
            margin: '-10px -10px',
            padding: '10px',
            background: '#fffaf9',
            borderRadius: '6px',
            border: '1px solid #fde8e8',
        }}>
            <TabelaAnaliseNpProdutosAdminComponentDashboard np={String(record.np).trim()} />
        </div>
    );

    return (
        <>
            <style>{`
                .geral-nps-table .ant-table-thead > tr > th {
                    padding: 9px 12px;
                }
                .geral-nps-table .ant-table-tbody > tr > td {
                    padding: 8px 12px;
                    border-bottom: 1px solid #fdf0f0;
                    transition: background 0.15s;
                }
                .geral-nps-table .ant-table-tbody > tr:hover > td {
                    background: #fff5f5 !important;
                }
                .geral-nps-table .ant-table-tbody > tr:last-child > td {
                    border-bottom: none;
                }
                .geral-nps-table .ant-table-title {
                    padding: 9px 12px 7px;
                    background: #fafafa;
                    border-bottom: 1px solid #f0e8e8;
                    border-radius: 10px 10px 0 0;
                }
                .geral-nps-table .ant-pagination {
                    padding: 10px 14px;
                    margin: 0 !important;
                    background: #fafafa;
                    border-top: 1px solid #f0e8e8;
                    border-radius: 0 0 10px 10px;
                }
                .geral-nps-table .ant-table-container {
                    border-radius: 10px;
                    overflow: hidden;
                    border: 1px solid #f3e6e6 !important;
                }
                .geral-nps-table .ant-table-row-expand-icon {
                    color: #B22222 !important;
                    border-color: #B22222 !important;
                }
                .geral-nps-table .ant-table-row-expand-icon:hover {
                    color: #9B1C1C !important;
                    border-color: #9B1C1C !important;
                }
            `}</style>

            <div style={{ position: 'relative', minHeight: '200px' }}>
                <Spin spinning={loading} tip="Carregando NPs...">
                    <Table
                        className="geral-nps-table"
                        columns={columnsClientes}
                        dataSource={dadosClientes}
                        rowKey={(record) => record.np}
                        size="small"
                        bordered={false}
                        style={{ width: '100%' }}
                        expandable={{
                            expandedRowRender,
                            expandedRowKeys,
                            onExpand,
                            showExpandColumn: true,
                            rowExpandable: (record) => !!record.np,
                            columnWidth: 30,
                        }}
                        title={() => (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{
                                    display: 'inline-block',
                                    width: 3,
                                    height: 16,
                                    borderRadius: 4,
                                    backgroundColor: '#B22222',
                                }} />
                                <Typography.Text strong style={{
                                    fontSize: '0.88rem',
                                    color: '#1a1a2e',
                                    letterSpacing: '0.04em',
                                }}>
                                    NPs do Período
                                </Typography.Text>
                                <span style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 600,
                                    backgroundColor: 'rgba(178,34,34,0.08)',
                                    border: '1px solid rgba(178,34,34,0.2)',
                                    color: '#B22222',
                                    padding: '1px 8px',
                                    borderRadius: '20px',
                                    letterSpacing: '0.03em',
                                }}>
                                    Total: {quant}
                                </span>
                            </div>
                        )}
                        pagination={{
                            defaultPageSize: 5,
                            pageSizeOptions: ['5', '10', '20'],
                            showSizeChanger: true,
                            size: 'small',
                        }}
                    />
                </Spin>
            </div>
        </>
    );
}