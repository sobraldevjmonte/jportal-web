import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../context/useContext";
import { Button, Col, DatePicker, DatePickerProps, Row, Select, Space, Spin, Table, TableColumnsType, Typography } from "antd";
import { DownloadOutlined, FilterOutlined, SyncOutlined } from "@ant-design/icons";
import Title from 'antd/es/typography/Title';
import RtService from "../service/RtService";
import ProfissionaisService from "../service/ProfissonaisService";

const serviceProf = new ProfissionaisService()

const serviceRt = new RtService()

interface PropsProfJMonte {
    key: number;
    id_vendas: number;
    idNp: number;
    numero_venda: number;
    numero_np: number;
    data_venda: string;
    data_lancamento: string;
    descricao_loja: string;
    data_np: string;
    valor_np: number;
    profissional: string;
    status: boolean;
    total_pontos: number;
    imagem: string;
    premiado: boolean;
    comissao: number;
}

interface LojasType {
    cod_loja_pre: number;
    codloja: string;
    descricao: string;
}
export default function AdminProjJmonte(props: any) {
    const { loja, setLoja } = useContext(UsuarioContext);
    const { idLoja, setIdLoja } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);

    const [mes, setMes] = useState(0)
    const [ano, setAno] = useState(0)

    const [dados, setDados] = useState([]);
    const [registros, setQuantidade] = useState(0);
    const [loading, setLoading] = useState(false);

    const [periodo, setPeriodo] = useState(0)
    const [lojas, setLojas] = useState<LojasType[]>([])
    const [lojaSelecionada, setLojaSelecionada] = useState(idLoja)
    const [lojaSelecionadaDescricao, setLojaSelecionadaDescricao] = useState(loja)

    //******************************** DATAS PERÍODO FIM ******************************************/
    //******************** mes/ano  *************************/
    const dataAtual = new Date();
    let mesAtual: number;
    let anoAtual: number;

    const pathImagem = '/anexos';
    //****************************************************/

    useEffect(() => {
        mesAtual = dataAtual.getMonth();
        anoAtual = dataAtual.getFullYear();

        if (mesAtual == 1) {
            setMes(11)
            setAno(anoAtual - 1)
            listaDados(11, anoAtual - 1, lojaSelecionada)
            setLojaSelecionada(idLoja)
        } else {
            setMes(mesAtual - 1)
            setAno(anoAtual)
            listaDados(mesAtual - 1, anoAtual, lojaSelecionada)
            setLojaSelecionada(idLoja)
        }

        listaLojas()
        listaPedidos()
    }, [])

    async function listaLojas() {
        try {
            let rs = await serviceRt.listarLojas();
            //console.log(rs)
            setLojas(rs.data.lojas)
        } catch (error) {
            console.error('Erro ao buscar lojas:', error);
        }
    }

    async function listaPedidos() {
        try {
            setLoading(true);
            let rs = await serviceProf.listarPedidos();
            console.log(rs)
            
            setDados(rs.data.lista_pedidos);
            setQuantidade(rs.data.registros);
        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
        }
    }

    const tamFonte = '0.9rem';
    const colorContatou = 'blue'
    const corDestaque = '#000'
    const columns: TableColumnsType<PropsProfJMonte> = [
        {
            title: 'Nº Passado', dataIndex: 'numero_venda', key: 'numero_venda', width: '90px', align: 'right',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Data', dataIndex: 'data_lancamento', key: 'data_lancamento',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Loja', dataIndex: 'descricao_loja', key: 'descricao_loja',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Profissional', dataIndex: 'profissional', key: 'profissional', width: '300px',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Imagem', dataIndex: 'imagem', key: 'imagem', align: 'center',
            render: (text, record) => (
                <a href={record.imagem} download title="Imagem fornecida pelo profissional.">
                    <DownloadOutlined style={{ fontSize: '16px' }} />
                </a>
            ),
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Número NP', dataIndex: 'numero_np', key: 'numero_np', width: '120px',
            render: (text) => (
                <div>
                  {Number(text) > 0 ? text : null}
                </div>
              ),
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'yellow', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Data', dataIndex: 'data_np', key: 'data_np',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'yellow', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Valor', dataIndex: 'valor_np', key: 'valor_np', align: 'right',
            render: (text: string, record: any) => 
                <span style={{ fontSize: tamFonte }} >
                    {record.comissao > 0 ? parseFloat(record.valor_np).toFixed(2) : '0.00'}
                </span>,
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'yellow', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Pontos', dataIndex: 'total_pontos', key: 'total_pontos', align: 'right', width: '80px',
            render: (text: string, record: any) => 
                <span style={{ fontSize: tamFonte }} >
                    {record.comissao > 0 ? parseFloat(record.total_pontos).toFixed(2) : '0.00'}
                </span>,
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'yellow', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Comissão', dataIndex: 'comissao', key: 'comissao', align: 'right',
            render: (text: string, record: any) =>
            <span style={{ fontSize: tamFonte }} >
               {record.comissao > 0 ? parseFloat(record.comissao).toFixed(2) : '0.00'}
            </span>,
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'yellow', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Pago?', dataIndex: 'premiado', key: 'premiado', align: 'right',
            render: (text: string, record: any) => 
                <span style={{ fontSize: tamFonte }} >
                    {record.premiado ? 'S':'N'}
                </span>,
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'yellow', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Status', dataIndex: 'status', key: 'status', align: 'right',
            render: (text: string, record: any) => 
                <span style={{ fontSize: tamFonte }} >
                    {record.status === 'P' ? 'PENDENTE': record.status === 'R' ? 'REJEITADO' : 'APROVADO'}
                </span>,
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'yellow', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Opções',
            key: 'opcoes',
            align: 'center',
            width: '180px',
            render: (text, record) => (
                <span>
                    <Button type="primary" style={{ marginRight: 8 }}>Aprovar</Button>
                    <Button >Pagar</Button>
                </span>
            ),

            onHeaderCell: () => {
                return {
                    colSpan: 2,
                    style: {
                        backgroundColor: 'silver', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
    ];

    function selecionarLoja(e: any, loja: any) {
        //console.log(e);
        //console.log(loja.data.descricao);
        //const descricao = loja.data.descricao;
        setLojaSelecionada(e)
        setLojaSelecionadaDescricao(loja.data.descricao)
    }
    const onChangeDatas: DatePickerProps['onChange'] = (date, dateString) => {

        let dataSplit = dateString.split('-');
        let mesF = dataSplit[1];
        let anoF = dataSplit[0];
        setMes(+mesF)
        setAno(+anoF);
    };

    async function listaDados(mes: number, ano: number, loja: string) {
        console.log(mes, ano)
        try {
            setLoading(true);
        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
        }
    }


    function filtrar() {
        let per = ano + '' + mes
        setPeriodo(+per)
        listaDados(mes, ano, lojaSelecionada)
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
                    <Col style={{ paddingLeft: '30px', paddingTop: '58px' }}>
                        <Button title='Filtrar' style={{ backgroundColor: '#1E90FF', borderColor: '#1E90FF', color: '#fff', width: '150px' }} icon={<FilterOutlined title='Filtrar' />} onClick={filtrar} >Filtrar</Button>
                    </Col>
                </Row>
            </>
        )
    }

    return (
        <div style={{ backgroundColor: '#fff' }}>
            <div>
                <Button icon={<SyncOutlined />} onClick={() => listaPedidos()} style={{ backgroundColor: '#2F4F4F', color: '#fff', borderColor: '#2F4F4F', marginRight: '5px', width: '130px' }} title="Atualizar todos os registros">Atualizar</Button>
            </div>
            <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div style={{ backgroundColor: '#fff' }}>
                    <Row style={{ display: 'flex', flexDirection: 'column' }}>
                        <Col>
                            <Typography style={{ fontSize: '24px' }}>
                                Pedidos Profissionais
                            </Typography>
                        </Col>
                        <Col>
                            {filtrosPesquisa()}
                        </Col>
                    </Row>
                </div>
                <div style={{ padding: '', position: 'relative', paddingTop: '20px', paddingRight: '30px' }}>
                    <Table
                        columns={columns}
                        dataSource={dados}
                        //dataSource={[...dados, totalRow]}
                        size="small"
                        rowKey={(record) => record.key}
                        bordered
                        title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>NP/NFe/NFCe{props.idNp}({registros})</Typography>}
                        pagination={{
                            //defaultPageSize: 5, // Define o tamanho padrão da página
                            showSizeChanger: true, // Exibe o seletor de tamanho da página
                            pageSizeOptions: ['10', '20', '30'], // Opções de tamanho de página disponíveis
                            showQuickJumper: true, // Exibe o campo de navegação rápida
                            showTotal: (total, range) => `Mostrando ${range[0]}-${range[1]} de ${total} produtos`, // Exibe informações sobre o total de registros
                        }}
                    />
                </div>
            </Spin>
        </div>
    )
}