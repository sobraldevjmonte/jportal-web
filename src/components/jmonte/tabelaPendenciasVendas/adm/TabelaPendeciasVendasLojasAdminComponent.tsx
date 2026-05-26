import { Button, Col, Row, Spin, Table, TableColumnsType, Tooltip, Typography, Space, Tag, Badge } from "antd";
import { useContext, useEffect, useState, useCallback } from "react";
import EtapasService from "../../../../service/EtapasService";
import ObrasService from "../../../../service/ObrasService"; // Importado para contagem real

import { FilePdfOutlined, SyncOutlined, RocketOutlined } from "@ant-design/icons";
import { UsuarioContext } from "../../../../context/useContext";
import TabelaPendeciasVendasVendedoresGerenciaComponent from "../gerentes/TabelaPendeciasVendasVendedoresGerenciaComponent";

import { formatarMoeda } from "../../../../utils/formatarValores"

const service = new EtapasService()

interface PendenciasVendasType {
    key: string;
    idvendedor: number;
    idLoja: number;
    codigoVendedor: string;
    nomevendedor: string;
    nomecliente: string;
    total_reais_pendencias: number;
    total_reais_faturadas: number;
    total_obras_vendedor?: number; // Novo campo para contagem real
    etapa1: number; etapa2: number; etapa3: number; etapa4: number; etapa5: number;
    etapa6: number; etapa7: number; etapa8: number; etapa9: number; etapa10: number;
    etapafat1: number; etapafat2: number; etapafat3: number; etapafat4: number; etapafat5: number;
    etapafat6: number; etapafat7: number; etapafat8: number; etapafat9: number; etapafat10: number;
}

