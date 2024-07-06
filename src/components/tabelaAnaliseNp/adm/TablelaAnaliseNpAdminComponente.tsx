import Typography from "antd/es/typography/Typography";
import { useContext, useEffect, useState } from "react";

import { formatarMoeda } from '../../../utils/formatarValores';
import { UsuarioContext } from "../../../context/useContext";
import AnaliseNpService from "../../../service/AnaliseNpService";
import { FilterOutlined, SyncOutlined, TagOutlined } from "@ant-design/icons";
import { TableColumnsType, Button, Col, Row, Spin, Table, DatePicker, Select, Space, DatePickerProps, TableProps, Input } from "antd";
import TabelaAnaliseNpProdutosAdminComponent from "./TabelaAnaliseNpProdutosAdminComponent";
import Title from 'antd/es/typography/Title';
import RtService from "../../../service/RtService";
const service = new AnaliseNpService()

const serviceRt = new RtService()

interface AnaliseNpType {
    key: string;
    seq: string;
    chave: string;
    data: string;
    np: string;
    codvendedor: string;
    vendedor: string;
    autorizacao: string;
    tipoentrega: string;
    codcliente: string;
    cliente: string;
    indicador: string;
    codformapgto: string;
    plano: string;
    tabela: string;
    promocao: string;
    f10: string;
}

