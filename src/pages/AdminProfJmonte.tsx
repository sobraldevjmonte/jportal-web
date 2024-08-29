import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../context/useContext";
import { Button, Col, DatePicker, DatePickerProps, Row, Select, Space, Spin, Table, TableColumnsType, Typography, Input, Tooltip } from "antd";
import { CheckOutlined, CloseCircleOutlined, DollarCircleOutlined, DownloadOutlined, FilterOutlined, SaveOutlined, SyncOutlined, TrophyOutlined } from "@ant-design/icons";
import Title from 'antd/es/typography/Title';
import RtService from "../service/RtService";
import ProfissionaisService from "../service/ProfissonaisService";
import SelecaoNpModal from "./modal_np";

import { Notificacao } from '../components/notificacoes/notification';

const serviceProf = new ProfissionaisService()

const serviceRt = new RtService()

interface PropsProfJMonte {
    key: number;
    id_vendas: number;
    id_usuario: number;
    id_np: number;
    numero_venda: number;
    numero_np: number;
    data_venda: string;
    data_lancamento: string;
    descricao_loja: string;
    id_loja: number;
    data_np: string;
    valor_np: number;
    profissional: string;
    status: string;
    total_pontos: number;
    imagem: string;
    premiado: boolean;
    aberto: string;
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

    const [dados, setDados] = useState<PropsProfJMonte[]>([]);
    const [registros, setQuantidade] = useState(0);
    const [loading, setLoading] = useState(false);

    const [periodo, setPeriodo] = useState(0)
    const [lojas, setLojas] = useState<LojasType[]>([])
    const [lojaSelecionada, setLojaSelecionada] = useState(idLoja)
    const [lojaSelecionadaDescricao, setLojaSelecionadaDescricao] = useState(loja)

    const [numeroNp, setNumeroNp] = useState(0)

    //******************************** DATAS PERÍODO FIM ******************************************/
    //******************** mes/ano  *************************/
    const dataAtual = new Date();
    let mesAtual: number;
    let anoAtual: number;
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

    const [idNpAtualizar, setIdNpAtualizar] = useState(0)
    const [notificacao, setNotificacao] = useState<{ message: string, description: string } | null>(null);

    async function buscarNpx(numero_np: any, id_np: any, id_loja: number) {
        setIdNpAtualizar(id_np)
        console.log(numero_np, id_np, id_loja);
        // Redefinir npList antes de buscar novos dados
        setNpList([]);

        if (numero_np > 0) {
            try {
                setLoading(true);
                let rs = await serviceProf.buscarNp(numero_np);
                console.log('************* resultado busca np ****************');
               
                if (rs.data.lista_nps.length > 1) {
                    console.log('******************** array maior que 1 *****************');
                    console.log(rs.data.lista_nps)
                    console.log('******************** array maior que 1 *****************');

                    setNpList(rs.data.lista_nps);
                    setModalVisible(true);

                } else if (rs.data.lista_nps.length === 1) {
                    if (rs.statusCode == 200) {
                        console.log('******************** array maior que 1 *****************');
                        console.log(rs.data.lista_nps)
                        console.log('******************** array maior que 1 *****************');
                        const dataEncontrada = rs.data.lista_nps[0].data_np || '';
                        const valorEncontrado = rs.data.lista_nps[0].vlr_total || '';
                        const vlr_pp = rs.data.lista_nps[0].vlr_pp || '';
                        const idLoja = rs.data.lista_nps[0].codloja || '';
                        const descricaoLoja = rs.data.lista_nps[0].descricao_loja || '';

                        setDados(prevDados =>
                            prevDados.map(record =>
                                record.id_vendas === id_np
                                    ? {
                                        ...record,
                                        numero_np: numero_np,
                                        data_np: dataEncontrada,
                                        valor_np: valorEncontrado,
                                        total_pontos: vlr_pp,
                                        id_loja: idLoja,
                                        descricao_loja: descricaoLoja,
                                    }
                                    : record
                            )
                        );
                        let rsx = await serviceProf.salvarNp(dataEncontrada, +valorEncontrado, +vlr_pp, idNpAtualizar, numero_np, idLoja);
                        console.log(rsx);
                    }
                }
               
            } catch (error) {
                console.error('Erro ao buscar indicadores:', error);
                setNotificacao({ message: 'Atenção!', description: 'NP não encontrada.' });
                    setTimeout(() => setNotificacao(null), 3000);
            } finally {
                setLoading(false);
            }
        }
    }

