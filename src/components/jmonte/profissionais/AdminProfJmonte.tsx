import { CheckOutlined, CloseCircleOutlined, DownloadOutlined, FilterOutlined, PrinterFilled, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, DatePickerProps, Input, Row, Select, Space, Spin, Table, TableColumnsType, Tooltip, Typography } from "antd";
import Title from 'antd/es/typography/Title';
import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../../../context/useContext";
import SelecaoNpModal from "../../../pages/modal_np";
import ProfissionaisService from "../../../service/ProfissonaisService";
import RtService from "../../../service/RtService";

import { Notificacao } from '../notificacoes/notification';
import ModalJustificativaRejeicao from "./ModalJustificativaRejeitar";

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
    motivo_rejeicao: string;
}

interface LojasType {
    cod_loja_pre: number;
    id_loja: string;
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
    const [lojaSelecionada, setLojaSelecionada] = useState(0)
    const [lojaSelecionadaDescricao, setLojaSelecionadaDescricao] = useState(loja)

    const [numeroNp, setNumeroNp] = useState(0)

    //******************************** DATAS PERÍODO FIM ******************************************/
    //******************** mes/ano  *************************/
    const dataAtual = new Date();
    let mesAtual: number;
    let anoAtual: number;
    //****************************************************/

    useEffect(() => {
        mesAtual = dataAtual.getMonth() + 1;
        anoAtual = dataAtual.getFullYear();

        setMes(mesAtual)
        setAno(anoAtual)

        setLojaSelecionada(0)

        listaLojas()
        listaPedidos()
    }, [])

    async function listaLojas() {
        try {
            let rs = await serviceRt.listarLojas();
            setLojas(rs.data.lojas)
        } catch (error) {
            console.error('Erro ao buscar lojas:', error);
        }
    }

    async function listaPedidos() {
        try {
            setLoading(true);
            let rs = await serviceProf.listarPedidos(mes, ano, lojaSelecionada);

            setDados(rs.data.lista_pedidos);
            setQuantidade(rs.data.registros);
        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
        }
    }

