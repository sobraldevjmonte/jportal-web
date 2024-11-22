import Icon, { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, ExclamationCircleOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Spin, Table, TableColumnsType, Tooltip, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import EntregasContatosService from "../../../../service/EntregasContatosService";
import { UsuarioContext } from "../../../../context/useContext";
import dayjs from 'dayjs';
import TabelaEntregasContatosVendedoresComponent from "../vendas/TabelaEntregasContatosVendedoresComponent";
import TabelaEntregasContatosGerentesComponent from "../gerentes/TabelaEntregasContatosGerentesComponent";



const service = new EntregasContatosService()

interface EntregasContatosType {
    key: number;
    id: number;
    codigoLoja: number;
    idloja: number;
    icomp: string;
    fantasia: string;
}


export default function TabelaEntregasContatosAdminComponent() {
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
        listaLojasDoAdminx()
        console.log('-------------- TabelaEntregasContatosGerente ------------------')
    }, [])


    async function listaLojasDoAdminx() {
        setLoading(true);
        try {
            let rs = await service.listaLojasDoAdmin();
            // console.log(rs.data)
            setDados(rs.data.lista_lojas)
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
        { title: 'Cód. Loja', dataIndex: 'codigoLoja', key: 'codigoLoja', width: '15%' },
        { title: 'Loja', dataIndex: 'fantasia', key: 'fantasia'},
    ];

    //***************** Inserindo Componente TabelaEntregasContatosGerentesComponent  ******************/
    const expandedRowRender = (record: any) => {
        let icomp = record.icomp
        return <TabelaEntregasContatosGerentesComponent icomp={icomp} />;
    };


    return (
        <>
            <div style={{ backgroundColor: '#fff' }}>
                <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div>
                        <Button type="primary" icon={<SyncOutlined />} onClick={() => listaLojasDoAdminx()} style={{ marginTop: '5px', marginBottom: '15px', marginLeft: '15px', width: '130px' }} title="Atualizar registros do vendedor">Atualizar</Button>
                    </div>
                    <div style={{ paddingTop: '0px', paddingLeft: '0px', paddingBottom: '15px', width: '99%', position: 'relative', backgroundColor: '#fff' }}>
                        <Table
                            columns={columns}
                            dataSource={dados}
                            // pagination={false}
                            size="small"
                            rowKey={(record) => record.icomp}
                            style={{ backgroundColor: '#fff' }}
                            title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>Lista Lojas({quantidade}) - Administradores</Typography>}
                            bordered
                            pagination={{
                                //defaultPageSize: 5, // Define o tamanho padrão da página
                                showSizeChanger: true, // Exibe o seletor de tamanho da página
                                pageSizeOptions: ['10', '20', '30'], // Opções de tamanho de página disponíveis
                                showQuickJumper: true, // Exibe o campo de navegação rápida
                                showTotal: (total, range) => `Mostrando ${range[0]}-${range[1]} de ${total} lojas`, // Exibe informações sobre o total de registros
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