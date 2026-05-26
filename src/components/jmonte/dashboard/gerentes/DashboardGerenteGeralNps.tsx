import { Spin, Table, TableColumnsType, Typography } from "antd";
import { useContext, useEffect, useState } from "react";

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

export default function DashboardGerenteGeralNps(props: any) {
    const [loading, setLoading] = useState(false);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { icomp, setIcomp } = useContext(UsuarioContext);
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);

    const [dadosClientes, setDadosClientes] = useState<DataTypeClientes[]>([]);
    const [quant, setQuant] = useState(0);
    const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([]);

    useEffect(() => {
        buscaListaVendasDetalhe();
    }, [props]);

    async function buscaListaVendasDetalhe() {
        setLoading(true);
        setDadosClientes([]);
        setQuant(0);
        setExpandedRowKeys([]);
        try {
            let rsClientes = await serviceDashBoardVendedor.listaDadosGerenteGeralNps(icomp, props.periodo);
            setDadosClientes(rsClientes.data.lista_nps_cliente);
            setQuant(rsClientes.data.lista_nps_cliente.length);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    }

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
            render: (_: string, record: any) => (
                <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#1a1a2e',
                    letterSpacing: '0.02em',
                }}>
                    {record.np}
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
            render: (_: string, record: any) => (
                <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    color: '#1a1a2e',
                    letterSpacing: '0.01em',
                }}>
                    {record.cliente}
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
            render: (_: string, record: any) => (
                <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: record.acumulado > 0 ? '#7f1d1d' : '#bbb',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.02em',
                }}>
                    {record.acumulado > 0 ? formatarSemDecimaisEmilhares(record.acumulado) : '—'}
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
            <TabelaAnaliseNpProdutosAdminComponentDashboard np={record.np} />
        </div>
    );

    return (
        <>
            <style>{`
                .gerente-nps-table .ant-table-thead > tr > th {
                    padding: 9px 12px;
                }
                .gerente-nps-table .ant-table-tbody > tr > td {
                    padding: 8px 12px;
                    border-bottom: 1px solid #fdf0f0;
                    transition: background 0.15s;
                }
                .gerente-nps-table .ant-table-tbody > tr:hover > td {
                    background: #fff5f5 !important;
                }
                .gerente-nps-table .ant-table-tbody > tr:last-child > td {
                    border-bottom: none;
                }
                .gerente-nps-table .ant-table-title {
                    padding: 9px 12px 7px;
                    background: #fafafa;
                    border-bottom: 1px solid #f0e8e8;
                    border-radius: 10px 10px 0 0;
                }
                .gerente-nps-table .ant-pagination {
                    padding: 10px 14px;
                    margin: 0 !important;
                    background: #fafafa;
                    border-top: 1px solid #f0e8e8;
                    border-radius: 0 0 10px 10px;
                }
                .gerente-nps-table .ant-table-container {
                    border-radius: 10px;
                    overflow: hidden;
                    border: 1px solid #f3e6e6 !important;
                }
                .gerente-nps-table .ant-table-row-expand-icon {
                    color: #B22222 !important;
                    border-color: #B22222 !important;
                }
                .gerente-nps-table .ant-table-row-expand-icon:hover {
                    color: #9B1C1C !important;
                    border-color: #9B1C1C !important;
                }
            `}</style>

            <Spin spinning={loading} tip="Carregando NPs...">
                <div style={{ padding: '4px 0' }}>
                    <Table
                        className="gerente-nps-table"
                        columns={columnsClientes}
                        dataSource={dadosClientes}
                        size="small"
                        rowKey={(record) => record.np}
                        bordered={false}
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
                        expandable={{
                            expandedRowRender,
                            expandedRowKeys,
                            onExpand,
                            defaultExpandedRowKeys: [],
                            rowExpandable: (record) => !!record.np,
                            columnWidth: 30,
                        }}
                        pagination={{
                            defaultPageSize: 5,
                            pageSizeOptions: ['5', '10', '20'],
                            size: 'small',
                            showSizeChanger: true,
                        }}
                    />
                </div>
            </Spin>
        </>
    );
}