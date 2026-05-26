import { Spin, Table, TableColumnsType, Typography } from "antd";
import { useContext, useEffect, useState } from "react";

import DashBoardVendedoresService from "../../../../service/DashBoardVendedores";
import { UsuarioContext } from "../../../../context/useContext";

import { formatarSemDecimaisEmilhares } from "../../../../utils/formatarValores";
import TabelaAnaliseNpProdutosAdminComponentDashboard from "../../tabelaAnaliseNp/adm/TabelaAnaliseNpProdutosAdminComponentDashboard";
import { FileTextOutlined } from "@ant-design/icons";

const serviceDashBoardVendedor = new DashBoardVendedoresService();

interface DataTypeClientes {
    key: string;
    acumulado: number;
    np: number;
}

export default function DashboardVendedoresClientesNps(props: any) {
    const [loading, setLoading] = useState(false);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { icomp, setIcomp } = useContext(UsuarioContext);
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);

    const [dadosClientes, setDadosClientes] = useState<DataTypeClientes[]>([]);
    const [quant, setQuant] = useState(0);

    useEffect(() => {
        buscaListaVendasDetalhe();
    }, [props]);

    async function buscaListaVendasDetalhe() {
        setLoading(true);
        try {
            let rsClientes = await serviceDashBoardVendedor.listaDadosVendedorClientesNps(icomp, props.codigo, props.vendedor);
            setDadosClientes(rsClientes.data.lista_nps_cliente);
            setQuant(rsClientes.data.lista_nps_cliente.length);
        } catch (error) {
            console.error('Erro ao buscar dados um dia:', error);
        } finally {
            setLoading(false);
        }
    }

    const columnsClientes: TableColumnsType<DataTypeClientes> = [
        {
            title: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileTextOutlined style={{ fontSize: '0.85rem', opacity: 0.85 }} />
                    NP
                </span>
            ),
            dataIndex: "np",
            key: "np",
            align: "left",
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
                <span style={{ fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em' }}>
                    TOTAL (R$)
                </span>
            ),
            dataIndex: "acumulado",
            key: "acumulado",
            align: "right",
            width: 140,
            render: (_: string, record: any) => (
                <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#7f1d1d',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.02em',
                }}>
                    {record.acumulado > 0 ? formatarSemDecimaisEmilhares(record.acumulado) : '0'}
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

    const expandedRowRender = (record: DataTypeClientes) => {
        return (
            <div style={{
                background: '#fffaf9',
                borderRadius: 8,
                padding: '10px 8px',
                border: '1px solid #fde8e8',
                marginBlock: 4,
            }}>
                <TabelaAnaliseNpProdutosAdminComponentDashboard np={record.np} />
            </div>
        );
    };

    return (
        <>
            <style>{`
                .nps-cliente-table .ant-table-thead > tr > th {
                    padding: 10px 12px;
                }
                .nps-cliente-table .ant-table-tbody > tr > td {
                    padding: 8px 12px;
                    border-bottom: 1px solid #fdf0f0;
                    transition: background 0.15s;
                }
                .nps-cliente-table .ant-table-tbody > tr:hover > td {
                    background: #fff5f5 !important;
                }
                .nps-cliente-table .ant-table-tbody > tr:last-child > td {
                    border-bottom: none;
                }
                .nps-cliente-table .ant-table-title {
                    padding: 10px 12px 8px;
                    background: #fafafa;
                    border-bottom: 1px solid #f0e8e8;
                    border-radius: 10px 10px 0 0;
                }
                .nps-cliente-table .ant-pagination {
                    padding: 10px 14px;
                    margin: 0 !important;
                    background: #fafafa;
                    border-top: 1px solid #f0e8e8;
                    border-radius: 0 0 10px 10px;
                }
                .nps-cliente-table .ant-table-container {
                    border-radius: 10px;
                    overflow: hidden;
                    border: 1px solid #f3e6e6 !important;
                }
                .nps-cliente-table .ant-table-expand-icon-col,
                .nps-cliente-table .ant-table-row-expand-icon {
                    color: #B22222 !important;
                }
                .nps-cliente-table .ant-table-row-expand-icon:hover {
                    color: #9B1C1C !important;
                    border-color: #9B1C1C !important;
                }
            `}</style>

            <Spin
                spinning={loading}
                tip="Carregando NPs..."
            >
                <div style={{ padding: '4px 0' }}>
                    <Table
                        className="nps-cliente-table"
                        columns={columnsClientes}
                        dataSource={dadosClientes}
                        size="small"
                        rowKey={(record) => record.np}
                        bordered={false}
                        title={() => (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{
                                    display: 'inline-block',
                                    width: 4,
                                    height: 16,
                                    borderRadius: 4,
                                    backgroundColor: '#B22222',
                                }} />
                                <Typography.Text strong style={{
                                    fontSize: '0.88rem',
                                    color: '#1a1a2e',
                                    letterSpacing: '0.04em',
                                }}>
                                    NPs do Cliente
                                </Typography.Text>
                                <span style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.04em',
                                    backgroundColor: 'rgba(178,34,34,0.08)',
                                    border: '1px solid rgba(178,34,34,0.2)',
                                    color: '#B22222',
                                    padding: '1px 8px',
                                    borderRadius: '20px',
                                }}>
                                    Total: {quant}
                                </span>
                            </div>
                        )}
                        expandable={{
                            expandedRowRender,
                            defaultExpandedRowKeys: [],
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