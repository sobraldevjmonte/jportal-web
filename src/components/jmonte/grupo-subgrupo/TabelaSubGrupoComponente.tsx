import { useContext, useEffect, useState } from "react"
import GrupoSubGrupoService from "../../../service/GrupoSubGrupoService";
import { UsuarioContext } from "../../../context/useContext";
import { Spin, Table, TableColumnsType, Typography } from "antd";


import { formatarMoedaComSimbolo } from "../../../utils/formatarValores"
import dayjs from "dayjs";

const serviceGrupoSubGrupo = new GrupoSubGrupoService()

interface VendasSubGruposType {
    key: number;
    grupo: string;
    codgrupo: string
    subgrupo: string
    total_nps: number
    total_lucrobruto: number
    total_vlr_tabela: number
    total_vnd_bruta: number
    total_vlr_frete: number
}

export default function TabelaSubGrupoComponente(props: any) {

    const [dados, setDados] = useState<VendasSubGruposType[]>([]);
    const [dadosAnoAnterior, setDadosAnoAnterior] = useState<VendasSubGruposType[]>([]);
    const [registros, setQuantidade] = useState(0);
    const [registrosAnoAnterior, setQuantidadeAnoAnterior] = useState(0);
    const [loading, setLoading] = useState(false);

    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { loja, setLoja } = useContext(UsuarioContext);
    const { idLoja, setIdLoja } = useContext(UsuarioContext);
    const { icomp, setIcomp } = useContext(UsuarioContext);

    let mesAnterior = '';
    const getLastMonth = () => {
        const lastMonth = dayjs().subtract(1, 'month');
        return lastMonth.format('MM'); // Retorna no formato "MM"
    };

    useEffect(() => {
        mesAnterior = getLastMonth();

        console.log(props.grupo)
        console.log(mesAnterior)
        listaCodigosGruposx()
    }, [props.grupo])


    async function listaCodigosGruposx() {
        try {
            setLoading(true);

            // Consultas paralelas para melhorar a performance
            const [rs, rsAnoAnterior] = await Promise.all([
                serviceGrupoSubGrupo.listarVendasGruposPorLoja(props.grupo, icomp, mesAnterior),
                serviceGrupoSubGrupo.listarVendasGruposPorLojaAnoAnterior(props.grupo, icomp, mesAnterior),
            ]);

            console.log('*********** rs.data.vendassubgrupos ************')
            // console.log(rsAnoAnterior);
            console.log('*********** rs.data.vendassubgrupos ************')

            setDados(rs.data.vendassubgrupos);
            setDadosAnoAnterior(rsAnoAnterior.data.vendassubgrupos);
            setQuantidade(rs.data.quantidade);
            setQuantidadeAnoAnterior(rsAnoAnterior.data.quantidade);
        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
        }
    }


    const tamFonte = '0.9rem';
    const corDestaque = '#000'
    const corDestaqueNegativo = 'red'

    const columns: TableColumnsType<VendasSubGruposType> = [

        {
            title: <div style={{ textAlign: 'center' }}>SubGrupo</div>, dataIndex: 'subgrupo', key: 'subgrupo', width: '220px',
            onHeaderCell: () => {

                return {
                    style: {
                        backgroundColor: '#ADD8E6', // Cor de fundo do cabeçalho
                        color: '#000',
                        padding: 0,
                        margin: 0,
                        height: '35px'
                    },
                };

            },
        },
        {
            title: <div style={{ textAlign: 'center' }}>Vnd Liq($) +Carradas</div>, dataIndex: 'total_vnd_bruta', key: 'total_vnd_bruta', align: 'right',
            render: (total_vnd_bruta, record) =>
                <span style={{ fontSize: tamFonte, color: record.total_vnd_bruta > 1000 ? corDestaque : '#000' }}>
                    {total_vnd_bruta !== null ? formatarMoedaComSimbolo(+total_vnd_bruta) : '0.00'}
                </span>,
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#ADD8E6', // Cor de fundo do cabeçalho
                        color: '#000',
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
                return (
                    <span style={{ fontSize: tamFonte }}>
                        {vendasAnoAnterior !== null ? formatarMoedaComSimbolo(+vendasAnoAnterior) : '0.00'}
                    </span>
                );
            },
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#ADD8E6', // Cor de fundo do cabeçalho
                        color: '#000',
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
                    <span style={{ fontSize: tamFonte, color: evolucaoVendas > 0 ? corDestaque : corDestaqueNegativo}}>
                        {evolucaoAnoAnterior !== 0 ? `${evolucaoVendas.toFixed(2)}%` : 'N/A'}
                    </span>
                );
            },
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#ADD8E6', // Cor de fundo do cabeçalho
                        color: '#000',
                        padding: 0,
                        margin: 0
                    },
                };
            },
        },
        {
            title: <div style={{ textAlign: 'center' }}>L.B.(%)</div>, dataIndex: 'total_lucrobruto', key: 'total_lucrobruto', width: '',
            render: (total_lucrobruto, record) =>
                <span style={{ fontSize: tamFonte, color: record.total_lucrobruto > 0 ? corDestaque : corDestaqueNegativo}}>
                    {total_lucrobruto !== null ? total_lucrobruto + '%' : '0.00%'}
                </span>,
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#ADD8E6', // Cor de fundo do cabeçalho
                        color: '#000',
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
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#ADD8E6', // Cor de fundo do cabeçalho
                        color: '#000',
                        padding: 0,
                        margin: 0
                    },
                };
            },
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
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#ADD8E6', // Cor de fundo do cabeçalho
                        color: '#000',
                        padding: 0,
                        margin: 0
                    },
                };
            },
        },
        {
            title: <div style={{ textAlign: 'center' }}>Qtde. Nps.</div>, dataIndex: 'total_nps', key: 'total_nps', width: '',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#ADD8E6', // Cor de fundo do cabeçalho
                        color: '#000',
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
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#ADD8E6', // Cor de fundo do cabeçalho
                        color: '#000',
                        padding: 0,
                        margin: 0
                    },
                };
            },
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
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#ADD8E6', // Cor de fundo do cabeçalho
                        color: '#000',
                        padding: 0,
                        margin: 0
                    },
                };
            },
        },
        {
            title: <div style={{ textAlign: 'center' }}>Taxa Entrega</div>, dataIndex: 'total_vlr_frete', key: 'total_vlr_frete', width: '',
            render: (total_vlr_frete, record) =>
                <span style={{ fontSize: tamFonte, color: record.total_vlr_frete > 1000 ? corDestaque : '#000' }}>
                    {total_vlr_frete !== null ? formatarMoedaComSimbolo(+total_vlr_frete) : '0.00'}
                </span>,
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: '#ADD8E6', // Cor de fundo do cabeçalho
                        color: '#000',
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
                        backgroundColor: '#ADD8E6', // Cor de fundo do cabeçalho
                        color: '#000',
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
                        backgroundColor: '#ADD8E6', // Cor de fundo do cabeçalho
                        color: '#000',
                        padding: 0,
                        margin: 0
                    },
                };
            },
        },
    ]

    return (
        <div>
            <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <Table
                    columns={columns}
                    dataSource={dados}
                    size="small"
                    rowKey={(record) => record.grupo}
                    bordered
                    title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>Registros/SubGrupo({registros}) </Typography>}
                    pagination={{
                        pageSize: 10, // Define o número de registros por página
                        showSizeChanger: true, // Permite ao usuário alterar o número de registros por página
                        pageSizeOptions: ['10', '20', '50', '100'], // Opções disponíveis para o seletor
                    }}
                // defaultExpandAllRows // Adiciona esta propriedade para expandir todas as linhas
                />
            </Spin>
        </div>
    )
}