interface PropsAnaliseProdutos {
    idNp: number;
}
export default function TablelaAnaliseNpAdminComponente() {

    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
    const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { loja, setLoja } = useContext(UsuarioContext);
    const { idLoja, setIdLoja } = useContext(UsuarioContext);

    const [dados, setDados] = useState<AnaliseNpType[]>([])
    const [registros, setRegistros] = useState(0);
    
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState<FilterType[]>([]);
    const [filterLoading, setFilterLoading] = useState(false); // Estado para controlar o loading do filtro
    const [filterValue, setFilterValue] = useState<string>('');
    

    const [mes, setMes] = useState(0)
    const [ano, setAno] = useState(0)
    const [periodo, setPeriodo] = useState(0)
    const [lojas, setLojas] = useState<LojasType[]>([])
    const [lojaSelecionada, setLojaSelecionada] = useState(idLoja)
    const [lojaSelecionadaDescricao, setLojaSelecionadaDescricao] = useState(loja)

    //******************************** DATAS PERÍODO FIM ******************************************/
    //******************** mes/ano  *************************/
    const dataAtual = new Date();
    let mesAtual: number;
    let anoAtual: number;
    //****************************************************/

    interface LojasType {
        cod_loja_pre: number;
        codloja: string;
        descricao: string;
    }

    const [valor, setValor] = useState(0)
    useEffect(() => {
        mesAtual = dataAtual.getMonth();
        anoAtual = dataAtual.getFullYear();


        if (mesAtual == 1) {
            setMes(11)
            setAno(anoAtual - 1)
            listaNps(11, anoAtual - 1, lojaSelecionada)
            setLojaSelecionada(idLoja)
        } else {
            setMes(mesAtual - 1)
            setAno(anoAtual)
            listaNps(mesAtual - 1, anoAtual, lojaSelecionada)
            setLojaSelecionada(idLoja)
        }

        listaLojas()

        //setValor(formatarMoeda(2525522.25))
        // listaNps()
    }, [])

    interface FilterType {
        text: string;
        value: string;      
    }

    const listaNps = async (mes: number, ano: number, loja: string) => {
        setLoading(true);
        try {
            const rs = await service.listarNps(mes, ano, lojaSelecionada);
            setDados(rs.data.lista_nps);
            setRegistros(rs.data.registros)

            // Gerar filtros únicos para 'np'
            const uniqueNp: string[] = [...new Set((rs.data.lista_nps as AnaliseNpType[]).map(item => item.np))];
            const generatedFilters = uniqueNp.map(np => ({
                text: np,
                value: np,
            }));
            setFilters(generatedFilters);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateFilters = (listaNps: AnaliseNpType[]) => {
        const uniqueNp: string[] = [...new Set(listaNps.map(item => item.np))];
        return uniqueNp.map(np => ({
            text: np,
            value: np,
        }));
    };

    const handleFilter = () => {
        setFilterLoading(true); // Ativa o loading do filtro
        try {
            const filteredData = dados.filter(item => item.np.startsWith(filterValue));
            setDados(filteredData); // Atualiza os dados com o filtro aplicado
            setFilters(generateFilters(filteredData)); // Atualiza os filtros com base nos dados filtrados

        } catch (error) {
            console.error('Erro ao aplicar filtro:', error);
        } finally {
            setFilterLoading(false); // Desativa o loading do filtro
        }
    };


    const clearFilter = () => {
        setFilterLoading(true); // Ativa o loading do filtro
        try {
            setFilterValue(''); // Limpa o valor do filtro
            setDados(dados); // Restaura os dados originais
            setFilters(generateFilters(dados)); // Atualiza os filtros com base nos dados originais

        } catch (error) {
            console.error('Erro ao limpar filtro:', error);
        } finally {
            setFilterLoading(false); // Desativa o loading do filtro
        }
    };
    
    const tamFonte = '0.9rem';
    const colorContatou = 'blue'
    const corDestaque = '#000'

    const columns: TableColumnsType<AnaliseNpType> = [
        {
            title: 'Np', dataIndex: 'np', key: 'np',
            filterSearch: true,
            filters: filters,
            filterIcon: <FilterOutlined style={{ color: filterLoading ? '#1890ff' : undefined }} spin={filterLoading} />,
            onFilter: (value, record) => record.np.startsWith(value as string),
        },

        // {
        //     title: 'Np',
        //     dataIndex: 'np',        
        //     key: 'np',
        //     filterSearch: true,
        //     filters: filters,
        //     filterIcon: <FilterOutlined style={{ color: filterLoading ? '#1890ff' : undefined }} spin={filterLoading} onClick={handleFilter} />,
        //     onFilterDropdownVisibleChange: (visible: boolean) => {
        //         // Limpar filtro quando o dropdown de filtro é fechado
        //         if (!visible) {
        //             clearFilter();
        //         }
        //     },
        //     filterDropdown: () => (
        //         <div style={{ padding: 8 }}>
        //             <input
        //                 type="text"
        //                 value={filterValue}
        //                 onChange={(e) => setFilterValue(e.target.value)}
        //                 placeholder="Buscar NP"
        //                 style={{ width: 188, marginBottom: 8, display: 'block' }}
        //             />
        //             <button onClick={handleFilter} style={{ width: 90, marginRight: 8 }}>
        //                 Filtrar
        //             </button>
        //             <button onClick={clearFilter} style={{ width: 90 }}>
        //                 Limpar
        //             </button>
        //         </div>
        //     ),
        //     onFilter: (value, record) => record.np.startsWith(value as string),
        // },
      
        { title: 'DATA', dataIndex: 'data_formatada', key: 'data_formatada', },
        { title: 'F10', dataIndex: 'f10', key: 'f10', width: '400px' },
        {
            title: 'VENDEDOR', dataIndex: 'vendedor', key: 'vendedor',
            render: (text: string, record: any) =>
                <span style={{ fontSize: tamFonte }} >{record.vendedor} </span>
        },
        // <span  style={{ fontSize: tamFonte}} >({record.codvendedor}){record.vendedor} </span> },
        { title: 'AUTORIZADO', dataIndex: 'autorizacao', key: 'autorizacao' },
        { title: 'ENTREGA', dataIndex: 'tipoentrega', key: 'tipoentrega' },
        {
            title: 'CLIENTE', dataIndex: 'cliente', key: 'cliente',
            render: (text: string, record: any) =>
                <span style={{ fontSize: tamFonte }} >{record.cliente} </span>
        },
        { title: 'INDICADOR', dataIndex: 'indicador', key: 'indicador' },
        { title: 'PLANO', dataIndex: 'plano', key: 'plano' },
        { title: 'TAB', dataIndex: 'tabela', key: 'tabela' },
        { title: 'PROMO.', dataIndex: 'promocao', key: 'promocao' },
    ];

    const expandedRowRender = (record: any) => {
        let x = record.np
        return <TabelaAnaliseNpProdutosAdminComponent np={x} />;
    };

    const onChangeDatas: DatePickerProps['onChange'] = (date, dateString) => {

        let dataSplit = dateString.split('-');
        let mesF = dataSplit[1];
        let anoF = dataSplit[0];
        setMes(+mesF)
        setAno(+anoF);
    };

    async function listaLojas() {
        try {
            let rs = await serviceRt.listarLojas();
            console.log(rs)
            setLojas(rs.data.lojas)
        } catch (error) {
            console.error('Erro ao buscar lojas:', error);
        }
    }
    function selecionarLoja(e: any, lojax: any) {
        console.log(e);
        //console.log(loja);
        //const descricao = loja.data.descricao;

        if(e == 'sem'){
            console.log('------------- sem ----------------')
            setLojaSelecionada(idLoja)
            setLojaSelecionadaDescricao(loja)
        }else{
            setLojaSelecionada(e)
            setLojaSelecionadaDescricao(lojax.data.descricao)
        }
        
    }

    function filtrar() {
        let per = ano + '' + mes
        setPeriodo(+per)
        listaNps(mes, ano, loja)
    }

    const filtrosPesquisa = () => {
        return (
            <>
                <Row gutter={16} style={{ display: 'flex', padding: '10px' }}>
                    <Col>
                        <Title level={5}>Período:</Title>
                        <Space direction="vertical">
                            <DatePicker renderExtraFooter={() => 'extra footer'} picker="month" onChange={onChangeDatas} />
                        </Space>
                    </Col>
                    <Col >
                        <Title level={5}>Loja:</Title>
                        <Select id="selectLoja" onSelect={selecionarLoja} defaultValue="sem" style={{ width: 200 }}>
                            <Select.Option value="sem"> </Select.Option>
                            {lojas.map(loja => (
                                <Select.Option key={loja.codloja} value={loja.codloja} data={loja}>
                                    {loja.descricao}
                                </Select.Option>
                            ))}
                            {/* {lojas.map(loja => (
                                <Select.Option key={loja.descricao} value={loja.codloja}>
                                    {loja.descricao}
                                </Select.Option>
                            ))} */}
                        </Select>
                    </Col>
                    <Col>
                        <Title level={5}>F.Pgto:</Title>
                        <Select defaultValue="sem" style={{ width: 200 }} disabled>
                            <Select.Option value="sem"> </Select.Option>
                            <Select.Option value="RS">DINHEIRO</Select.Option>
                        </Select>
                    </Col>
                    <Col style={{ paddingTop: '60px' }}>
                        <Row style={{}}>
                            <Typography style={{ fontSize: '1.0rem' }}>FILTROS:<span> </span> </Typography>
                            <Typography style={{ fontSize: '1.0rem', paddingLeft: '8px' }}> Mês/Ano: </Typography>
                            <Typography style={{ fontSize: '1.0rem', paddingLeft: '8px', color: 'blue' }}> {mes}/{ano}</Typography>
                            <Typography style={{ fontSize: '1.0rem', paddingLeft: '8px' }}> Loja: </Typography>
                            <Typography style={{ fontSize: '1.0rem', color: 'blue', paddingLeft: '8px' }}> {lojaSelecionadaDescricao}({lojaSelecionada}) </Typography>
                        </Row>
                    </Col>
                    <Col style={{ paddingLeft: '30px', paddingTop: '58px'}}>
                        <Button title='Filtrar' style={{ backgroundColor: '#1E90FF', borderColor: '#1E90FF', color: '#fff', width: '150px'  }} icon={<FilterOutlined title='Filtrar' />} onClick={filtrar} >Filtrar</Button>
                    </Col>
                </Row>
            </>
        )
    }

    const onChange: TableProps<AnaliseNpType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
      };


    return (
        <>
            <div>
                <div>
                    <Button icon={<SyncOutlined />} onClick={() => listaNps(mes, ano, loja)} style={{ backgroundColor: '#2F4F4F', color: '#fff', borderColor: '#2F4F4F', marginRight: '5px', width: '130px' }} title="Atualizar todos os registros">Atualizar</Button>
                </div>
                <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div style={{ backgroundColor: '#fff' }}>
                        <Row style={{ display: 'flex', flexDirection: 'column' }}>
                            <Col>
                                <Typography style={{ fontSize: '24px' }}>
                                    Formulário RT JMonte
                                </Typography>
                            </Col>
                            <Col>
                                {filtrosPesquisa()}
                            </Col>
                        </Row>
                    </div>
                    <div style={{ padding: '10px', height: '800px', position: 'relative' }}>
                        <Table
                            onChange={onChange}
                            columns={columns}
                            dataSource={dados}
                            size="small"
                            rowKey={(record) => record.np}
                            bordered
                            title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>NPs 01/{mes}/{ano}({registros}) </Typography>}
                            expandedRowRender={expandedRowRender}
                        />
                    </div>
                </Spin>
            </div>
        </>
    )
}