    async function imprimirTodosPedidosx() {
        try {
            setLoading(true);
            const response = await serviceProf.imprimirTodosPedidos();

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `pedidos_${mes}_${ano}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            setNotificacao({ message: 'Atenção!', description: 'Nenhum registro encontrado.' });
        } finally {
            setLoading(false);
        }
    }
    async function imprimirPedidosx() {
        try {
            setLoading(true);
            const response = await serviceProf.imprimirPedidos(mes, ano, lojaSelecionada);

            if (response.status === 200) {
                if (response.data.size === 0) { // Verifica se o PDF está vazio
                    alert('Sem dados para gerar o PDF');
                    return; // Interrompe o fluxo se não houver dados
                }

                // Criar um link de download para o PDF
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `pedidos_${mes}_${ano}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove(); // Remove o link após o clique
            } else {
                alert('Nenhum registro para o período ' + mes + "/" + ano);
                setNotificacao({ message: 'Atenção!', description: 'Nenhum registro para o período ' + mes + "/" + ano });
            }

        } catch (error) {
            alert('Nenhum registro para o período ' + mes + "/" + ano);
            setNotificacao({ message: 'Atenção!', description: 'Nenhum registro para o período ' + mes + "/" + ano });
        } finally {
            setLoading(false);
        }
    }

    const [idNpAtualizar, setIdNpAtualizar] = useState(0)
    const [notificacao, setNotificacao] = useState<{ message: string, description: string } | null>(null);

    async function buscarNpx(numero_np: any, id_np: any, id_loja: number) {
        setIdNpAtualizar(id_np)
        setNpList([]);

        if (numero_np > 0) {
            try {
                setLoading(true);
                let rs = await serviceProf.buscarNp(numero_np);
                console.log(rs)

                if (rs.data.lista_nps.length > 1) {
                    setNpList(rs.data.lista_nps);
                    setModalVisible(true);

                } else if (rs.data.lista_nps.length === 1) {
                    if (rs.statusCode === 200) {
                        let dataEncontrada = rs.data.lista_nps[0].data_np || '';
                        let valorEncontrado = rs.data.lista_nps[0].vlr_total || '';
                        let vlr_pp = rs.data.lista_nps[0].vlr_pp || '';
                        let idLoja = rs.data.lista_nps[0].codloja || '';
                        let descricaoLoja = rs.data.lista_nps[0].descricao_loja || '';

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
                        let rsx = await serviceProf.salvarNp(dataEncontrada, +valorEncontrado, +vlr_pp, id_np, numero_np, idLoja);
                        console.log(rsx);
                    }
                }

            } catch (error) {
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
            title: 'Profissional',
            dataIndex: 'profissional',
            key: 'profissional',
            width: '300px',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder={`Filtrar Profissional`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value.toUpperCase()] : [])}
                        onPressEnter={() => confirm()}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Filtrar
                    </Button>
                    <Button onClick={() => clearFilters && clearFilters()} size="small" style={{ width: 90 }}>
                        Resetar
                    </Button>
                </div>
            ),
            filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => {
                return record.profissional.toUpperCase().includes(value.toString());
            },
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
            width: '130px',
            render: (text: number, record: PropsProfJMonte) => (
                <div>
                    <Input

                        readOnly={record.status !== 'P'}
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
                        <Button icon={<CheckOutlined />} type="primary" style={{ marginRight: 2, marginBottom: 2, backgroundColor: '' }} disabled={record.status === 'A' || record.status === 'R' || record.valor_np === null} onClick={() => aprovarPedidox(record)} />
                    </Tooltip>
                    <Tooltip title="Rejeitar" color="#000">
                        <Button icon={<CloseCircleOutlined />} type="primary" style={{ marginRight: 2, marginBottom: 2, backgroundColor: 'red' }} disabled={record.status === 'A' || record.status === 'R'} onClick={() => abrirModalRejeitarPedido(record)} />
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

    // async function listaDados(mes: number, ano: number, loja: number) {
    //     console.log(mes, ano)
    //     try {
    //         setLoading(true);
    //     } catch (error) {
    //         console.error('Erro ao buscar indicadores:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

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
                        <Select id="selectLoja" onSelect={selecionarLoja} defaultValue="0" style={{ width: 200 }}>
                            <Select.Option key={0} value="0" data={"TODAS"}>TODAS</Select.Option>
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
                            <Typography style={{ fontSize: '1.0rem', color: 'blue', paddingLeft: '8px' }}> {lojaSelecionadaDescricao}({idLoja}) </Typography>
                        </Row>
                    </Col>
                    <Col style={{ paddingLeft: '10px', paddingTop: '58px' }}>
                        <Tooltip title="Filtrar baseado nos filtros." placement="bottomLeft">
                            <Button style={{ backgroundColor: '#4682B4', borderColor: '#4682B4', color: '#fff', width: '150px' }} icon={<FilterOutlined title='Filtrar' />} onClick={listaPedidos} >Filtrar</Button>
                        </Tooltip>
                    </Col>
                    <Col style={{ paddingLeft: '00px', paddingTop: '58px' }}>
                        <Tooltip title="Imprimir baseado nos filtros." placement="bottomLeft">
                            <Button style={{ backgroundColor: '#fff', borderColor: '#000', color: '#000', width: '150px' }} icon={<PrinterFilled title='Imprimir' />} onClick={imprimirPedidosx} >Imprimir</Button>
                        </Tooltip>
                    </Col>
                    <Col style={{ paddingLeft: '00px', paddingTop: '58px' }}>
                        <Tooltip title="Imprimir baseado nos filtros." placement="bottomLeft">
                            <Button style={{ backgroundColor: '#fff', borderColor: '#000', color: '#000', width: '150px' }} icon={<PrinterFilled title='Imprimir' />} onClick={imprimirTodosPedidosx} >Imp.Todos</Button>
                        </Tooltip>
                    </Col>
                </Row>
            </>
        )
    }

    //********************** MODAL REJEITAR PEDIDO ****************/
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pedidoId, setPedidoId] = useState<number | null>(null);

    async function rejeitarPedidoxOld(record: PropsProfJMonte) {
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

    const modalRejeitarPedido = () => {
        return (
            <ModalJustificativaRejeicao
                pedidoId={pedidoId!}
                visible={isModalVisible}
                onConfirm={handleConfirmRejeitar}
                onCancel={handleCancelModal}
            />
        );
    };
    // Função para abrir o modal
    const abrirModalRejeitarPedido = (record: any) => {
        setPedidoId(record.id_vendas); // Captura o ID do pedido ao abrir o modal
        setIsModalVisible(true); // Exibe o modal
    };

    const handleConfirmRejeitar = (obs: string) => {
        setIsModalVisible(false);
        listaPedidos();
    };
    const handleCancelModal = () => {
        setIsModalVisible(false);
    };
    //********************** MODAL REJEITAR PEDIDO ****************/

    return (
        <div style={{ backgroundColor: '#fff' }}>
            <div style={{ backgroundColor: '#fff' }}>
                {pedidoId !== null && modalRejeitarPedido()}
            </div>

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