export default function TabelaPendeciasVendasLojasAdminComponent(props: any) {
    const { idLoja, nivelUsuario, codigoUsuario } = useContext(UsuarioContext);

    const [dados, setDados] = useState<PendenciasVendasType[]>([]);
    const [quantidade, setQuantidade] = useState(0);
    const [loading, setLoading] = useState(false);
    const [verFaturados, setVerFaturados] = useState(true);

    /**
     * Busca as obras reais de cada vendedor desta loja específica
     */
    const sincronizarObrasVendedores = useCallback(async (vendedores: any[]) => {
        try {
            // Buscamos todas as obras da loja de uma vez para otimizar performance
            const rs = await ObrasService.listarTodasObrasGeral({
                idLoja: props.idLoja
            });

            if (Array.isArray(rs.data)) {
                const listaObras = rs.data;

                const dadosComObras = vendedores.map(vend => {
                    const contagem = listaObras.filter((obra: any) => 
                        String(obra.idvendedor) === String(vend.codigoVendedor)
                    ).length;
                    return { ...vend, total_obras_vendedor: contagem };
                });

                setDados(dadosComObras);
            }
        } catch (error) {
            console.error("Erro ao sincronizar obras dos vendedores:", error);
        }
    }, [props.idLoja]);

    const listaPendenciasVendasGerente = useCallback(async () => {
        setLoading(true);
        try {
            let rs: any = await service.listaPendenciasVendasGerentes(props.idLoja, 'DESC');
            const vendedoresLista = rs.data.vendedores || [];
            
            setDados(vendedoresLista);
            setQuantidade(rs.data.quantidade || 0);

            // Dispara o cruzamento com as obras
            await sincronizarObrasVendedores(vendedoresLista);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    }, [props.idLoja, sincronizarObrasVendedores]);

    useEffect(() => {
        listaPendenciasVendasGerente();
    }, [listaPendenciasVendasGerente]);

    const tamFonte = '0.85rem';
    const siglas = ['BAS', 'EPI', 'HID', 'CAB', 'TOM', 'PIS', 'LOU', 'POR', 'PIN', 'ILU'];
    const coresEtapas = [
        { solida: "#1f77b4", fundo: "#e6f4ff" }, { solida: "#ff7f0e", fundo: "#fff7e6" },
        { solida: "#2ca02c", fundo: "#f6ffed" }, { solida: "#d62728", fundo: "#fff1f0" },
        { solida: "#9467bd", fundo: "#f9f0ff" }, { solida: "#8c564b", fundo: "#fdf5f2" },
        { solida: "#e377c2", fundo: "#fff0f6" }, { solida: "#7f7f7f", fundo: "#f5f5f5" },
        { solida: "#bcbd22", fundo: "#fcffe6" }, { solida: "#17becf", fundo: "#e6fffb" },
    ];

    const columns: TableColumnsType<PendenciasVendasType> = [
        {
            title: 'Vendedor', 
            dataIndex: 'nomevendedor', 
            key: 'nomevendedor',
            width: 280,
            sorter: (a, b) => a.nomevendedor.localeCompare(b.nomevendedor),
            render: (text, record) => (
                <Space direction="vertical" size={0}>
                    <Space>
                        <b style={{ fontSize: tamFonte }}>{text}</b>
                        <Badge 
                            count={record.total_obras_vendedor || 0} 
                            showZero 
                            color={Number(record.total_obras_vendedor) > 0 ? "#faad14" : "#d9d9d9"} 
                            size="small"
                            style={{ fontSize: '10px' }}
                        />
                        <Typography.Text type="secondary" style={{ fontSize: '10px' }}>obras</Typography.Text>
                    </Space>
                    <Typography.Text type="secondary" style={{ fontSize: '10px' }}>Cod: {record.codigoVendedor}</Typography.Text>
                </Space>
            )
        },
        {
            title: 'TTL Vendas', 
            key: 'total_reais_pendencias', 
            width: '140px', 
            align: 'right',
            sorter: (a, b) => a.total_reais_pendencias - b.total_reais_pendencias,
            render: (_, record) => (
                <div style={{ lineHeight: '1.2', textAlign: 'right' }}>
                    <div style={{ fontSize: tamFonte, fontWeight: 'bold' }}>
                        {formatarMoeda(+record.total_reais_pendencias || 0)}
                    </div>
                    {verFaturados && (
                        <div style={{ fontSize: '0.75rem', color: '#52c41a', fontWeight: 'bold' }}>
                            Fat: {formatarMoeda(+record.total_reais_faturadas || 0)}
                        </div>
                    )}
                </div>
            )
        },
        ...coresEtapas.map((cor, i) => ({
            title: (
                <div style={{ textAlign: 'center', lineHeight: '1.1' }}>
                    <div style={{ fontSize: '0.65rem', color: cor.solida, fontWeight: 'bold' }}>({i + 1})</div>
                    <div style={{ fontSize: '0.90rem' }}>{siglas[i]}</div>
                </div>
            ),
            dataIndex: `etapa${i + 1}`,
            key: `etapa${i + 1}`,
            align: 'right' as const,
            width: 110,
            onHeaderCell: () => ({ style: { backgroundColor: cor.fundo } }),
            render: (val: any, record: any) => {
                const faturado = record[`etapafat${i + 1}`];
                return (
                    <div style={{ lineHeight: '1.2' }}>
                        <div style={{ fontSize: tamFonte }}>{formatarMoeda(+val || 0)}</div>
                        {verFaturados && (
                            <div style={{ 
                                fontSize: '0.75rem', 
                                color: '#52c41a', 
                                borderTop: '1px dashed #eee',
                                marginTop: '2px',
                                fontWeight: 600
                            }}>
                                {formatarMoeda(+faturado || 0)}
                            </div>
                        )}
                    </div>
                );
            }
        })),
    ];

    return (
        <div style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #d9d9d9', margin: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <Space>
                    <Typography.Title level={5} style={{ margin: 0 }}>
                        Detalhamento por Vendedor - Loja {props.idLoja}
                    </Typography.Title>
                    {verFaturados && <Tag color="green">MODO: PENDENTE + FATURADO</Tag>}
                </Space>
                
                <Space>
                    <Tooltip title={verFaturados ? "Ocultar faturados" : "Exibir faturados dos vendedores"}>
                        <Button 
                            size="small"
                            icon={<RocketOutlined />} 
                            danger={verFaturados}
                            type={verFaturados ? "primary" : "default"}
                            onClick={() => setVerFaturados(!verFaturados)}
                        >
                            {verFaturados ? "Ocultar Fat" : "Ver Fat"}
                        </Button>
                    </Tooltip>
                    
                    <Button icon={<SyncOutlined spin={loading} />} onClick={listaPendenciasVendasGerente} size="small">
                        Atualizar
                    </Button>
                </Space>
            </div>

            <Spin spinning={loading}>
                <Table
                    columns={columns}
                    dataSource={dados}
                    size="small"
                    rowKey="codigoVendedor"
                    bordered
                    pagination={false}
                    title={() => <span style={{ fontWeight: 'bold' }}>Vendedores listados: {quantidade}</span>}
                    expandedRowRender={(record) => (
                        <TabelaPendeciasVendasVendedoresGerenciaComponent 
                            codigoVendedor={record.codigoVendedor} 
                            nomeVendedor={record.nomevendedor}
                        />
                    )}
                />
            </Spin>
        </div>
    );
}