import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../context/useContext";
import { Button, Col, DatePicker, DatePickerProps, Row, Select, Space, Spin, Table, TableColumnsType, Typography, Input, Tooltip } from "antd";
import { CheckOutlined, CloseCircleOutlined, DeliveredProcedureOutlined, DollarCircleOutlined, DownloadOutlined, FilterOutlined, IssuesCloseOutlined, SaveOutlined, SyncOutlined, TrophyOutlined, UnlockOutlined } from "@ant-design/icons";
import Title from 'antd/es/typography/Title';
import RtService from "../service/RtService";
import ProfissionaisPremiosPedidosService from "../service/ProfissionaisPremiosPedidosService";

const serviceProf = new ProfissionaisPremiosPedidosService()

interface PropsProfPremios {
    key: number;
    id_premio: number;
    id_parceiro: number;
    id_premiacao: number;
    id_autorizador: number;
    data_solicitacao: string;
    data_autorizacao: string;
    autorizado: boolean;
    status: string;
    entregue: boolean;
    data_entrega: string;
    descricao_brinde: string;
    pontos_brinde: number;
    estoque: number;
    nome_parceiro: string;
    nome_autorizador: boolean;
    nome_entregador: string;
}


export default function AdminProfPremiosPedidos() {

    const { loja, setLoja } = useContext(UsuarioContext);
    const { idLoja, setIdLoja } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
    const { nomeUsuario, setNomeUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { subNivel1, setSubNivel1 } = useContext(UsuarioContext);
    const [dados, setDados] = useState<PropsProfPremios[]>([]);
    const [registros, setQuantidade] = useState(0);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        listaPedidosPremios()
    }, [])


    async function listaPedidosPremios() {
        try {
            setLoading(true);
            let rs = await serviceProf.listaPedidos();
            console.log(rs)

            setDados(rs.data.pedidos);
            setQuantidade(rs.data.quantidade);
        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
        }
    }

    const tamFonte = '0.9rem';
    const colorContatou = 'blue'
    const corDestaque = '#000'
    const columns: TableColumnsType<PropsProfPremios> = [
        {
            title: 'Nº', dataIndex: 'id_premiacao', key: 'id_premiacao', width: '90px', align: 'right',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Data', dataIndex: 'data_solicitacao', key: 'data_solicitacao', width: '80px',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Status', dataIndex: 'status', key: 'status', width: '100px',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Pontos',
            dataIndex: 'pontos_brinde',
            key: 'pontos_brinde',
            width: '60px',

            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue',
                    },
                };
            },
        },
        {
            title: 'Brinde', dataIndex: 'descricao_brinde', key: 'descricao_brinde',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Estoque', dataIndex: 'estoque', key: 'estoque', width: '80px', 
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Parceiro', dataIndex: 'nome_parceiro', key: 'nome_parceiro',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'lightblue', // Cor de fundo do cabeçalho
                    },
                };
            },
        },


        {
            title: 'Autorizado', dataIndex: 'autorizado', key: 'autorizado', width: '50px', 
            render: (text: string, record: any) =>
                <span style={{ fontSize: tamFonte }} >
                    {record.autorizado  ? 'S' : 'N'}
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
            title: 'Dt. Autoriz.', dataIndex: 'data_autorizacao', key: 'data_autorizacao',width: '100px',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'yellow', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Autorizador',
            dataIndex: 'nome_autorizador',
            key: 'nome_autorizador',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'yellow',
                    },
                };
            },
        },
        {
            title: 'Entregue', dataIndex: 'entregue', key: 'entregue',width: '50px',
            render: (text: string, record: any) =>
                <span style={{ fontSize: tamFonte }} >
                    {record.entregue  ? 'S' : 'N'}
                </span>,
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'burlywood', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'DT. Entrega', dataIndex: 'data_entrega', key: 'data_entrega', width: '100px',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'burlywood', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
       
        {
            title: 'Entregador', dataIndex: 'nome_entregador', key: 'nome_entregador',
            onHeaderCell: () => {
                return {
                    style: {
                        backgroundColor: 'burlywood', // Cor de fundo do cabeçalho
                    },
                };
            },
        },
        {
            title: 'Opções',
            key: 'opcoes',
            align: 'center',
            width: '160px',
            render: (text, record) => (
                <span>
                    {subNivel1 === 1 ?
                    <Tooltip title="Liberar(Somente TI)" color="">
                        <Button icon={<UnlockOutlined  />} type="default" style={{ marginRight: 2, marginBottom: 2, backgroundColor: '' }}  title='Liberar Pedido(Somente administradores)' onClick={() => liberarPedidox(record)} disabled={record.status === 'PENDENTE' } />
                    </Tooltip>
                    : null}
                    <Tooltip title="Aprovar" color="">
                        <Button icon={<CheckOutlined />} type="primary" style={{ marginRight: 2, marginBottom: 2, backgroundColor: '' }}  title='Aprovar Pedido' onClick={() => aprovarPedidox(record)} disabled={record.status === 'REJEITADO' || record.status === 'ENTREGUE' || record.status === 'APROVADO'}/>
                    </Tooltip>

                    <Tooltip title="Rejeitar" color="">
                        <Button icon={<CloseCircleOutlined />} type="primary" style={{ marginRight: 2, marginBottom: 2, backgroundColor: 'red' }} title='Rejeitar Pedido' onClick={() =>  rejeitarPedidox(record)} disabled={record.status === 'ENTREGUE' || record.status === 'REJEITADO'}/>
                    </Tooltip>
                    <Tooltip title="Entregar" color="">
                        <Button icon={<DeliveredProcedureOutlined  />} type="primary" style={{ marginRight: 2, marginBottom: 2, backgroundColor: '#669966' }} title="Entregar Pedido" onClick={() => entregarPedidox(record)} disabled={record.status === 'PENDENTE' || record.status === 'ENTREGUE' || record.status === 'REJEITADO' }/>
                    </Tooltip>
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

    async function liberarPedidox(record: any){
        let idPedido = record.id_premiacao
        let idPremio = record.id_premio
        
        try {
            setLoading(true);
            let rs = await serviceProf.liberarPedido(idPedido, idPremio);
            console.log(rs)

            setDados(rs.data.pedidos);
            setQuantidade(rs.data.quantidade);
        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
            listaPedidosPremios()
        }
    }
    async function aprovarPedidox(record: any){
        let idPedido = record.id_premiacao
        
        try {
            setLoading(true);
            let rs = await serviceProf.aprovarPedido(idPedido, idUsuario);
            console.log(rs)

            setDados(rs.data.pedidos);
            setQuantidade(rs.data.quantidade);
        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
            listaPedidosPremios()
        }
    }
    async function rejeitarPedidox(record: any){
        let idPedido = record.id_premiacao
        let idParceiro = record.id_parceiro
        
        try {
            setLoading(true);
            let rs = await serviceProf.rejeitarPedido(idPedido, idParceiro);
            console.log(rs)

            setDados(rs.data.pedidos);
            setQuantidade(rs.data.quantidade);
        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
            listaPedidosPremios()
        }
    }
    async function entregarPedidox(record: any){
        let idPedido = record.id_premiacao
        let idPremio = record.id_premio
        let idParceiro = record.id_parceiro
        
        try {
            setLoading(true);
            let rs = await serviceProf.entregarPedido(idPedido, idPremio, idParceiro);
            console.log(rs)

            setDados(rs.data.pedidos);
            setQuantidade(rs.data.quantidade);
        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
            listaPedidosPremios()
        }
    }

    


    return (
        <div style={{ backgroundColor: '#fff' }}>
            <div>
                <Button icon={<SyncOutlined />} onClick={() => listaPedidosPremios()} style={{ backgroundColor: '#2F4F4F', color: '#fff', borderColor: '#2F4F4F', marginRight: '5px', width: '130px' }} title="Atualizar todos os registros">Atualizar</Button>
            </div>
            <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div style={{ backgroundColor: '#fff' }}>
                    <Row style={{ display: 'flex', flexDirection: 'column' }}>
                        <Col>
                            <Typography style={{ fontSize: '24px' }}>
                                Pedidos(Prêmios) Profissionais
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
                        rowKey={(record) => record.key}
                        bordered
                        title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>Registros({registros})</Typography>}
                        pagination={{
                            //defaultPageSize: 5, // Define o tamanho padrão da página
                            showSizeChanger: true, // Exibe o seletor de tamanho da página
                            pageSizeOptions: ['10', '20', '30'], // Opções de tamanho de página disponíveis
                            showQuickJumper: true, // Exibe o campo de navegação rápida
                            showTotal: (total, range) => `Mostrando ${range[0]}-${range[1]} de ${total} pedidos`, // Exibe informações sobre o total de registros
                        }}
                    />
                </div>
            </Spin>
        </div>
    )
}