import { SyncOutlined, TagOutlined, HomeOutlined, RocketOutlined, BulbOutlined, FileTextOutlined, ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Spin, Table, Tooltip, Typography, Space, message, Tag, Badge, List, Popover, Input } from "antd";
import type { TableColumnsType } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { UsuarioContext } from "../../../../context/useContext";
import EtapasService from "../../../../service/EtapasService";
import obrasService from "../../../../service/ObrasService";
import TabelaPendenciasSomaEtapasComponent from "./TabelaPendenciasSomaEtapasComponent";
import { formatarMoeda } from "../../../../utils/formatarValores";

import './css/estilo.css';
import TabelaObrasEtapasComponent from "../../obras/TabelaObrasClienteComponent";

const service = new EtapasService();

interface PendenciasVendasType {
    key: string;
    seq: string;
    idvendedor: number;
    nomecliente: string;
    idcliente: number;
    total_pendente: number; 
    total_faturado: number; 
    nomeVendedor: string;
    codigoLoja: string;
    etapa1: number; etapa2: number; etapa3: number; etapa4: number; etapa5: number;
    etapa6: number; etapa7: number; etapa8: number; etapa9: number; etapa10: number;
    etapafinal1: number; etapafinal2: number; etapafinal3: number; etapafinal4: number; etapafinal5: number;
    etapafinal6: number; etapafinal7: number; etapafinal8: number; etapafinal9: number; etapafinal10: number;
    contatou: boolean;
    cliente_obra: string;
    tem_obra_ativa: boolean;
    total_obras: number;
    sequencia_obras: number;
}

