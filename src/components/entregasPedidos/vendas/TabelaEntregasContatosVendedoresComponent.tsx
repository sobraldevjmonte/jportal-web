import Icon, { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, ExclamationCircleOutlined, FilterOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Spin, Table, TableColumnsType, Tooltip, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import EntregasContatosService from "../../../service/EntregasContatosService";
import { UsuarioContext } from "../../../context/useContext";
import dayjs from 'dayjs';

const service = new EntregasContatosService()

interface EntregasContatosType {
    key: number;
    id: number;
    iddetalhe: number;
    codigoloja: number;
    np: string;
    datacompromisso: string;
    dataprevenda: string;
    codigocliente: string;
    cliente: string;
    vendedor: string;
    nomevendedor: string;
    telefone: string;
    celular: string;
    status: string;
    valortotal: number;
    obs: string;
}

export default function TabelaEntregasContatosVendedoresComponent(props: any) {
    const [dados, setDados] = useState<EntregasContatosType[]>([]);
    const [loading, setLoading] = useState(false);
    const [quantidade, setQuantidade] = useState(0);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [obs, setObs] = useState("");
    const [obsx, setObsx] = useState("");
    const [form] = Form.useForm();

    const [dadosOriginais, setDadosOriginais] = useState<EntregasContatosType[]>([]);

    const [idAux, setIdAux] = useState(0)

    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);

    console.log('---------- Component pre-vendas --------------')
    useEffect(() => {
        listaEntregasContatos()
        console.log('-------------- TabelaEntregasContatosVendedoresComponent ------------------')
    }, [])


    async function listaEntregasContatos() {
        setLoading(true);
        try {
            let rs = await service.listaEntregasContatosDoVendedor(idNivelUsuario === 3 ? codigoUsuario : props.codigoVendedor);
            console.log(rs.data)
            setDados(rs.data.lista_contatos)
            setDadosOriginais(rs.data.lista_contatos)
            setQuantidade(rs.data.registros)

            const generatedFilters = generateFilters(rs.data.lista_contatos);
            setFilters(generatedFilters);

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }

    }


    //*************** modal  ******/
    const [clienteModal, setClienteModal] = useState('');
    const [npModal, setNpModal] = useState('');
    const [dataNpModal, setDataNpModal] = useState('');
    const [codigoLojaModal, setCodigoLojaModal] = useState('');

    const editarEntrega = (record: any) => {
        console.log(record)
        setCurrentId(record.id); // Define o ID do registro atual
        setObs(record.obs || ""); // Preenche a observação existente, se houver
        setClienteModal(record.cliente)
        setNpModal(record.np)
        setDataNpModal(record.dataprevenda)
        setCodigoLojaModal(record.codigoloja)
        setIsModalVisible(true); // Abre o modal
        setIdAux(record.iddetalhe)
        setObsx(obs)

        form.setFieldsValue({ obs: record.obs || "" });
    };
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };
    function alterarObs(e: any) {
        setObs(e)
    }

    // Função para salvar a observação
    async function salvarObs() {
        console.log('****** salvarObs ********')

        const dadosx = {
            obs: obs,
            codigoLoja: codigoLojaModal,
            np: npModal
        };

        // setLoading(true);
        try {
            if (obsx === obs) {

            }
            let rs = await service.salvarObsVendedor(dadosx);
            console.log(rs.data)
            // setDados(rs.data.lista_contatos)
            // setQuantidade(rs.data.registros)

            // Atualizar somente o record que foi modificado
            setDados((prevDados) =>
                prevDados.map((item) =>
                    item.np === npModal ? { ...item, obs: obs } : item
                )
            );

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            // setLoading(false);
        }

        setIsModalVisible(false);
        form.resetFields();

        listaEntregasContatos()
    };

    async function alterarObsx() {
        console.log('****** alterarObsx ********')

        const dadosx = {
            obs: obs,
            codigoLoja: codigoLojaModal,
            np: npModal
        };

        // setLoading(true);
        try {
            if (obsx === obs) {

            }
            let rs = await service.alterarObsVendedor(dadosx);
            console.log(rs.data)
            // setDados(rs.data.lista_contatos)
            // setQuantidade(rs.data.registros)

            setDados((prevDados) =>
                prevDados.map((item) =>
                    item.np === npModal ? { ...item, obs: obs } : item
                )
            );
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            // setLoading(false);
        }

        setIsModalVisible(false);
        form.resetFields();

        listaEntregasContatos()
    };


    const modalObs = (
        <div>
            <Modal
                visible={isModalVisible}
                onOk={idNivelUsuario === 2 ? handleCancel : idAux === null ? salvarObs : alterarObsx}
                onCancel={handleCancel}
                okText={[2, 11, 1, 0].includes(idNivelUsuario) ? 'Ok' : idAux === null ? "Salvar" : 'Alterar'}
                // [1, 11, 0].includes(idNivelUsuario) ? props.icomp: icomp 
                cancelText="Cancelar"
            >
                <Typography>NP: {npModal} Data: {dataNpModal}</Typography>
                <Typography>Cliente: {clienteModal}</Typography>
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Observações"
                        name="obs"
                        rules={[{ required: true, message: 'Por favor, insira uma observação!' }]}
                    >
                        <Input.TextArea
                            rows={4}
                            value={obs}
                            maxLength={255}
                            onChange={(e) => alterarObs(e.target.value)}
                            showCount
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )

    // Interface para tipo de filtro
    interface FilterType {
        text: string;
        value: string;
    }

    // Estado para gerenciar filtros e valores
    const [filters, setFilters] = useState<FilterType[]>([]);
    const [filterLoading, setFilterLoading] = useState(false);
    const [filterValue, setFilterValue] = useState<string>('');

    // Função para gerar opções de filtros baseados na lista
    const generateFilters = (listaNps: EntregasContatosType[]) => {
        const uniqueNp: string[] = [...new Set(listaNps.map(item => item.cliente))];
        return uniqueNp.map(cliente => ({
            text: cliente,
            value: cliente,
        }));
    };

    // Função para aplicar filtro
    const applyFilter = (value: string) => {
        setFilterLoading(true);
        try {
            const lowerCaseValue = value.toLowerCase(); // Convert search term to lowercase
            const filteredData = dados.filter(item => 
                lowerCaseValue.length > 0 
                    ? item.cliente.toLowerCase().includes(lowerCaseValue) // Convert item to lowercase before comparing
                    : true // If filter is empty, show all data
            );
    
            // Check for exact matches and filter accordingly
            const exactMatch = filteredData.some(item => item.cliente.toLowerCase() === lowerCaseValue);
    
            if (exactMatch) {
                const exactFilteredData = filteredData.filter(item => item.cliente.toLowerCase() === lowerCaseValue);
                setDados(exactFilteredData);
            } else {
                setDados(filteredData);
            }
    
            // Generate updated filters based on filtered data
            setFilters(generateFilters(filteredData));
        } catch (error) {
            console.error('Erro ao aplicar filtro:', error);
        } finally {
            setFilterLoading(false);
        }
    };
    


    // Função para capturar alterações no Input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilterValue(value);
        applyFilter(value);
    };

    // Função para limpar o filtro e restaurar dados originais
    const clearFilter = () => {
        setFilterLoading(true);
        try {
            setFilterValue(''); // Limpa o valor do filtro
            setDados(dadosOriginais); // Restaura os dados originais
            setFilters(generateFilters(dadosOriginais)); // Atualiza os filtros com base nos dados originais
        } catch (error) {
            console.error('Erro ao limpar filtro:', error);
        } finally {
            setFilterLoading(false);
        }
    };


    const columns: TableColumnsType<EntregasContatosType> = [
        {
            title: 'ST', dataIndex: '', key: '', align: 'center', width: '40px',
            // render: (cliente_obra, record) => <span style={{ fontSize: tamFonte}}>{cliente_obra !== null ? 'S': '' }</span> },
            render: (text, record) => (
                <div>
                    {record.obs === null ? (
                        <Tooltip color="#000" title="Entrega pendente de confirmação.">
                            <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                        </Tooltip>
                    ) : (
                        <Tooltip color="#000" title="Entrega confirmada.">
                            <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                        </Tooltip>
                    )}
                </div>
            ),
        },
        { title: 'Data', dataIndex: 'dataprevenda', key: 'dataprevenda', width: '5%' },
        {
            title: 'Data Compromisso',
            dataIndex: 'datacompromisso',
            key: 'datacompromisso',
            width: '12%',
            sorter: (a, b) => {
                const dateA = dayjs(a.datacompromisso, 'DD/MM/YYYY'); // Ajuste o formato conforme necessário
                const dateB = dayjs(b.datacompromisso, 'DD/MM/YYYY');
                return dateA.valueOf() - dateB.valueOf();
            },
            defaultSortOrder: 'descend'
        },
        {
            title: 'NP.', dataIndex: 'np', key: 'np', width: '80px', filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Buscar NP"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Buscar
                    </Button>
                    <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
                        Limpar
                    </Button>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => {
                const searchValue = typeof value === 'string' ? value.toLowerCase() : '';
                return record.np?.toString().toLowerCase().includes(searchValue);
            },
        },
        // { title: 'Cliente', dataIndex: 'cliente', key: 'cliente' },
        {
            title: 'Cliente', dataIndex: 'cliente', key: 'cliente',
            filterDropdown: (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Filtrar por NP"
                        value={filterValue}
                        onChange={handleInputChange}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        onClick={clearFilter}
                        size="small"
                        type="link"
                    >
                        Limpar Filtro
                    </Button>
                </div>
            ),
            filterIcon: <Spin spinning={filterLoading}><FilterOutlined style={{ color: filterLoading ? '#1890ff' : undefined }} /></Spin>,
        },
        { title: 'Fone', dataIndex: 'fone', key: 'fone' },
        { title: 'Cel.', dataIndex: 'celular', key: 'celular' },
        // { title: 'Valor', dataIndex: 'valortotal', key: 'valortotal', width: '120px' },

        {
            title: 'OP.', dataIndex: 'cliente_obra', key: 'nomeVendedor', align: 'center', width: '40px',
            // render: (cliente_obra, record) => <span style={{ fontSize: tamFonte}}>{cliente_obra !== null ? 'S': '' }</span> },
            render: (text, record) => (
                <Tooltip color="#000" title={[2, 11, 1, 0].includes(idNivelUsuario) ? "Visualizar Entrega" : "Editar entrega"}>
                    <Button icon={[2, 11, 1, 0].includes(idNivelUsuario) ? <SearchOutlined /> : <EditOutlined />} type="primary" style={{ marginRight: 2, marginBottom: 2 }} disabled={record.status === 'A' || record.status === 'R'} onClick={() => editarEntrega(record)} />
                </Tooltip>
            ),
        },
    ];
    return (
        <>
            <div style={{ backgroundColor: '#fff' }}>
                <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div>
                        <Button type="primary" icon={<SyncOutlined />} onClick={() => listaEntregasContatos()} style={{ marginTop: '5px', marginBottom: '15px', marginLeft: '15px', width: '130px' }} title="Atualizar registros do vendedor">Atualizar</Button>
                    </div>
                    <div style={{ paddingTop: '0px', paddingLeft: '0px', paddingBottom: '15px', width: '99%', position: 'relative', backgroundColor: '#fff' }}>
                        <Table
                            columns={columns}
                            dataSource={dados}
                            // pagination={false}
                            size="small"
                            rowKey={(record) => record.np}
                            style={{ backgroundColor: '#fff' }}
                            title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>Lista Entregas do Vendedor({quantidade}) - Vendedores</Typography>}
                            bordered
                            pagination={{
                                //defaultPageSize: 5, // Define o tamanho padrão da página
                                showSizeChanger: true, // Exibe o seletor de tamanho da página
                                pageSizeOptions: ['10', '20', '30'], // Opções de tamanho de página disponíveis
                                showQuickJumper: true, // Exibe o campo de navegação rápida
                                showTotal: (total, range) => `Mostrando ${range[0]}-${range[1]} de ${total} entregas`, // Exibe informações sobre o total de registros
                            }}
                        />
                    </div>
                </Spin>
            </div>
            {modalObs}
        </>

    )
}