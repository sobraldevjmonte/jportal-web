import { Spin, Table, TableColumnsType, Typography } from "antd";
import { useContext, useEffect, useState } from "react";

import { formatarMoedaComSimbolo } from "../../../../utils/formatarValores";
import DashBoardVendedoresService from "../../../../service/DashBoardVendedores";
import { UsuarioContext } from "../../../../context/useContext";
import { ApartmentOutlined, BarChartOutlined } from "@ant-design/icons";

const serviceDashBoardVendedor = new DashBoardVendedoresService();

interface DataTypeClientes {
    key: string;
    cod_indica_pre: string;
    indicador: string;
    umDia: number;
    semanaAnterior: number;
    mesAnterior: number;
    centoOitentaDias: number;
}

export default function DashboardDetalhesIndicadores(props: any) {
    const [loading, setLoading] = useState(false);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { icomp, setIcomp } = useContext(UsuarioContext);
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);

    const [dadosIndicador, setDadosIndicador] = useState<DataTypeClientes[]>([]);
    const [codIndicadorAtual, setCodIndicadorAtual] = useState<string | null>(null);

    useEffect(() => {
        buscaListaVendasDetalhe();
    }, [props]);

    async function buscaListaVendasDetalhe() {
        setLoading(true);
        try {
            let rsClientes = await serviceDashBoardVendedor.listarDashBoardVendedorIndicadoresListaDetalhes(codigoUsuario, props.indicador);
            setDadosIndicador(rsClientes.data.lista_detalhes_indicador);
            setCodIndicadorAtual(rsClientes.data.lista_detalhes_indicador[0].indicador);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    }

    const formatVal = (val: number) =>
        val > 0
            ? parseFloat(String(val)).toFixed(2)
            : '—';

    const headerStyle = {
        background: 'linear-gradient(135deg, #9B1C1C 0%, #B22222 60%, #C0392B 100%)',
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: '0.75rem',
        letterSpacing: '0.08em',
        borderBottom: '2px solid rgba(255,255,255,0.15)',
        textAlign: 'right' as const,
    };

    const renderValor = (val: number) => (
        <span style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: val > 0 ? '#7f1d1d' : '#bbb',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.02em',
        }}>
            {formatVal(val)}
        </span>
    );

    const columnsClientes: TableColumnsType<DataTypeClientes> = [
        {
            title: 'DIA ANT.',
            dataIndex: "umDia",
            key: "umDia",
            align: "right",
            render: (_: string, record: any) => renderValor(record.umDia),
            onHeaderCell: () => ({ style: headerStyle }),
        },
        {
            title: 'SEMANA ANT.',
            dataIndex: "semanaAnterior",
            key: "semanaAnterior",
            align: "right",
            render: (_: string, record: any) => renderValor(record.semanaAnterior),
            onHeaderCell: () => ({ style: headerStyle }),
        },
        {
            title: 'MÊS ANT.',
            dataIndex: "mesAnterior",
            key: "mesAnterior",
            align: "right",
            render: (_: string, record: any) => renderValor(record.mesAnterior),
            onHeaderCell: () => ({ style: headerStyle }),
        },
        {
            title: '180 DIAS',
            dataIndex: "centoOitentaDias",
            key: "centoOitentaDias",
            align: "right",
            render: (_: string, record: any) => renderValor(record.centoOitentaDias),
            onHeaderCell: () => ({ style: headerStyle }),
        },
    ];

    return (
        <>
            <style>{`
                .detalhes-indicador-table .ant-table-thead > tr > th {
                    padding: 9px 12px;
                }
                .detalhes-indicador-table .ant-table-tbody > tr > td {
                    padding: 8px 12px;
                    border-bottom: 1px solid #fdf0f0;
                    transition: background 0.15s;
                }
                .detalhes-indicador-table .ant-table-tbody > tr:hover > td {
                    background: #fff5f5 !important;
                }
                .detalhes-indicador-table .ant-table-tbody > tr:last-child > td {
                    border-bottom: none;
                }
                .detalhes-indicador-table .ant-table-title {
                    padding: 9px 12px 7px;
                    background: #fafafa;
                    border-bottom: 1px solid #f0e8e8;
                    border-radius: 10px 10px 0 0;
                }
                .detalhes-indicador-table .ant-pagination {
                    padding: 10px 14px;
                    margin: 0 !important;
                    background: #fafafa;
                    border-top: 1px solid #f0e8e8;
                    border-radius: 0 0 10px 10px;
                }
                .detalhes-indicador-table .ant-table-container {
                    border-radius: 10px;
                    overflow: hidden;
                    border: 1px solid #f3e6e6 !important;
                }
            `}</style>

            <Spin spinning={loading} tip="Carregando...">
                <div style={{ padding: '4px 0' }}>
                    <Table
                        className="detalhes-indicador-table"
                        columns={columnsClientes}
                        dataSource={dadosIndicador}
                        size="small"
                        rowKey={(record) => record.cod_indica_pre}
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
                                <BarChartOutlined style={{ fontSize: '0.85rem', color: '#B22222', opacity: 0.8 }} />
                                <Typography.Text strong style={{
                                    fontSize: '0.85rem',
                                    color: '#1a1a2e',
                                    letterSpacing: '0.03em',
                                }}>
                                    Pendências por Período
                                </Typography.Text>
                                {codIndicadorAtual && (
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
                                        {codIndicadorAtual}
                                    </span>
                                )}
                            </div>
                        )}
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