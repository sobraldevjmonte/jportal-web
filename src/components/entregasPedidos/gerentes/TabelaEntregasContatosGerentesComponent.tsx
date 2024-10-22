import Icon, { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, ExclamationCircleOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Spin, Table, TableColumnsType, Tooltip, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import EntregasContatosService from "../../../service/EntregasContatosService";
import { UsuarioContext } from "../../../context/useContext";
import dayjs from 'dayjs';
import TabelaEntregasContatosVendedoresComponent from "../vendas/TabelaEntregasContatosVendedoresComponent";


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
    codvendedor: string;
    telefone: string;
    celular: string;
    status: string;
    valortotal: number;
    obs: string;
}

export default function TabelaEntregasContatosGerentesComponent() {
    const [dados, setDados] = useState<EntregasContatosType[]>([]);
    const [loading, setLoading] = useState(false);
    const [quantidade, setQuantidade] = useState(0);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [obs, setObs] = useState("");
    const [obsx, setObsx] = useState("");
    const [form] = Form.useForm();

    const [idAux, setIdAux] = useState(0)


    // const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
    const { idLoja, setIdLoja } = useContext(UsuarioContext);
    const { icomp, setIcomp } = useContext(UsuarioContext);  

    useEffect(() => {
        listaEntregasContatos()
        console.log('-------------- TabelaEntregasContatosGerente ------------------')
    }, [])


    async function listaEntregasContatos() {
        setLoading(true);
        try {
            let rs = await service.listaVendedoresDoGerente(icomp);
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

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };
    function alterarObs(e: any) {
        setObs(e)
    }

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
    const modalObs = (
        <div>
            <Modal
                visible={isModalVisible}
                onOk={handleCancel}
                onCancel={handleCancel}
                okText={idAux === null ? "Salvar" : 'Alterar'}
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
        { title: 'Cód. Vendedor', dataIndex: 'codvendedor', key: 'codvendedor', width: '15%' },
        { title: 'Vendedor', dataIndex: 'vendedor', key: 'vendedor',  },
        // {
        //     render: (text, record) => (
        //         <Tooltip color="#000" title="Editar Entrega">
        //             <Button icon={<EditOutlined />} type="primary" style={{ marginRight: 2, marginBottom: 2 }} disabled={record.status === 'A' || record.status === 'R'} onClick={() => editarEntrega(record)} />
        //         </Tooltip>
        //     ),
        // },
    ];

    //***************** Inserindo Componente TabelaPendenciasVendasVendedoreNps  ******************/
    const expandedRowRender = (record: any) => {
        let codigo = record.codvendedor
        return <TabelaEntregasContatosVendedoresComponent codigoVendedor={codigo} />;
    };


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
                            rowKey={(record) => record.codvendedor}
                            style={{ backgroundColor: '#fff' }}
                            title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>Lista dos vendedores da loja.({quantidade})</Typography>}
                            bordered
                            pagination={{
                                //defaultPageSize: 5, // Define o tamanho padrão da página
                                showSizeChanger: true, // Exibe o seletor de tamanho da página
                                pageSizeOptions: ['10', '20', '30'], // Opções de tamanho de página disponíveis
                                showQuickJumper: true, // Exibe o campo de navegação rápida
                                showTotal: (total, range) => `Mostrando ${range[0]}-${range[1]} de ${total} entregas`, // Exibe informações sobre o total de registros
                            }}
                            expandedRowRender={expandedRowRender}
                        />
                    </div>
                </Spin>
            </div>
            {modalObs}
        </>

    )
}