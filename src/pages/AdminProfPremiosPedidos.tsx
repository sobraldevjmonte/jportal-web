import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../context/useContext";
import { Button, Col, DatePicker, DatePickerProps, Row, Select, Space, Spin, Table, TableColumnsType, Typography, Input, Tooltip } from "antd";
import { CheckOutlined, CloseCircleOutlined, DollarCircleOutlined, DownloadOutlined, FilterOutlined, SaveOutlined, SyncOutlined, TrophyOutlined } from "@ant-design/icons";
import Title from 'antd/es/typography/Title';
import RtService from "../service/RtService";
import ProfissionaisService from "../service/ProfissonaisService";

const serviceProf = new ProfissionaisService()

interface PropsProfPremios {
    key: number;
    id_vendas: number;
    idNp: number;
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


export default function AdminProfPremiosPedidos(){

    const { loja, setLoja } = useContext(UsuarioContext);
    const { idLoja, setIdLoja } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);

    const [dados, setDados] = useState<PropsProfPremios[]>([]);
    const [registros, setQuantidade] = useState(0);
    const [loading, setLoading] = useState(false);

    
    useEffect(() => {
        // listaPedidosPremios()
    }, [])


    async function listaPedidosPremios() {
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
    const columns: TableColumnsType<PropsProfPremios> = [
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
            title: 'Data', dataIndex: 'data_lancamento', key: 'data_lancamento', width: '80px',
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
                        <Button icon={<CheckOutlined />} type="primary" style={{ marginRight: 2, marginBottom: 2, backgroundColor: '#008000' }} disabled={record.status == 'A' || record.status == 'R'} />
                    </Tooltip>
                    <Tooltip title="Rejeitar" color="#000">
                        <Button icon={<CloseCircleOutlined />} type="primary" style={{ marginRight: 2, marginBottom: 2, backgroundColor: 'red' }} disabled={record.status == 'A' || record.status == 'R' || record.aberto == 'P' } />
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
                            showTotal: (total, range) => `Mostrando ${range[0]}-${range[1]} de ${total} produtos`, // Exibe informações sobre o total de registros
                        }}
                    />
                </div>
            </Spin>
        </div>
    )
}