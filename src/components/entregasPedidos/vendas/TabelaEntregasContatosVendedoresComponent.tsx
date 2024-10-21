import Icon, { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, ExclamationCircleOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
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
        console.log(idNivelUsuario)
        console.log(codigoUsuario)
        console.log(props)
        try {
            let rs = await service.listaEntregasContatosDoVendedor(idNivelUsuario === 3 ? codigoUsuario : props.codigoVendedor) ;
            console.log(rs.data)
            setDados(rs.data.lista_contatos)
            setQuantidade(rs.data.registros)
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

        setLoading(true);
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
            setLoading(false);
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

        setLoading(true);
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
            setLoading(false);
        }

        setIsModalVisible(false);
        form.resetFields();

        listaEntregasContatos()
    };


    const modalObs = (
        <div>
            <Modal
                visible={isModalVisible}
                onOk={idNivelUsuario === 2 ? handleCancel :idAux === null ? salvarObs : alterarObsx}
                onCancel={handleCancel}
                okText={idNivelUsuario === 2 ? 'Ok' : idAux === null ? "Salvar" : 'Alterar'}
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
                            onChange={(e) => alterarObs(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )


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
        { title: 'Cliente', dataIndex: 'cliente', key: 'cliente' },
        { title: 'Fone', dataIndex: 'fone', key: 'fone' },
        { title: 'Cel.', dataIndex: 'celular', key: 'celular' },
        // { title: 'Valor', dataIndex: 'valortotal', key: 'valortotal', width: '120px' },

        {
            title: 'OP.', dataIndex: 'cliente_obra', key: 'nomeVendedor', align: 'center', width: '40px',
            // render: (cliente_obra, record) => <span style={{ fontSize: tamFonte}}>{cliente_obra !== null ? 'S': '' }</span> },
            render: (text, record) => (
                <Tooltip color="#000" title="Editar Entrega">
                    <Button icon={idNivelUsuario === 2 ? <SearchOutlined/> : <EditOutlined />} type="primary" style={{ marginRight: 2, marginBottom: 2 }} disabled={record.status === 'A' || record.status === 'R'} onClick={() => editarEntrega(record)} />
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
                            title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>Lista Entregas do Vendedor({quantidade})</Typography>}
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