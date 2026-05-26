import { Spin, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import AnaliseNpService from "../../../../service/AnaliseNpService";
import { formatarSemDecimaisEmilhares } from "../../../../utils/formatarValores";
import { ShoppingOutlined } from "@ant-design/icons";

const service = new AnaliseNpService();

export default function TabelaAnaliseNpProdutosDashboard(props: any) {
    const [dados, setDados] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const carregar = async () => {
            setLoading(true);
            try {
                const rs = await service.listarProdutosNp(props.np);
                const listaLimpa = (rs.data.lista_produtos_np || []).filter(
                    (item: any) => item !== null && item !== undefined
                );
                setDados(listaLimpa);
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
                setDados([]);
            } finally {
                setLoading(false);
            }
        };
        carregar();
    }, [props.np]);

    const headerStyle = {
        background: 'linear-gradient(135deg, #9B1C1C 0%, #B22222 60%, #C0392B 100%)',
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: '0.75rem',
        letterSpacing: '0.08em',
        borderBottom: '2px solid rgba(255,255,255,0.15)',
    };

    const columns = [
        {
            title: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <ShoppingOutlined style={{ fontSize: '0.8rem', opacity: 0.85 }} />
                    CÓD.
                </span>
            ),
            dataIndex: 'codproduto',
            key: 'codproduto',
            width: 80,
            render: (text: string) => (
                <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#1a1a2e',
                    letterSpacing: '0.02em',
                }}>
                    {text?.trim()}
                </span>
            ),
            onHeaderCell: () => ({ style: headerStyle }),
        },
        {
            title: 'PRODUTO',
            dataIndex: 'produto',
            key: 'produto',
            render: (text: string) => (
                <span style={{
                    fontSize: '0.78rem',
                    fontWeight: text === 'SEM INFORMAÇÃO' ? 400 : 500,
                    color: text === 'SEM INFORMAÇÃO' ? '#bbb' : '#1a1a2e',
                    fontStyle: text === 'SEM INFORMAÇÃO' ? 'italic' : 'normal',
                    letterSpacing: '0.01em',
                }}>
                    {text?.trim() || 'SEM INFORMAÇÃO'}
                </span>
            ),
            onHeaderCell: () => ({ style: headerStyle }),
        },
        {
            title: 'QTD.',
            dataIndex: 'quantidade',
            key: 'quantidade',
            width: 80,
            align: 'right' as const,
            render: (value: any) => (
                <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#7f1d1d',
                    fontVariantNumeric: 'tabular-nums',
                }}>
                    {value ? Number(value).toFixed(0) : '0'}
                </span>
            ),
            onHeaderCell: () => ({ style: { ...headerStyle, textAlign: 'right' as const } }),
        },
    ];

    return (
        <>
            <style>{`
                .np-produtos-table .ant-table-thead > tr > th {
                    padding: 8px 10px;
                }
                .np-produtos-table .ant-table-tbody > tr > td {
                    padding: 6px 10px;
                    border-bottom: 1px solid #fdf0f0;
                    transition: background 0.15s;
                }
                .np-produtos-table .ant-table-tbody > tr:hover > td {
                    background: #fff5f5 !important;
                }
                .np-produtos-table .ant-table-tbody > tr:last-child > td {
                    border-bottom: none;
                }
                .np-produtos-table .ant-table-title {
                    padding: 8px 10px 6px;
                    background: #fafafa;
                    border-bottom: 1px solid #f0e8e8;
                    border-radius: 8px 8px 0 0;
                }
                .np-produtos-table .ant-table-container {
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid #f3e6e6 !important;
                }
            `}</style>

            <div style={{
                padding: '6px 0px',
                borderRadius: '8px',
                width: '100%',
                minHeight: '80px',
                marginLeft: '-10px',
            }}>
                <Spin spinning={loading} tip="Carregando produtos...">
                    <Table
                        className="np-produtos-table"
                        columns={columns}
                        dataSource={dados}
                        size="small"
                        bordered={false}
                        pagination={false}
                        rowKey={(record, index) =>
                            record?.cod_produto_pre || (index?.toString() ?? Math.random().toString())
                        }
                        title={() => (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{
                                    display: 'inline-block',
                                    width: 3,
                                    height: 14,
                                    borderRadius: 4,
                                    backgroundColor: '#B22222',
                                }} />
                                <Typography.Text strong style={{
                                    fontSize: '0.82rem',
                                    color: '#1a1a2e',
                                    letterSpacing: '0.03em',
                                }}>
                                    Itens da NP {props.np}
                                </Typography.Text>
                                <span style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 600,
                                    backgroundColor: 'rgba(178,34,34,0.08)',
                                    border: '1px solid rgba(178,34,34,0.2)',
                                    color: '#B22222',
                                    padding: '1px 7px',
                                    borderRadius: '20px',
                                    letterSpacing: '0.03em',
                                }}>
                                    {dados.length - 1} {dados.length === 1 ? 'item' : 'itens'}
                                </span>
                            </div>
                        )}
                        style={{ width: '100%', margin: 0 }}
                    />
                </Spin>
            </div>
        </>
    );
}