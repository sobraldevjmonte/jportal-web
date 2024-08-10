import { DownloadOutlined, EditOutlined, PlusOutlined, SaveOutlined, SyncOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Drawer, DrawerProps, Form, Input, RadioChangeEvent, Row, Space, Spin, Switch, Table, TableColumnsType, Tooltip, Typography, Upload } from "antd";
import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../context/useContext";
import ProfissionaisService from "../service/ProfissonaisService";
import { Notificacao } from '../components/notificacoes/notification';


const { retornarDouble } = require('../../src/utils/formatarValores');


const serviceProf = new ProfissionaisService()

interface PropsProfPremios {
    id_brinde: number;
    descricao: string;
    pontos: number;
    valor: string;
    quantidade: number;
    imagem: string;
    ativo: string;
}


export default function AdminProfPremios() {

    const { loja, setLoja } = useContext(UsuarioContext);
    const { idLoja, setIdLoja } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);

    /************************** FORM PADRAO *****************************/
    const [form] = Form.useForm();

    const [dados, setDados] = useState<PropsProfPremios[]>([]);
    const [registros, setQuantidade] = useState(0);
    const [loading, setLoading] = useState(false);
    const [editando, setEditando] = useState(false)

    const [notificacao, setNotificacao] = useState<{ message: string, description: string } | null>(null);


    useEffect(() => {
        listaPremiosxx()
        console.log('editando useEffect: ', editando);
    }, [])

    useEffect(() => {
        console.log('editando useEffect: ', editando);
    }, [editando]);


    async function listaPremiosxx() {
        try {
            setLoading(true);
            let rs = await serviceProf.listarPremios();
            console.log(rs)

            setDados(rs.data.lista_premios);
            setQuantidade(rs.data.registros);
        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
        }
    }


    function novoBrinde() {
        setEditando(false)


        setImagemNome('')
        setImagemSize(0);
        setImagemX(null)

        setFormData({

            id_brinde: 0,
            descricao: '',
            pontos: 0.00,
            valor: '0.00',
            quantidade: 0,
            imagem: '',
            ativo: 'S'
        })

        form.setFieldsValue({
            id_brinde: 0,
            descricao: '',
            pontos: 0.00,
            valor: '0.00',
            quantidade: 0,
            imagem: '',
            ativo: 'S'
        });

        showDrawer()
    }

    function editarPremio(dadosrecebidos: PropsProfPremios) {
        setEditando(true)
        console.log('editando dentro da funcao: ' + editando)

        setFormData({
            id_brinde: dadosrecebidos.id_brinde,
            descricao: dadosrecebidos.descricao,
            pontos: dadosrecebidos.pontos,
            valor: dadosrecebidos.valor,
            quantidade: dadosrecebidos.quantidade,
            imagem: dadosrecebidos.imagem,
            ativo: dadosrecebidos.ativo
        })

        form.setFieldsValue({
            id_brinde: dadosrecebidos.id_brinde,
            descricao: dadosrecebidos.descricao,
            pontos: dadosrecebidos.pontos,
            valor: dadosrecebidos.valor,
            quantidade: dadosrecebidos.quantidade,
            imagem: dadosrecebidos.imagem,
            ativo: dadosrecebidos.ativo
        });
        console.log(dadosrecebidos)
        showDrawer()
    }
    const tamFonte = '0.9rem';
    const colorContatou = 'blue'
    const corDestaque = '#000'
    const columns: TableColumnsType<PropsProfPremios> = [
        {
            title: 'ID', dataIndex: 'id_brinde', key: 'id_brinde', width: '90px', align: 'right',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Descrição', dataIndex: 'descricao', key: 'descricao',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Pontos', dataIndex: 'pontos', key: 'pontos', align: 'right',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Valor', dataIndex: 'valor', key: 'valor', align: 'right',
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
            title: 'Estoque',
            dataIndex: 'quantidade',
            key: 'quantidade',
            width: '120px',
            align: 'right',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue',
                    },
                };
            },
        },
        {
            title: 'Ativo', dataIndex: 'ativo', key: 'ativo', width: '60px',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
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
                    <Tooltip title="Salvar" color="#DAA520">
                        <Button icon={<SaveOutlined />} type="primary" style={{ marginRight: 2, marginBottom: 2, backgroundColor: '#DAA520' }} title="Salvarxxx" />
                    </Tooltip>
                    <Tooltip title="Editar" color="#DAA520">
                        <Button icon={<EditOutlined />} onClick={() => editarPremio(record)} style={{ color: 'blue', marginRight: '5px', borderColor: 'blue' }} title="Editar Brinde" />
                    </Tooltip>

                    {/* <Tooltip title="Aprovar" color="#000">
                        <Button icon={<CheckOutlined />} type="primary" style={{ marginRight: 2, marginBottom: 2, backgroundColor: '#008000' }} disabled={record.status == 'A' || record.status == 'R'} />
                    </Tooltip>
                    <Tooltip title="Rejeitar" color="#000">
                        <Button icon={<CloseCircleOutlined />} type="primary" style={{ marginRight: 2, marginBottom: 2, backgroundColor: 'red' }} disabled={record.status == 'A' || record.status == 'R' || record.aberto == 'P' } />
                    </Tooltip> */}
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

    /************* DRAWER INICIO *************/
    //************* PARAMETROS DRAWER INICIO *******************/
    const gutterPadrao = { xs: 2, sm: 4, md: 4, lg: 4 }
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<DrawerProps['placement']>('right');




    const showDrawer = () => {
        console.log('**** showDrawer ****')
        setOpen(true);
    };

    const onChange = (e: RadioChangeEvent) => {
        setPlacement(e.target.value);
    };

    const onClose = () => {
        setOpen(false);
    };

    const estiloDivDrawer = {
        animation: 'fadeout 50s'
    }
    const [formData, setFormData] = useState<PropsProfPremios>({
        id_brinde: 0,
        descricao: '',
        pontos: 0.00,
        valor: '0.00',
        quantidade: 0,
        imagem: '',
        ativo: 'S'
    });

    const onReset = () => {
        form.resetFields();
        setFormData({
            id_brinde: 0,
            descricao: '',
            pontos: 0.00,
            valor: '0.00',
            quantidade: 0,
            imagem: '',
            ativo: 'S'
        })

        setImagemX(null);
        setImagemSize(0);
        setImagemNome('');

        //setHasFeedback(false);  // Desativa o feedback visual
    };

    // Função para manipular a alteração nos campos do formulário
    const handleInputChange = (fieldName: string, value: any) => {
        console.log(value)

        if (fieldName === 'valor') {
            const formattedValue = retornarDouble(value);
            setFormData(prevState => ({
                ...prevState,
                [fieldName]: isNaN(formattedValue) ? '' : formattedValue.toFixed(2)
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [fieldName]: value
            }));
        }

        // console.log(formData);
    };

    const [imagemX, setImagemX] = useState(null);
    const [imagemSize, setImagemSize] = useState(0);
    const [imagemNome, setImagemNome] = useState('');


    // Função para gerar um nome único para o arquivo
    const generateUniqueFileName = (originalName: string) => {
        const timestamp = Date.now();
        const extension = originalName.split('.').pop();
        return `${originalName}_${timestamp}.${extension}`;
    };
    const handleUploadChange = (info: any) => {
        console.log('------------------ entrou --------------------------------')
        console.log(info)
        setImagemX(info.file);
        setImagemSize(info.file.size);

        // let uniqueFileName = generateUniqueFileName(info.file.name);
        // info.file.name = uniqueFileName;

        setImagemNome(info.file.name);
        // console.log(imagemNome)
    };

    const beforeUpload = (img: any) => {
        return false; // Evita o upload automático
    };

    const validateUpload = (_: any, value: any) => {
        setImagemX(value.file);
        setImagemSize(value.file.size);
        setImagemNome(value.file.name);

        return Promise.resolve();
    };

    async function salvarRegistrox(values: any) {
        setLoading(true)

        console.log('*************** Salvar registrox *********************');

        console.log('fsjdalkfsajlçkfjsdçlfjslkçajflkajflsajflsfjlskafjdsdddddddddddddddd')
        const updatedFormData = {
            ...formData,
            imagem: imagemNome // Atribua o nome da imagem ao campo imagem
        };

        try {

            let res;
            !editando ? res = await serviceProf.salvarRegistro(updatedFormData) : res = await serviceProf.atualizarRegistro(updatedFormData)
            if (imagemX) {
                if (imagemSize > 0) {
                    const formDataA = new FormData();
                    formDataA.append('imagembrinde', imagemX);

                    await serviceProf.upLoadImage(formDataA);
                }else{
                    console.log('************* imagem menor que zero ' + imagemSize)
                }

                // console.log(saveResponse);
                console.log('************* editando >> ' + editando)

                form.resetFields();

                setOpen(false)
                onReset()
                listaPremiosxx()
                // Salvar o registro com a URL do arquivo
            } else {
                setNotificacao({ message: 'Atenção!', description: 'Nenhum arquivo carregado' });
            }
        } catch (error) {
            console.error('Erro ao enviar dados para o servidor:', error);
        } finally {
            setLoading(false)
        }

        setLoading(false)
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };

    // const handleFormSubmit =  (event: any) {
    //     event.preventDefault();
    //     await salvarRegistrox();
    //   };

    const DrawerComponent = (
        <>
            <div className="fade-in-div">

                <Drawer
                    title="Cadastro de Brindes"
                    width={600}
                    onClose={onClose}
                    open={open}
                    placement={placement}
                    bodyStyle={{ paddingBottom: 80 }}
                >


                    <Form
                        form={form}
                        initialValues={formData}
                        layout="vertical"
                        onFinish={salvarRegistrox} /*teste */
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        style={{ maxWidth: 1000 }}
                    // validateMessages={validateMessages}

                    >

                        <Space>
                            <div>editando : {editando ? 'true' : 'false'}</div>
                            <Button onClick={onClose}>Fechar</Button>

                            <Button type="primary" htmlType="submit" tabIndex={20} loading={loading}>
                                {loading ? "Aguarde ..." : editando ? "Atualizar" : "Salvar"}
                            </Button>


                            <Button /*onClick={resetCampos}*/ onClick={onReset} type="default" htmlType="button" tabIndex={21}>
                                Limpar
                            </Button>
                        </Space>
                        <Divider />
                        <Row gutter={gutterPadrao}>
                            <Col span={4}>
                                <Form.Item
                                    label="ID"
                                    name='id_brinde'
                                >
                                    <Input placeholder="Id" readOnly value={editando ? formData.id_brinde : ''} id="id" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Descrição"
                                    name='descricao'
                                    validateFirst
                                    hasFeedback={formData.descricao.length > 0 ? true : false}
                                    rules={[{ required: true, message: 'Digite a descrição', min: 5, max: 40 }]}
                                // validateFirst
                                >
                                    <Input
                                        placeholder="Descrição"
                                        tabIndex={1}
                                        showCount
                                        maxLength={40}
                                        onChange={(e) => handleInputChange('descricao', e.target.value)}
                                    />
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row gutter={gutterPadrao}>
                            <Col span={8}>
                                <Form.Item
                                    label="Valor"
                                    name='valor'
                                    rules={[{ required: true, message: 'Digite o valor', min: 1, max: 10 }]}
                                    validateFirst
                                    hasFeedback
                                >
                                    <Input
                                        placeholder="Valor"
                                        tabIndex={2}
                                        maxLength={10}
                                        showCount
                                        id="valor"
                                        onChange={(e) => handleInputChange('valor', e.target.value)}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    label="Quant."
                                    name='quantidade'
                                    // rules={[{ required: false, message: 'Digite a quantidade', min: 1, max: 5 }]}
                                    hasFeedback
                                    validateFirst
                                // hasFeedback={formData.razao.length > 0 ? true : false}
                                >
                                    <Input
                                        placeholder="Quant."
                                        tabIndex={3}
                                        maxLength={5}
                                        showCount
                                        id="quantidade"
                                        onChange={(e) => handleInputChange('quantidade', e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Pontos"
                                    name='pontos'
                                    hasFeedback
                                    // rules={[{ required: false, message: 'Digite os pontos', min: 1, max: 5 }]}
                                    validateFirst
                                // hasFeedback={formData.razao.length > 0 ? true : false}
                                >
                                    <Input
                                        placeholder="Pontos"
                                        tabIndex={3}
                                        maxLength={5}
                                        showCount
                                        id="pontos"
                                        onChange={(e) => handleInputChange('pontos', e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Imagem"
                                    name='imagem'
                                    // rules={[{ required: true, message: 'Imagem não pode estar vazia.', min: 1, max: 200 }]}
                                    rules={[{ validator: validateUpload }]}
                                >
                                    <Upload
                                        name="file"

                                        beforeUpload={!editando ? beforeUpload : undefined}
                                        onChange={handleUploadChange}
                                        listType="picture-card"
                                        id="imagem"
                                    >
                                        <Button icon={<UploadOutlined />}>Upload de Imagem</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                            <Col>
                                {imagemSize == 0 && editando == true ?
                                    <div style={{ border: '1px solid #ccc', padding: '10px', maxWidth: '500px', maxHeight: '500px', overflow: 'hidden' }}>
                                        <img
                                            src={formData.imagem}
                                            alt="Imagem carregada"
                                            style={{ width: '120px', height: 'auto' }}
                                        />
                                    </div>
                                    : null}
                            </Col>

                        </Row>



                        <Row gutter={gutterPadrao}>
                            <Col span={2}>
                                <Form.Item
                                    name="ativo"
                                    label="Ativo?"
                                    id="ativo"
                                    rules={[{ required: false, message: '' }]}
                                // validateFirst
                                >
                                    <Switch onChange={(e) => handleInputChange('ativo', e)} title="Ativo?" checked={formData.ativo == 'S' ? true : false} />
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                </Drawer>
            </div>
        </>
    );



    async function atualizar() {

    }

    return (
        <div style={{ backgroundColor: '#fff' }}>
            {notificacao && <Notificacao message={notificacao.message} description={notificacao.description} />}
            <div>
                <Button icon={<SyncOutlined />} onClick={() => listaPremiosxx()} style={{ backgroundColor: '#2F4F4F', color: '#fff', borderColor: '#2F4F4F', marginRight: '5px', width: '130px' }} title="Atualizar todos os registros">Atualizar</Button>
                <Button type="primary" onClick={novoBrinde} style={{ width: 150 }} icon={<PlusOutlined />}>
                    Novo Brinde
                </Button>
            </div>
            <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div style={{ backgroundColor: '#fff' }}>
                    <Row style={{ display: 'flex', flexDirection: 'column' }}>
                        <Col>
                            <Typography style={{ fontSize: '24px' }}>
                                Prêmios(Cadastro) Profissionais
                            </Typography>
                        </Col>

                    </Row>
                </div>
                <div style={{ padding: '', position: 'relative', paddingTop: '20px', paddingRight: '30px' }}>
                    <Table
                        columns={columns}
                        dataSource={dados}
                        //dataSource={[...dados, totalRow]}
                        size="small"
                        rowKey={(record) => record.id_brinde}
                        bordered
                        title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>Registros({registros})</Typography>}
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

            {DrawerComponent}
        </div>
    )
}