export default function TabelaPendeciasVendasVendedoresComponent() {
    const { codigoUsuario, idUsuario } = useContext(UsuarioContext);

    const [dados, setDados] = useState<PendenciasVendasType[]>([]);
    const [quantidade, setQuantidade] = useState(0);
    const [loading, setLoading] = useState(false);
    const [ordem] = useState('DESC');
    const [verFaturados, setVerFaturados] = useState(true);
    const [gerandoPdf, setGerandoPdf] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clienteModal, setClienteModal] = useState('');
    const [idClienteModal, setIdClienteModal] = useState(0);
    const [obsModal, setObsModal] = useState('');

    const [popoverVisible, setPopoverVisible] = useState(false);
    const [etapaFiltradaAtiva, setEtapaFiltradaAtiva] = useState<number | null>(null);

    // --- ESTADO PARA PEGAR OS FILTRADOS DO GRID (DIGITAÇÃO OU FUNIL) ---
    const [totalFiltradosColuna, setTotalFiltradosColuna] = useState<number | null>(null);

    const siglas = ['BAS', 'EPI', 'HID', 'CAB', 'TOM', 'PIS', 'LOU', 'POR', 'PIN', 'ILU'];
    
    // --- LÓGICA DE OPORTUNIDADES ---
    const oportResumo = useMemo(() => {
        return siglas.map((sigla, i) => {
            const index = i + 1;
            
            const clientesOportunidade = dados.filter(item => {
                const faturado = Number(item[`etapafinal${index}` as keyof PendenciasVendasType]) || 0;
                return faturado === 0;
            });

            return {
                index,
                sigla,
                qtd: clientesOportunidade.length,
                valor: clientesOportunidade.reduce((acc, curr) => acc + (Number(curr[`etapa${index}` as keyof PendenciasVendasType]) || 0), 0)
            };
        });
    }, [dados]);

    const totalGeralOportunidades = useMemo(() => {
        return oportResumo.reduce((acc, curr) => acc + curr.qtd, 0);
    }, [oportResumo]);

    // --- FILTRAGEM DINÂMICA DA TABELA PRINCIPAL (OPORTUNIDADES) ---
    const dadosExibidosNaTabela = useMemo(() => {
        if (etapaFiltradaAtiva === null) return dados;
        
        return dados.filter(item => {
            const faturado = Number(item[`etapafinal${etapaFiltradaAtiva}` as keyof PendenciasVendasType]) || 0;
            return faturado === 0;
        });
    }, [dados, etapaFiltradaAtiva]);

    // Reseta o contador da coluna se o filtro de etapa mudar para evitar inconsistência
    useEffect(() => {
        setTotalFiltradosColuna(null);
    }, [etapaFiltradaAtiva]);

    const totalClientesComObras = useMemo(() => {
        return dadosExibidosNaTabela.filter(d => (Number(d.total_obras) || 0) > 0).length;
    }, [dadosExibidosNaTabela]);

    const handleDownloadPdf = async () => {
        setGerandoPdf(true);
        try {
            const response = await obrasService.downloadRelatorioOportunidades(codigoUsuario, etapaFiltradaAtiva);
            
            const nomeSufixo = etapaFiltradaAtiva ? siglas[etapaFiltradaAtiva - 1] : 'GERAL';
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Oportunidades_${nomeSufixo}_${codigoUsuario}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            message.success(`PDF de Oportunidades (${nomeSufixo}) gerado com sucesso!`);
        } catch (e) {
            message.error("Erro ao gerar PDF de oportunidades. Verifique os parâmetros no backend.");
        } finally {
            setGerandoPdf(false);
        }
    };

    const listaPendenciasVendas = useCallback(async () => {
        setLoading(true);
        try {
            const rs: any = await service.listaPendenciasVendas(codigoUsuario, ordem);
            const listaOriginal = rs?.data?.pendenciasVendas || [];
            const dadosTratados = listaOriginal.map((item: any, index: number) => ({
                ...item,
                seq: index + 1,
                key: `pendencia-${item.idcliente}`,
            }));
            setDados(dadosTratados);
            setQuantidade(rs?.data?.quantidade || 0);
            setTotalFiltradosColuna(null); // Limpa contagem textual ao recarregar
        } catch (error) {
            setDados([]);
        } finally {
            setLoading(false);
        }
    }, [codigoUsuario, ordem]);

    useEffect(() => {
        listaPendenciasVendas();
    }, [listaPendenciasVendas]);

    const handleOk = async () => {
        await service.salvarObservacao(idClienteModal, idUsuario, obsModal);
        message.success("Observação salva!");
        setIsModalOpen(false);
        listaPendenciasVendas();
    };

    // --- FUNÇÃO CAPTURA EVENTOS DE FILTRO DA TABELA ---
    const handleTableChange = (_pagination: any, filters: any, _sorter: any, extra: any) => {
        // Checa se qualquer array de filtro interno possui seleções ou digitação ativa
        const possuiFiltrosAtivos = Object.values(filters).some(f => Array.isArray(f) && f.length > 0);
    
        if (possuiFiltrosAtivos) {
            setTotalFiltradosColuna(extra.currentDataSource.length);
        } else {
            setTotalFiltradosColuna(null);
        }
    };

    const tamFonte = '0.85rem';
    const colorContatou = 'blue';
    const coresEtapas = [
        { solida: "#1f77b4", fundo: "#e6f4ff" }, { solida: "#ff7f0e", fundo: "#fff7e6" },
        { solida: "#2ca02c", fundo: "#f6ffed" }, { solida: "#d62728", fundo: "#fff1f0" },
        { solida: "#9467bd", fundo: "#f9f0ff" }, { solida: "#8c564b", fundo: "#fdf5f2" },
        { solida: "#e377c2", fundo: "#fff0f6" }, { solida: "#7f7f7f", fundo: "#f5f5f5" },
        { solida: "#bcbd22", fundo: "#fcffe6" }, { solida: "#17becf", fundo: "#e6fffb" },
    ];

    const columns: TableColumnsType<PendenciasVendasType> = [
        {
            title: 'Seq.', dataIndex: 'seq', key: 'seq', width: 50, align: 'center',
            render: (text) => <span style={{ fontSize: '0.8rem', color: '#999' }}>{text}</span>,
        },
        {
            title: '+Obs.', align: 'center', width: 60,
            render: (_, record) => (
                <Button icon={<TagOutlined />} size="small"
                    onClick={() => {
                        setClienteModal(record.nomecliente);
                        setIdClienteModal(record.idcliente);
                        setObsModal('');
                        setIsModalOpen(true);
                    }} 
                    style={{ color: 'orange', borderColor: 'orange' }} 
                />
            ),
        },
        {
            title: 'OBRA', 
            align: 'center', 
            width: 120,
            key: 'total_obras', // Mapeado explicitamente para rastreio do motor AntD
            // --- CONFIGURAÇÃO DO FILTRO DE STATUS DE OBRAS ---
            filters: [
                { text: 'Com Obras', value: 'com_obra' },
                { text: 'Sem Obras', value: 'sem_obra' }
            ],
            filterMultiple: false, 
            onFilter: (value, record) => {
                const total = Number(record.total_obras) || 0;
                if (value === 'com_obra') return total > 0;
                if (value === 'sem_obra') return total === 0;
                return true;
            },
            render: (_, record) => {
                const total = Number(record.total_obras) || 0;
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {total > 0 && (
                            <span style={{ fontSize: '11px', color: '#0054a6', fontWeight: 'bold' }}>
                                {record.sequencia_obras}º
                            </span>
                        )}
                        <Tooltip title={total > 0 ? `${total} obra(s)` : "Sem obras"}>
                            {total > 0 ? (
                                <Badge 
                                    count={total} 
                                    size="small" 
                                    offset={[5, 0]} 
                                    style={{ backgroundColor: record.tem_obra_ativa ? '#52c41a' : '#bfbfbf', fontSize: '10px' }}
                                >
                                    <HomeOutlined style={{ color: record.tem_obra_ativa ? '#52c41a' : '#d9d9d9', fontSize: '18px' }} />
                                </Badge>
                            ) : (
                                <span style={{ color: '#d9d9d9' }}>-</span>
                            )}
                        </Tooltip>
                    </div>
                );
            }
        },
        {
            title: 'Cliente', 
            dataIndex: 'nomecliente', 
            key: 'nomecliente',
            width: 280,
            sorter: (a, b) => a.nomecliente.localeCompare(b.nomecliente),
            // --- FILTRO DE TEXTO DROPDOWN PARA BUSCA DE CLIENTES ---
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Buscar cliente..."
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Filtrar
                        </Button>
                        <Button onClick={() => { if(clearFilters) clearFilters(); confirm(); }} size="small" style={{ width: 90 }}>
                            Limpar
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined, fontSize: '14px' }} />
            ),
            onFilter: (value, record) =>
                record.nomecliente
                    .toString()
                    .toLowerCase()
                    .includes(value.toString().toLowerCase()),
            render: (text, record) => (
                <span style={{ fontSize: tamFonte, color: record.contatou ? colorContatou : '#000', fontWeight: record.contatou ? 600 : 400 }}>{text}</span>
            ),
        },
        {
            title: 'TTL Vendas', align: 'right', width: 120,
            render: (_, record) => (
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: tamFonte, fontWeight: 'bold' }}>{formatarMoeda(+record.total_pendente)}</div>
                    {verFaturados && <div style={{ fontSize: '0.8rem', color: '#52c41a' }}>Fat: {formatarMoeda(+record.total_faturado)}</div>}
                </div>
            ),
        },
        ...coresEtapas.map((cor, i) => ({
            title: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.1' }}>
                    <span style={{ fontSize: '0.7rem', color: cor.solida, fontWeight: 'bold' }}>({i + 1})</span>
                    <span style={{ fontSize: '0.8rem' }}>{siglas[i]}</span>
                </div>
            ),
            dataIndex: `etapa${i + 1}`,
            align: 'right' as const,
            width: 105,
            onHeaderCell: () => ({ style: { backgroundColor: cor.fundo, padding: '4px' } }),
            render: (val: any, record: any) => {
                const faturado = record[`etapafinal${i + 1}`];
                return (
                    <div>
                        <div style={{ fontSize: tamFonte, fontWeight: 500 }}>{val > 0 ? formatarMoeda(+val) : '0,00'}</div>
                        {verFaturados && <div style={{ fontSize: '0.8rem', color: '#52c41a', borderTop: '1px dashed #eee', marginTop: '2px' }}>{faturado > 0 ? formatarMoeda(+faturado) : '0,00'}</div>}
                    </div>
                );
            }
        })),
    ];

    return (
        <div style={{ maxWidth: '2000px', padding: '10px' }}>
            <Spin spinning={loading} tip="Sincronizando dados...">
                <TabelaPendenciasSomaEtapasComponent codigoUsuario={codigoUsuario} />
                
                <Row align="middle" justify="space-between" style={{ marginTop: '20px', marginBottom: '15px' }}>
                    <Col>
                        <Space size="middle">
                            <Typography.Title level={4} style={{ margin: 0 }}>Gestão de Vendas por Etapa</Typography.Title>
                            {verFaturados && <Tag color="green">VISUALIZAÇÃO: PENDENTE + FATURADO</Tag>}
                            {etapaFiltradaAtiva !== null && (
                                <Tag color="warning" closable onClose={() => setEtapaFiltradaAtiva(null)} icon={<ClearOutlined />} style={{ fontWeight: 'bold' }}>
                                    FILTRADO POR: OPORTUNIDADE {siglas[etapaFiltradaAtiva - 1]}
                                </Tag>
                            )}
                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <Popover
                                title={<div style={{ textAlign: 'center', fontWeight: 'bold', paddingBottom: '8px', borderBottom: '1px solid #f0f0f0' }}>Oportunidades (Pendente sem Faturamento)</div>}
                                trigger="click"
                                placement="bottomRight"
                                open={popoverVisible}
                                onOpenChange={setPopoverVisible}
                                overlayStyle={{ width: '400px' }}
                                content={
                                    <List
                                        size="small"
                                        dataSource={oportResumo}
                                        renderItem={(item, i) => (
                                            <List.Item
                                                onClick={() => {
                                                    setEtapaFiltradaAtiva(item.index);
                                                    setPopoverVisible(false);
                                                    message.info(`Tabela filtrada pela etapa: ${item.sigla}`);
                                                }}
                                                style={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center', 
                                                    padding: '8px 4px',
                                                    cursor: 'pointer',
                                                    borderRadius: '4px',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '180px' }}>
                                                    <Tag color={coresEtapas[i].fundo} style={{ color: coresEtapas[i].solida, fontWeight: 'bold', margin: 0, width: '45px', textAlign: 'center', border: `1px solid ${coresEtapas[i].solida}40` }}>
                                                        {item.sigla}
                                                    </Tag>
                                                    <Tag color="processing" style={{ margin: 0, minWidth: '95px', textAlign: 'center' }}>
                                                        {item.qtd} {item.qtd === 1 ? 'cliente' : 'clientes'}
                                                    </Tag>
                                                </div>
                                                <div style={{ flex: 1, textAlign: 'right' }}>
                                                    <Typography.Text strong style={{ fontSize: '0.85rem' }}>
                                                        {item.valor > 0 ? formatarMoeda(item.valor) : 'R$ 0,00'}
                                                    </Typography.Text>
                                                </div>
                                            </List.Item>
                                        )}
                                        footer={
                                            <Button type="primary" size="middle" icon={<FileTextOutlined />} block 
                                                loading={gerandoPdf} onClick={handleDownloadPdf} style={{ marginTop: '8px', height: '36px', borderRadius: '6px' }}>
                                                {etapaFiltradaAtiva 
                                                    ? `Gerar PDF de Oportunidades (${siglas[etapaFiltradaAtiva - 1]})` 
                                                    : "Gerar Relatório Geral Oportunidades"
                                                }
                                            </Button>
                                        }
                                    />
                                }
                            >
                                <Button icon={<BulbOutlined />} style={{ backgroundColor: '#fff7e6', borderColor: '#ffd591', color: '#fa8c16', fontWeight: 'bold' }}>
                                    Oportunidades ({totalGeralOportunidades})
                                </Button>
                            </Popover>

                            <Tooltip title={verFaturados ? "Ocultar valores já faturados" : "Exibir valores já faturados abaixo das pendências"}>
                                <Button icon={<RocketOutlined />} type={verFaturados ? "primary" : "default"} onClick={() => setVerFaturados(!verFaturados)}>
                                    {verFaturados ? "Ocultar Faturados" : "Exibir Faturados"}
                                </Button>
                            </Tooltip>

                            <Button type="primary" icon={<SyncOutlined spin={loading} />} onClick={listaPendenciasVendas} style={{ backgroundColor: '#2F4F4F', borderColor: '#2F4F4F' }}>
                                Atualizar
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Table 
                    columns={columns} 
                    dataSource={dadosExibidosNaTabela} 
                    size="small" 
                    rowKey="idcliente" 
                    bordered 
                    pagination={{ pageSize: 50 }}
                    onChange={handleTableChange} // Dispara e captura qualquer alteração de filtros nativos/dropdowns
                    title={() => (
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Space size="large">
                                    {/* Ajuste dinâmico para renderizar a tag correta se houver qualquer busca ativa */}
                                    {totalFiltradosColuna !== null ? (
                                        <Typography.Text strong>
                                            Clientes Encontrados na Pesquisa: <Tag color="cyan" style={{ marginLeft: 4 }}>{totalFiltradosColuna}</Tag>
                                            <span style={{ fontSize: '11px', color: '#aaa', fontWeight: 'normal', marginLeft: '8px' }}>
                                                (de um total de {dadosExibidosNaTabela.length})
                                            </span>
                                        </Typography.Text>
                                    ) : (
                                        <Typography.Text strong>Clientes Filtrados: <Tag color="blue" style={{ marginLeft: 4 }}>{dadosExibidosNaTabela.length}</Tag></Typography.Text>
                                    )}
                                    <Typography.Text strong>Clientes com Obra: <Tag color="orange" style={{ marginLeft: 4 }}>{totalClientesComObras}</Tag></Typography.Text>
                                    {etapaFiltradaAtiva !== null && (
                                        <Button type="link" size="small" icon={<ClearOutlined />} onClick={() => setEtapaFiltradaAtiva(null)} style={{ padding: 0 }}>
                                            Limpar Filtro de Oportunidades
                                        </Button>
                                    )}
                                </Space>
                            </Col>
                        </Row>
                    )}
                    expandedRowRender={(record) => (
                        <TabelaObrasEtapasComponent idCliente={String(record.idcliente)} idVendedor={String(record.idvendedor)} nomeCliente={record.nomecliente} />
                    )}
                />
            </Spin>

            <Modal title="Anotações de Contato" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)} okText="Salvar" cancelText="Fechar">
                <Typography.Text strong>{clienteModal} ({idClienteModal})</Typography.Text>
                <TextArea autoFocus style={{ marginTop: '10px' }} rows={4} value={obsModal} onChange={(e) => setObsModal(e.target.value.toUpperCase())} placeholder="Descreva o retorno do contato..." />
            </Modal>
        </div>
    );
}