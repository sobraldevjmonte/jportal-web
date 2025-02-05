
import { DollarCircleOutlined, FilterOutlined, SaveOutlined } from '@ant-design/icons';
import type { DatePickerProps, TableColumnsType } from 'antd';
import { Button, Col, DatePicker, Input, Row, Select, Space, Spin, Table, Tooltip, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import { useContext, useEffect, useState } from 'react';
import { UsuarioContext } from '../../../context/useContext';
import RtService from '../../../service/RtService';
import TabelaPreVendasComponent from './TabelaPreVendasComponent';

const service = new RtService()

interface IndicadoresType {
    key: string;
    cod_indica_pre: string;
    indicador: string;
    ptotal: number;
    vl_atual: number; //PEGANDO DA TABELA fprevendas_totais
    total_vlr_tabela: number;
    total_vlr_base_pp_lista: number;
    total_lb_percentual: number;
    valor_pp: number;
    percentual_repasse: string;
    teste: string;
    vlr_fator_financeiro: number;
    vlr_lb_fator_financeiro: number;
    vlr_diff_tab: number;
}

interface LojasType {
    cod_loja_pre: number;
    id_loja: string;
    descricao: string;
}

export default function TabelaIndicadoresComponent() {
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
    const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
    const { loja, setLoja } = useContext(UsuarioContext);
    const { idLoja, setIdLoja } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);

    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantidade, setQuantidade] = useState(0);

    const [periodo, setPeriodo] = useState(0)
    const [lojas, setLojas] = useState<LojasType[]>([])
    const [lojaSelecionada, setLojaSelecionada] = useState(idLoja)
    const [lojaSelecionadaDescricao, setLojaSelecionadaDescricao] = useState(loja)

    const [mes, setMes] = useState(0)
    const [ano, setAno] = useState(0)

    //******************************** DATAS PERÍODO FIM ******************************************/
    //******************** mes/ano  *************************/
    //****************************************************/

    useEffect(() => {
        const dataAtual = new Date();
        const mesAtual: number = dataAtual.getMonth() + 1; // getMonth() retorna de 0 a 11, então somamos 1
        const anoAtual: number = dataAtual.getFullYear();


        if (mesAtual == 1) {
            setMes(11)
            setAno(anoAtual - 1)
            listaIndicadores(11, anoAtual - 1, lojaSelecionada)
        } else {
            setMes(mesAtual - 1)
            setAno(anoAtual)
            listaIndicadores(mesAtual - 1, anoAtual, lojaSelecionada)
        }

        listaLojas()

        //setMes(mesAtual)
        //setAno(anoAtual)

    }, [])



    async function listaIndicadores(mes: number, ano: number, loja: string) {
        console.log(mes, ano)
        try {
            setLoading(true);
            let rs = await service.listarIndicadores(mes, ano, loja);
            setDados(rs.data.indicadores)
            setQuantidade(rs.data.quantidade)
        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
        }
    }

    async function listaLojas() {
        try {
            let rs = await service.listarLojas();
            console.log(rs)
            setLojas(rs.data.lojas)
        } catch (error) {
            console.error('Erro ao buscar lojas:', error);
        }
    }
    const handleInputChange = (e: any, key: string) => {
        // Lógica para lidar com a mudança nos campos de entrada
        console.log(`Novo valor para a linha ${key}: ${e.target.value}`);
        // Implemente a lógica conforme necessário
    };


    const columns: TableColumnsType<IndicadoresType> = [
        { title: 'Seq.', dataIndex: 'key', key: 'key' },
        { title: 'Pré Venda', dataIndex: 'cod_indica_pre', key: 'cod_indica_pre' },
        { title: 'Indicador', dataIndex: 'indicador', key: 'cod_indica_pre' },

        {
            title: 'Vlr Venda', dataIndex: 'vl_atual', key: 'cod_indica_pre', align: 'right',
            render: (text: string, record) => <span>
                R$ {record.ptotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })}
            </span>
        },

        { title: 'Vlr Tabela', dataIndex: 'total_vlr_tabela', key: 'cod_indica_pre', align: 'right', render: (text: string) => <span>R$ {text}</span> },
        { title: 'Vlr Base PP', dataIndex: 'total_vlr_base_pp_lista', key: 'cod_indica_pre', align: 'right', render: (text: string) => <span>R$ {text}</span> },
        { title: '(%)L.B.', dataIndex: 'total_lb_percentual', key: 'cod_indica_pre', align: 'right', render: (text: string) => <span >{text}</span> },
        { title: '(%)FatorFin.', dataIndex: 'vlr_fator_financeiro', key: 'vlr_fator_financeiro', align: 'right', render: (text: string) => <span >{text}</span> },
        { title: '(%)LB.Fator', dataIndex: 'vlr_lb_fator_financeiro', key: 'vlr_lb_fator_financeiro', align: 'right', render: (text: string) => <span >{text}</span> },
        { title: '(%)Diff.Tab.', dataIndex: 'vlr_diff_tab', key: 'vlr_diff_tab', align: 'right', render: (text: string) => <span >{text}</span> },
        {
            title: '% PP',
            key: 'percentual_repasse',
            dataIndex: 'percentual_repasse',
            align: 'right',
            width: '150px',
            render: (text, record) => (
                <Input
                    width='100%'
                    value={record.percentual_repasse}
                    onChange={e => alterarValorPerc(e.target.value, record.key)}
                    style={{ border: '0px none', outline: 'none', backgroundColor: 'transparent', textAlign: 'right' }}
                    tabIndex={1}

                />
            ),
        },
        {
            title: 'VL PP',
            key: 'valor_pp',
            align: 'right',
            width: '120px',
            render: (text, record) => (
                <Input
                    width='100%'
                    value={record.valor_pp}
                    style={{ border: '0px none', outline: 'none', backgroundColor: 'transparent', textAlign: 'right' }}
                    tabIndex={1}
                    onChange={e => alterarValorPp(e.target.value, record.key)}
                />
            ),
        },
        {
            title: 'Ações',
            key: 'cod_indica_pre',
            align: 'right',
            render: (text, record) => (
                <>
                    <Row>
                        {(nivelUsuario === 1 || nivelUsuario === 11) && (
                            <>
                                <Button
                                    size="middle"
                                    style={{ marginLeft: '2px', marginRight: '2px', backgroundColor: '#fff', color: '#0000CD' }}
                                    icon={<SaveOutlined />}
                                    title="Salvar"
                                />
                                <Button
                                    size="middle"
                                    title="Pagar"
                                    style={{ backgroundColor: '#fff', color: '#D2691E' }}
                                    icon={<DollarCircleOutlined />}
                                />
                            </>
                        )}
                    </Row>

                </>
            ),
        },
    ];
    //***************** Inserindo Componente TabelaPreVendas  ******************/
    const expandedRowRender = (record: any) => {
        let x = record.cod_indica_pre
        return <TabelaPreVendasComponent idIndicador={x} mes={mes} ano={ano} loja={lojaSelecionada} />;
    };

    const alterarValorPp = (value: any, key: any) => {
        let novaStr = value.replace(",", ".");
        const newData: any = dados.map((item: any) => {
            if (item.key === key) {
                var x = (novaStr * 100) / item.vl_atual
                const x2 = x.toFixed(2);
                return { ...item, percentual_repasse: x2, valor_pp: novaStr };
            }
            return item;
        });
        setDados(newData);
    };
    const alterarValorPerc = (value: any, key: any) => {
        let novaStr = value.replace(",", ".");
        const newData: any = dados.map((item: any) => {
            if (item.key === key) {
                var x = (item.total_vlr_base_pp_lista * novaStr) / 100
                const x2 = x.toFixed(2);
                return { ...item, valor_pp: x2, percentual_repasse: novaStr };
            }
            return item;
        });
        setDados(newData);
    };

    const onChangeDatas: DatePickerProps['onChange'] = (date, dateString) => {

        let dataSplit = dateString.split('-');
        let mesF = dataSplit[1];
        let anoF = dataSplit[0];
        setMes(+mesF)
        setAno(+anoF);
    };


    function definePeriodo() {

    }

    function selecionarLoja(e: any, loja: any) {
        console.log(e);
        console.log(loja.data.descricao);
        setLojaSelecionada(e)
        setLojaSelecionadaDescricao(loja.data.descricao)
    }

    function filtrar() {
        let per = ano + '' + mes
        setPeriodo(+per)
        listaIndicadores(mes, ano, lojaSelecionada)
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
                                <Select.Option key={loja.id_loja} value={loja.id_loja} data={loja}>
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
                            <Typography style={{ fontSize: '1.0rem' }}>FILTROS: </Typography>
                            <Typography style={{ fontSize: '1.0rem' }}> Mês/Ano: </Typography>
                            <Typography style={{ fontSize: '1.0rem', color: 'blue' }}> {mes}/{ano}</Typography>
                            <Typography style={{ fontSize: '1.0rem' }}> Loja: </Typography>
                            <Typography style={{ fontSize: '1.0rem', color: 'blue' }}> {lojaSelecionadaDescricao}({lojaSelecionada}) </Typography>
                        </Row>
                    </Col>
                    <Col style={{ paddingLeft: '30px', paddingTop: '60px' }}>
                        {/* <Button title='Filtrar' style={{ backgroundColor: 'blue', color: '#fff' }} icon={<FilterOutlined title='Filtrar' />} onClick={filtrar} /> */}
                        {/* <Tooltip title="Filtrar" color="#000">
                            <Button
                                type="primary"
                                onClick={() => filtrar()}
                                icon={<FilterOutlined />}
                                size="small"
                                style={{ width: 90, marginRight: 8 }}
                                title='Filtrar'
                            >
                                Filtrar
                            </Button>
                        </Tooltip> */}
                        <Tooltip title="Filtrar baseado nos filtros." placement="bottomLeft">
                            <Button style={{ backgroundColor: '#4682B4', borderColor: '#4682B4', color: '#fff', width: '150px' }} icon={<FilterOutlined title='Filtrar' />} onClick={filtrar} >Filtrar</Button>
                        </Tooltip>
                    </Col>
                </Row>
            </>
        )
    }

    return (
        <>
            <div style={{ padding: '10px' }}>
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
                    <div style={{ padding: '10px', position: 'relative' }}>
                        <Table
                            columns={columns}
                            dataSource={dados}
                            size="small"
                            expandedRowRender={expandedRowRender}
                            rowKey={(record) => record.cod_indica_pre}
                            bordered
                            title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>Indicadores({quantidade})</Typography>}
                        />
                    </div>
                </Spin>
            </div>
        </>
    )
};

