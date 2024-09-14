import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../../context/useContext";
import ProfissionaisService from "../../service/ProfissonaisService";
import { Button, Col, Row, Spin, Table, TableColumnsType, Typography } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Notificacao } from '../notificacoes/notification';
import { notification } from 'antd';



const serviceProf = new ProfissionaisService()

interface PropsProfUsuarios {
    key: number;
    id_usuario: number;
    nome: string;
    telefone1: string;
    telefone2: string;
    usuario: string;
    loja: string;
    pontos_saldo: number;
    ativo: string;
}

export default function AdminProfUsuarios() {
    const { loja, setLoja } = useContext(UsuarioContext);
    const { idLoja, setIdLoja } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);

    const [dados, setDados] = useState([]);
    const [registros, setQuantidade] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingExcluir, setLoadingExcluir] = useState(false);

    const [notificacao, setNotificacao] = useState<{ message: string, description: string } | null>(null);


    useEffect(() => {
        listaUsuarios()
    }, [])

    async function listaUsuarios() {
        try {
            setLoading(true);
            let rs = await serviceProf.listarUsuarios();
            console.log(rs)
            setDados(rs.data.lista_usuarios);
            setQuantidade(rs.data.registros);
        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
        }
    }

    // Função para exibir a notificação
    const exibirNotificacao = (msg: string, tipo: 'success' | 'error') => {
        notification.open({
            message: tipo === 'success' ? 'Sucesso!' : 'Erro!',
            description: msg,
            icon: tipo === 'success' ? <CheckCircleOutlined style={{ color: 'blue' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />,
            placement: 'bottom',
            duration: 5, // A notificação ficará visível por 3 segundos
        });
    };

    async function ativarUsuariox(record: any) {
        try {
            setLoading(true);
            let rs = await serviceProf.ativarUsuario(record.id_usuario, record.ativo);
            console.log(rs)
            // setDados(rs.data.lista_usuarios);
            // setQuantidade(rs.data.registros);
        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
            listaUsuarios()
        }
    }
    async function excluirUsuariox(record: any) {
        try {
            setLoadingExcluir(true);
            let rs = await serviceProf.excluirUsuario(record.id_usuario);
            console.log(rs);

            // Verifica se a mensagem é um objeto ou uma string
            let msg;
            if (typeof rs.data === 'object' && rs.data.msg) {
                msg = rs.data.msg; // Acessa a propriedade 'msg' do objeto
            } else if (typeof rs.data === 'string') {
                msg = rs.data;
            } else {
                msg = "Usuário possui outros registros no sistema. Não é possível excluir.";
            }
            
            if(rs.statusCode === 200) {
                exibirNotificacao(msg,'success');
            }else{
                exibirNotificacao(msg,'error');
            }


            // Caso queira atualizar a lista de usuários após a exclusão
            // setDados(rs.data.lista_usuarios);
            // setQuantidade(rs.data.registros);
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            exibirNotificacao('Ocorreu um erro ao tentar excluir o usuário.','success');
        } finally {
            setLoadingExcluir(false);
            listaUsuarios(); // Atualiza a lista de usuários
        }
    }
    const tamFonte = '0.9rem';
    const colorContatou = 'blue'
    const corDestaque = '#000'
    const columns: TableColumnsType<PropsProfUsuarios> = [
        {
            title: 'ID', dataIndex: 'id_usuario', key: 'id_usuario', align: 'center', width: '100px',
            render: (text, record) => (
                <span style={{ color: record.ativo === 'N' ? 'red' : 'black', fontSize: tamFonte }}>
                    {text}
                </span>
            ),
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
                    },
                };
            },
            // onHeaderCell: () => {
            //     return {
            //         style: {
            //             backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
            //         },
            //     };
            // },
        },
        {
            title: 'Nome', dataIndex: 'nome', key: 'nome', align: 'left', render: (text, record) => (
                <span style={{ color: record.ativo === 'N' ? 'red' : 'black', fontSize: tamFonte }}>
                    {text}
                </span>
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
            title: 'Usuário(cpf)', dataIndex: 'usuario', key: 'usuario', align: 'left',
            render: (text, record) => (
                <span style={{ color: record.ativo === 'N' ? 'red' : 'black', fontSize: tamFonte }}>
                    {text}
                </span>
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
            title: 'Telefone(P)', dataIndex: 'telefone1', key: 'telefone1', align: 'left',
            render: (text, record) => (
                <span style={{ color: record.ativo === 'N' ? 'red' : 'black', fontSize: tamFonte }}>
                    {text}
                </span>
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
            title: 'Telefone(S)', dataIndex: 'telefone2', key: 'telefone2', align: 'left',
            render: (text, record) => (
                <span style={{ color: record.ativo === 'N' ? 'red' : 'black', fontSize: tamFonte }}>
                    {text}
                </span>
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
            title: 'Pontos', dataIndex: 'pontos_saldo', key: 'pontos_saldo', align: 'right',
            render: (text, record) => (
                <span style={{ color: record.ativo === 'N' ? 'red' : 'black', fontSize: tamFonte }}>
                    {text}
                </span>
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
            title: 'Ativo', dataIndex: 'ativo', key: 'ativo', align: 'right',
            render: (text, record) => (
                <span style={{ color: record.ativo === 'N' ? 'red' : 'black', fontSize: tamFonte }}>
                    {text}
                </span>
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
            title: 'Opções',
            key: 'opcoes',
            align: 'center',
            width: '200px',
            render: (text, record) => (
                <span>
                    <Button type="primary"
                        style={{ marginRight: 8, backgroundColor: record.ativo === 'S' ? 'red' : '', width: '75px' }}
                        onClick={() => ativarUsuariox(record)}>
                        {record.ativo === 'S' ? 'Inativar' : 'Ativar'}
                    </Button>
                    <Button loading={loadingExcluir} onClick={() => excluirUsuariox(record)}>Excluir</Button>
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
    ]
    return (
        <div style={{ backgroundColor: '#fff' }}>
            {notificacao && <Notificacao message={notificacao.message} description={notificacao.description} />}
            <div>
                <Button icon={<SyncOutlined />} onClick={() => listaUsuarios()} style={{ backgroundColor: '#2F4F4F', color: '#fff', borderColor: '#2F4F4F', marginRight: '5px', width: '130px' }} title="Atualizar todos os registros">Atualizar</Button>
            </div>
            <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div style={{ padding: '', position: 'relative', paddingTop: '20px', paddingRight: '30px' }}>
                    <Table
                        columns={columns}
                        dataSource={dados}
                        //dataSource={[...dados, totalRow]}
                        size="small"
                        rowKey={(record) => record.key}
                        bordered
                        title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>Cadastro de usuários(Profissonais) Registros: {registros} </Typography>}
                        pagination={{
                            //defaultPageSize: 5, // Define o tamanho padrão da página
                            showSizeChanger: true, // Exibe o seletor de tamanho da página
                            pageSizeOptions: ['10', '20', '30'], // Opções de tamanho de página disponíveis
                            showQuickJumper: true, // Exibe o campo de navegação rápida
                            showTotal: (total, range) => `Mostrando ${range[0]}-${range[1]} de ${total} profissionais(usuários)`, // Exibe informações sobre o total de registros
                        }}
                    />
                </div>
            </Spin>
        </div>
    )
}