    //********************** MODAL SELECIONAR NP **********************/
    interface NpType {
        id_np: number;
        numero_np: string;
        data_np: string;
        vlr_total: string;
        total_pontos: string;
        id_loja: number;
        descricao_loja: string;
    }
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [isManualBlur, setIsManualBlur] = useState(false);
    const [npList, setNpList] = useState<NpType[]>([]);
    const [selectedNp, setSelectedNp] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, record: PropsProfJMonte) => {
        const newNumeroNp = e.target.value;

        setDados(prevDados =>
            prevDados.map(rec =>
                rec.id_vendas === record.id_vendas
                    ? { ...rec, numero_np: Number(newNumeroNp) }
                    : rec
            )
        );
        setIsManualBlur(true);  // Indica que o blur foi causado manualmente
    };

    const handleBlur = (newNumeroNp: number, record: PropsProfJMonte) => {
        if (!modalVisible && isManualBlur) {  // Verifica se o modal está visível
            buscarNpx(newNumeroNp, record.id_vendas, record.id_loja);
        }
        setIsManualBlur(false);  // Reseta o estado para o próximo blur
    };

    const handleSelectNp = async (np: any) => {
        // Recebe o NP selecionado do componente filho
        setSelectedNp(np.numero_np);
        console.log('Objeto retornado:', np);

        setDados(prevDados =>
            prevDados.map(record =>
                record.id_vendas === np.id_np
                    ? {
                        ...record,
                        id_np: np.id_np,
                        numero_np: np.numero_np,
                        data_np: np.data_np,
                        valor_np: np.vlr_total,
                        total_pontos: np.vlr_pp,
                        id_loja: np.codloja,
                        descricao_loja: np.descricao_loja,
                    }
                    : record
            )
        );
        let rsx = await serviceProf.salvarNp(np.data_np, +np.vlr_total, +np.vlr_pp, idNpAtualizar, np.numero_np, np.codloja);
        listaPedidos()

        // Chama a função no componente pai que processa o NP selecionado
        processarNpSelecionado(np.numero_np);

        setModalVisible(false);
    };

    const processarNpSelecionado = (npSelecionado: string) => {
        console.log('Processando NP selecionado:', npSelecionado);
        // Lógica para processar a NP selecionada
    };

    const modalNp = () => {
        return (
            <SelecaoNpModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                npList={npList}
                onSelect={handleSelectNp}
            />
        );
    };

    //********************** MODAL SELECIONAR NP **********************/



    async function salvarRegistro(record: PropsProfJMonte) {
        try {
            setLoading(true);
            // let rs = await serviceProf.salvarNp(record);

        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
        }
    }

    async function aprovarPedidox(record: PropsProfJMonte) {
        try {
            setLoading(true);
            let rs = await serviceProf.aprovarPedido(record.id_vendas, record.id_usuario, record.total_pontos);

            if (rs.statusCode === 200) {
                setDados(prevDados =>
                    prevDados.map(item =>
                        item.id_vendas === record.id_vendas ? { ...item, status: 'A' } : item
                    )
                );
            }

        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
            // listaPedidos()
        }
    }
    async function rejeitarPedidox(record: PropsProfJMonte) {
        try {
            setLoading(true);
            let rs = await serviceProf.rejeitarPedido(record.id_vendas);

            if (rs.statusCode === 200) {
                setDados(prevDados =>
                    prevDados.map(item =>
                        item.id_vendas === record.id_vendas ? { ...item, status: 'R' } : item
                    )
                );
            }

        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
            // listaPedidos()
        }
    }




    const tamFonte = '0.9rem';
    const colorContatou = 'blue'
    const corDestaque = '#000'
    const columns: TableColumnsType<PropsProfJMonte> = [
        {
            title: 'Nº', dataIndex: 'numero_venda', key: 'numero_venda', width: '90px', align: 'right',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Data', dataIndex: 'data_lancamento', width: '80px',
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
            title: 'Imagem', dataIndex: 'imagem', key: 'imagem', align: 'center', width: '50px',
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
            title: 'Número NP',
            dataIndex: 'numero_np',
            key: 'numero_np',
            width: '120px',
            render: (text: number, record: PropsProfJMonte) => (
                <div>
                    <Input

                        readOnly={record.status != 'P'}
                        value={record.numero_np}
                        width="100%"
                        tabIndex={1}
                        type="number"
                        style={{
                            border: '0px none',
                            outline: 'none',
                            backgroundColor: 'transparent',
                            textAlign: 'right',
                            // Estilos para esconder as setas do número
                            appearance: 'textfield',
                            // Para Webkit (Chrome, Safari)
                            WebkitAppearance: 'none',
                            // Para Firefox
                            MozAppearance: 'textfield',
                        }}

                        onChange={e => handleInputChange(e, record)}
                        onBlur={() => handleBlur(record.numero_np, record)}
                    />
                </div>
            ),
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'yellow',
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
                    {record.valor_np > 0 ? parseFloat(record.valor_np).toFixed(2) : '0.00'}
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
                    {record.total_pontos > 0 ? parseFloat(record.total_pontos).toFixed(2) : '0.00'}
                </span>,
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'yellow', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        // {
        //     title: 'Troca?', dataIndex: 'aberto', key: 'aberto', 
        //     render: (text: string, record: any) =>
        //         <span style={{ fontSize: tamFonte }} >
        //             {record.aberto === 'S' ? '' : record.aberto === 'X' ? 'SOLICITADO' : 'PREMIADO'}
        //         </span>,
        //     onHeaderCell: () => {
        //         return {
        //             style: {
        //                 backgroundColor: 'yellow', // Cor de fundo do cabeçalho
        //             },
        //         };
        //     },
        // },
        {
            title: 'Status', dataIndex: 'status', key: 'status',
            render: (text: string, record: any) =>
                <span style={{ fontSize: tamFonte }} >
                    {record.status === 'P' ? 'PENDENTE' : record.status === 'R' ? 'REJEITADO' : 'APROVADO'}
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
            width: '120px',
            render: (text, record) => (
                <span>
                    {/* <Tooltip title="Salvar" color="#DAA520">
                        <Button icon={<SaveOutlined />} type="primary" style={{ marginRight: 2, marginBottom: 2, backgroundColor: '#DAA520' }} title="Salvar" onClick={() => salvarRegistro(record)} disabled />
                    </Tooltip> */}

                    <Tooltip title="Aprovar" color="#000">
                        <Button icon={<CheckOutlined />} type="primary" style={{ marginRight: 2, marginBottom: 2, backgroundColor: '' }} disabled={record.status == 'A' || record.status == 'R' || record.valor_np == null} onClick={() => aprovarPedidox(record)} />
                    </Tooltip>
                    <Tooltip title="Rejeitar" color="#000">
                        <Button icon={<CloseCircleOutlined />} type="primary" style={{ marginRight: 2, marginBottom: 2, backgroundColor: 'red' }} disabled={record.status == 'A' || record.status == 'R'} onClick={() => rejeitarPedidox(record)} />
                    </Tooltip>
                    {/* <Tooltip title="Premiar" color="blue">
                        <Button icon={<TrophyOutlined />} type="primary" style={{ marginRight: 2, marginBottom: 2, }} title="Premiar" disabled={(record.aberto == 'S' || record.aberto === 'P') || (record.status == 'P' || record.status == 'R')}  />
                    </Tooltip> */}
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
                    {/* <Col>
                        <Title level={5}>F.Pgto:</Title>
                        <Select defaultValue="sem" style={{ width: 200 }} disabled>
                            <Select.Option value="sem"> </Select.Option>
                            <Select.Option value="RS">DINHEIRO</Select.Option>
                        </Select>
                    </Col> */}
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
            {notificacao && <Notificacao message={notificacao.message} description={notificacao.description} />}
            {modalNp()}
            <div>
                <Button icon={<SyncOutlined />} onClick={() => listaPedidos()} style={{ backgroundColor: '#2F4F4F', color: '#fff', borderColor: '#2F4F4F', marginRight: '5px', width: '130px' }} title="Atualizar todos os registros">Atualizar</Button>
            </div>
            <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div style={{ backgroundColor: '#fff' }}>
                    <Row style={{ display: 'flex', flexDirection: 'column' }}>
                        <Col>
                            <Typography style={{ fontSize: '24px' }}>
                                Pedidos Profissionais(J Monte Center)
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
                        title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>NP/NFe/NFCe{props.id_np}({registros})</Typography>}
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