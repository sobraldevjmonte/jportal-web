import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../../../context/useContext";
import GrupoSubGrupoService from "../../../service/GrupoSubGrupoService";
import { Button, Col, Row, Spin, Table, TableColumnsType, TableProps, Typography } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import TabelaSubGrupoComponente from "./TabelaSubGrupoComponente";

import { formatarMoedaComSimbolo } from "../../../utils/formatarValores"
import dayjs from "dayjs";

const serviceGrupoSubGrupo = new GrupoSubGrupoService()

interface GruposType {
    key: number;
    grupo: string;
    codgrupo: string
    subgrupo: string
    total_nps: number
    total_lucrobruto: number
    total_vlr_tabela: number
    total_vnd_bruta: number
    total_vlr_frete: number
    total_vlr_devolucoes: number
}

export default function GrupoComponente() {
    const [dados, setDados] = useState<GruposType[]>([]);
    const [dadosAnoAnterior, setDadosAnoAnterior] = useState<GruposType[]>([]);

    const [registros, setQuantidade] = useState(0);
    const [registrosAnoAnterior, setQuantidadeAnoAnterior] = useState(0);

    const [loading, setLoading] = useState(false);

    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { icomp, setIcomp } = useContext(UsuarioContext);


    let mesAnterior = '';
    const getLastMonth = () => {
        const lastMonth = dayjs().subtract(1, 'month');
        return lastMonth.format('MM'); // Retorna no formato "MM"
    };

    useEffect(() => {
        mesAnterior = getLastMonth();
        // console.log(mesAnterior)
        listaGruposx()
    }, [])

    async function listaGruposx() {
        try {
            setLoading(true);

            const [rs, rsAnoAnterior] = await Promise.all([
                serviceGrupoSubGrupo.listarGrupos(icomp, mesAnterior),
                serviceGrupoSubGrupo.listarGruposAnoAnterior(icomp, mesAnterior),
            ]);


            setDados(rs.data.grupos);
            setQuantidade(rs.data.quantidade);
            setDadosAnoAnterior(rsAnoAnterior.data.grupos);
            setQuantidadeAnoAnterior(rsAnoAnterior.data.quantidade);
        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
        }
    }

    const tamFonte = '0.9rem';
    const colorContatou = 'blue'
    const corDestaque = '#000'
    const corDestaqueNegativo = 'red'

    // const columns: TableColumnsType<GruposType> = [

    //     { title: 'GRUPO', dataIndex: 'grupo', key: 'grupo', width: '' },

    // ]

    const columns: TableColumnsType<GruposType> = [

        {
            title: <div style={{ textAlign: 'center' }}>Grupo</div>, dataIndex: 'grupo', key: 'subgrupo', width: '220px',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#B22222', // Cor de fundo do cabeçalho
                        color: '#FFFFFF',
                        padding: 0,
                        margin: 0,
                        height: '35px'
                    },
                };
            },
        },
        {
            title: <div style={{ textAlign: 'center' }}>Vnd Liq($) +Carradas</div>,
            dataIndex: 'total_vnd_bruta',
            key: 'total_vnd_bruta',
            align: 'right',
            render: (total_vnd_bruta, record) => {
                const totalVlrDevolucoes = record.total_vlr_devolucoes || 0; // Defina o valor padrão como 0 se não existir
                return (
                    <span style={{ fontSize: tamFonte, color: total_vnd_bruta > 1000 ? corDestaque : '#000' }}>
                        {total_vnd_bruta !== null ? formatarMoedaComSimbolo(+total_vnd_bruta - totalVlrDevolucoes) : '0.00'}
                    </span>
                );
            },
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#B22222', // Cor de fundo do cabeçalho
                        color: '#FFFFFF',
                        padding: 0,
                        margin: 0
                    },
                };
            },
        },
        {
            title: <div style={{ textAlign: 'center' }}>Dev.</div>, dataIndex: 'total_vlr_devolucoes', key: 'subgrupo', align: 'right',
            render: (total_vlr_devolucoes, record) =>
                <span style={{ fontSize: tamFonte, color: record.total_vlr_devolucoes > 1000 ? corDestaque : '#000' }}>
                    {total_vlr_devolucoes !== null ? formatarMoedaComSimbolo(+total_vlr_devolucoes) : 'R$ 0.00'}
                </span>,
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#B22222', // Cor de fundo do cabeçalho
                        color: '#FFFFFF',
                        padding: 0,
                        margin: 0
                    },
                };
            },
        },
        {
            title: <div style={{ textAlign: 'center' }}>Vnd Liq($) Ano Anterior</div>,
            dataIndex: 'total_vnd_bruta',
            key: 'total_vlr_tabela_ano_anterior',
            align: 'right',
            render: (text, record, index) => {
                // Garantir que estamos comparando o mesmo índice nas listas
                const vendasAnoAnterior = dadosAnoAnterior[index]?.total_vnd_bruta || 0;
                const devolucaoAnoAnterior = dadosAnoAnterior[index]?.total_vlr_devolucoes || 0;
                return (
                    <span style={{ fontSize: tamFonte }}>
                        {vendasAnoAnterior !== null ? formatarMoedaComSimbolo(+vendasAnoAnterior - devolucaoAnoAnterior) : '0.00'}
                    </span>
                );
            },
            onHeaderCell: () => ({
                style: {
                    backgroundColor: '#B22222',
                    color: '#FFFFFF',
                    padding: 0,
                    margin: 0,
                },
            }),
        },
        {
            title: <div style={{ textAlign: 'center' }}>Dev.Ant.</div>, dataIndex: 'total_vlr_devolucoes', key: 'subgrupo', align: 'right',
            render: (text, record, index) => {
                // Garantir que estamos comparando o mesmo índice nas listas
                const devolucaoAnoAnterior = dadosAnoAnterior[index]?.total_vlr_devolucoes || 0;
                return (
                    <span style={{ fontSize: tamFonte }}>
                        {devolucaoAnoAnterior !== null ? formatarMoedaComSimbolo(+devolucaoAnoAnterior) : '0.00'}
                    </span>
                );
            },
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#B22222', // Cor de fundo do cabeçalho
                        color: '#FFFFFF',
                        padding: 0,
                        margin: 0
                    },
                };
            },
        },
        {
            title: <div style={{ textAlign: 'center' }}>Evolução</div>,
            dataIndex: 'total_vnd_bruta',
            key: 'evolucao',
            align: 'right',
            render: (text, record, index) => {
                const evolucaoAnoAnterior = dadosAnoAnterior[index]?.total_vnd_bruta || 0; // Valor do ano anterior
                const volucaoValorAtual = record.total_vnd_bruta || 0; // Valor atual

                // Cálculo da evolução percentual
                const evolucaoVendas = evolucaoAnoAnterior !== 0
                    ? (((evolucaoAnoAnterior * 100) / volucaoValorAtual) - 100) * -1
                    // ? ((volucaoValorAtual - evolucaoAnoAnterior) / evolucaoAnoAnterior) * 100
                    : 0;
                return (
                    <span style={{ fontSize: tamFonte, color: evolucaoVendas > 0 ? corDestaque : corDestaqueNegativo }}>
                        {evolucaoAnoAnterior !== 0 ? `${evolucaoVendas.toFixed(2)}%` : 'N/A'}
                    </span>
                );
            },
            onHeaderCell: () => ({
                style: {
                    backgroundColor: '#B22222', // Cor de fundo do cabeçalho
                    color: '#FFFFFF',
                    padding: 0,
                    margin: 0,
                },
            }),
        },
        {
            title: <div style={{ textAlign: 'center' }}>L.B.(%)</div>, dataIndex: 'total_lucrobruto', key: 'total_lucrobruto', width: '',
            render: (total_lucrobruto, record) =>
                <span style={{ fontSize: tamFonte, color: record.total_lucrobruto > 0 ? corDestaque : corDestaqueNegativo }}>
                    {total_lucrobruto !== null ? total_lucrobruto + '%' : '0.00%'}
                </span>,
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#B22222', // Cor de fundo do cabeçalho
                        color: '#FFFFFF',
                        padding: 0,
                        margin: 0
                    },
                };
            },
        },
        {
            title: <div style={{ textAlign: 'center' }}>L.B.(%) Ano Ant</div>,
            dataIndex: 'total_lucrobruto',
            key: 'total_lucrobruto_ano_anterior',
            align: 'right',
            render: (text, record, index) => {
                // Garantir que estamos comparando o mesmo índice nas listas
                const lbAanoAnterior = dadosAnoAnterior[index]?.total_lucrobruto || 0;
                return (
                    <span style={{ fontSize: tamFonte, color: lbAanoAnterior > 0 ? corDestaque : corDestaqueNegativo }}>
                        {lbAanoAnterior !== null ? formatarMoedaComSimbolo(+lbAanoAnterior) + '%' : '0.00%'}
                    </span>
                );
            },
            onHeaderCell: () => ({
                style: {
                    backgroundColor: '#B22222',
                    color: '#FFFFFF',
                    padding: 0,
                    margin: 0,
                },
            }),
        },
        {
            title: <div style={{ textAlign: 'center' }}>Evol.L.B.(%) Ano Ant</div>,
            dataIndex: 'total_lucrobruto',
            key: 'evolucao_total_lucrobruto_ano_anterior',
            align: 'right',
            render: (text, record, index) => {
                const anoAnteriorLb = dadosAnoAnterior[index]?.total_lucrobruto || 0; // Valor do ano anterior
                const valorAtualLb = record.total_lucrobruto || 0; // Valor atual

                // Cálculo da evolução percentual
                const evolucaoLb = anoAnteriorLb !== 0
                    ? valorAtualLb - anoAnteriorLb
                    : 0;

                return (
                    <span style={{ fontSize: tamFonte, color: evolucaoLb > 0 ? corDestaque : corDestaqueNegativo }}>
                        {anoAnteriorLb !== 0 ? `${evolucaoLb.toFixed(2)}%` : 'N/A'}
                    </span>
                );
            },
            onHeaderCell: () => ({
                style: {
                    backgroundColor: '#B22222', // Cor de fundo do cabeçalho
                    color: '#FFFFFF',
                    padding: 0,
                    margin: 0,
                },
            }),
        },
        {
            title: <div style={{ textAlign: 'center' }}>Qtde. Nps.</div>, dataIndex: 'total_nps', key: 'total_nps', align: 'right', width: '',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#B22222', // Cor de fundo do cabeçalho
                        color: '#FFFFFF',
                        padding: 0,
                        margin: 0
                    },
                };
            },
        },
        {
            title: <div style={{ textAlign: 'center' }}>Qtde. Nps. Ano Ant</div>,
            dataIndex: 'total_nps',
            key: 'total_nps_ano_anterior',
            align: 'right',
            render: (text, record, index) => {
                // Garantir que estamos comparando o mesmo índice nas listas
                const npsAnoAnterior = dadosAnoAnterior[index]?.total_nps || 0;
                return (
                    <span style={{ fontSize: tamFonte }}>
                        {npsAnoAnterior}
                    </span>
                );
            },
            onHeaderCell: () => ({
                style: {
                    backgroundColor: '#B22222',
                    color: '#FFFFFF',
                    padding: 0,
                    margin: 0,
                },
            }),
        },
        {
            title: <div style={{ textAlign: 'center' }}>Evol.(%) Ano Ant</div>,
            dataIndex: 'total_nps',
            key: 'evolucao_nps',
            align: 'right',
            render: (text, record, index) => {
                const npsAnoAnterior = dadosAnoAnterior[index]?.total_nps || 0; // Valor do ano anterior
                const npsValorAtual = record.total_nps || 0; // Valor atual

                // Cálculo da evolução percentual
                const evolucaoVendas = npsAnoAnterior !== 0
                    ? (((npsAnoAnterior * 100) / npsValorAtual) - 100) * -1
                    // ? ((npsValorAtual - npsAnoAnterior) / npsAnoAnterior) * 100
                    : 0;

                return (
                    <span style={{ fontSize: tamFonte, color: evolucaoVendas > 0 ? corDestaque : corDestaqueNegativo }}>
                        {npsAnoAnterior !== 0 ? `${evolucaoVendas.toFixed(2)}%` : 'N/A'}
                    </span>
                );
            },
            onHeaderCell: () => ({
                style: {
                    backgroundColor: '#B22222', // Cor de fundo do cabeçalho
                    color: '#FFFFFF',
                    padding: 0,
                    margin: 0,
                },
            }),
        },
        {
            title: <div style={{ textAlign: 'center' }}>Taxa Entrega</div>, dataIndex: 'total_vlr_frete', key: 'total_vlr_frete', align: 'right', width: '',
            render: (total_vlr_frete, record) =>
                <span style={{ fontSize: tamFonte, color: record.total_vlr_frete > 1000 ? corDestaque : '#000' }}>
                    {total_vlr_frete !== null ? formatarMoedaComSimbolo(+total_vlr_frete) : '0.00'}
                </span>,
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#B22222', // Cor de fundo do cabeçalho
                        color: '#FFFFFF',
                        padding: 0,
                        margin: 0
                    },
                };
            },
        },
        {
            title: <div style={{ textAlign: 'center' }}>% Partic.</div>, dataIndex: 'total_nps', key: 'total_nps', width: '',
            render: (total_vlr_tabela, record) =>
                <span style={{ fontSize: tamFonte, color: record.total_vlr_tabela > 1000 ? corDestaque : '#000' }}>
                    CALC
                </span>,
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#B22222', // Cor de fundo do cabeçalho
                        color: '#FFFFFF',
                        padding: 0,
                        margin: 0
                    },
                };
            },
        },
        {
            title: <div style={{ textAlign: 'center' }}>% Partic. Ano Ant</div>, dataIndex: 'total_nps', key: 'total_nps', width: '',
            render: (total_vlr_tabela, record) =>
                <span style={{ fontSize: tamFonte, color: record.total_vlr_tabela > 1000 ? corDestaque : '#000' }}>
                    CALC
                </span>,
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#B22222', // Cor de fundo do cabeçalho
                        color: '#FFFFFF',
                        padding: 0,
                        margin: 0
                    },
                };
            },
        },
    ]

    const onChange: TableProps<GruposType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };


    const expandedRowRender = (record: any) => {
        let x = record.grupo
        return <TabelaSubGrupoComponente grupo={x} />;
    };

    return (
        <div>
            <div>
                <Button icon={<SyncOutlined />} onClick={() => listaGruposx()} style={{ backgroundColor: '#2F4F4F', color: '#fff', borderColor: '#2F4F4F', marginRight: '5px', width: '130px' }} title="Atualizar todos os registros">Atualizar</Button>
            </div>
            <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div style={{ backgroundColor: '#fff' }}>
                    <Row style={{ display: 'flex', flexDirection: 'column' }}>
                        <Col>
                            <Typography style={{ fontSize: '24px' }}>
                                Grupo/Sub-Grupo
                            </Typography>
                        </Col>
                    </Row>
                </div>
                <div style={{ padding: '10px', height: '800px', position: 'relative' }}>
                    <Table
                        onChange={onChange}
                        columns={columns}
                        dataSource={dados}
                        size="small"
                        rowKey={(record) => record.grupo}
                        bordered
                        title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>Registros({registros}) </Typography>}
                        expandedRowRender={expandedRowRender}
                        pagination={{
                            pageSize: 20, // Define o número de registros por página
                            showSizeChanger: true, // Permite ao usuário alterar o número de registros por página
                            pageSizeOptions: ['10', '20', '50', '100'], // Opções disponíveis para o seletor
                        }}

                        summary={(pageData) => {
                            const totalVndBruta = pageData.reduce(
                                (sum, record) => sum + (+record.total_vnd_bruta || 0),
                                0
                            );
                            const totalVlrDevolucoes = pageData.reduce(
                                (sum, record) => sum + (+record.total_vlr_devolucoes || 0),
                                0
                            );

                            const totalVndBrutaAnoAnterior = pageData.reduce(
                                (sum, record, index) => {
                                    const vendasAnoAnterior = dadosAnoAnterior[index]?.total_vnd_bruta || 0;
                                    const devolucaoAnoAnterior = dadosAnoAnterior[index]?.total_vlr_devolucoes || 0;
                                    return sum + (+vendasAnoAnterior - devolucaoAnoAnterior || 0);
                                },
                                0
                            );
                            const totalVlrDevolucoesAnoAnterior = pageData.reduce(
                                (sum, record, index) => {
                                    const devolucaoAnoAnterior = dadosAnoAnterior[index]?.total_vlr_devolucoes || 0;
                                    return sum + +devolucaoAnoAnterior;
                                },
                                0
                            );
                            const totalNps = pageData.reduce(
                                (sum, record) => sum + (+record.total_nps || 0),
                                0
                            );
                            const totalNpsAnoAnterior = pageData.reduce(
                                (sum, record, index) => {
                                    const npsAnoAnterior = dadosAnoAnterior[index]?.total_nps || 0;
                                    return sum + +npsAnoAnterior;
                                },
                                0
                            );
                            const totalVlrFrete = pageData.reduce(
                                (sum, record) => sum + (+record.total_vlr_frete || 0),
                                0
                            );

                            return (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} align="right" />
                                    <Table.Summary.Cell index={1}>Totais:</Table.Summary.Cell>
                                    <Table.Summary.Cell index={2} align="right">
                                        <span style={{ color: 'blue' }}>
                                            R$ {totalVndBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={3} align="right">
                                        <span style={{ color: 'blue' }}>
                                            R$ {totalVlrDevolucoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={4} align="right">
                                        <span style={{ color: 'blue' }}>
                                            R$ {totalVndBrutaAnoAnterior.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={5} align="right">
                                        <span style={{ color: 'blue' }}>
                                            R$ {totalVlrDevolucoesAnoAnterior.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} align="right" />
                                    <Table.Summary.Cell index={0} align="right" />
                                    <Table.Summary.Cell index={0} align="right" />
                                    <Table.Summary.Cell index={0} align="right" />
                                    <Table.Summary.Cell index={4} align="right">
                                        <span style={{ color: 'blue' }}>
                                            {totalNps}
                                        </span>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={4} align="right">
                                        <span style={{ color: 'blue' }}>
                                            {totalNpsAnoAnterior}
                                        </span>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} align="right" />
                                    <Table.Summary.Cell index={5} align="right">
                                        <span style={{ color: 'blue' }}>
                                            R$ {totalVlrFrete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            );
                        }}

                    // defaultExpandAllRows // Adiciona esta propriedade para expandir todas as linhas
                    />
                </div>
            </Spin>
        </div>
    )
}