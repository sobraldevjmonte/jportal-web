import { useContext, useEffect, useState } from "react";
import AnaliseNpService from "../../../../service/AnaliseNpService";
import { Spin, Table, TableColumnsType, Typography } from "antd";
import { UsuarioContext } from "../../../../context/useContext";
// import { AlignType } from 'antd/es/table/interface';

const service = new AnaliseNpService()

interface AnaliseNpProdutosType {
    key: string;
    seq: string;
    codproduto: string;
    produto: string;
    codgrupo: string;
    comprador: string;
    quantidade: number;
    valor_und: number;
    vlr_vendido: number;
    vlr_tabela: number;
    desconto: number;
    imposto: number;
    desp_adm: number;
    fator_financeiro: number;
    lucro: number;
    taxaentrega: number;
}

interface PropsAnaliseNpProdutos {
    idNp: number;
}


export default function TabelaAnaliseNpProdutosAdminComponent(props: any) {
    const [dados, setDados] = useState([]);
    const [registros, setQuantidade] = useState(0);
    const [loading, setLoading] = useState(false);

    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { subNivel1, setSubNivel1 } = useContext(UsuarioContext);

    useEffect(() => {
        listaProdutosNp()
    }, [])

    async function listaProdutosNp() {

        setLoading(true);
        try {
            let rs = await service.listarProdutosNp(props.np);
            console.log(rs);
            setDados(rs.data.lista_produtos_np)
            setQuantidade(rs.data.registros)
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    }

    const tamFonte = '0.9rem';
    const colorContatou = 'blue'
    const corDestaque = '#000'

    const columns: TableColumnsType<AnaliseNpProdutosType> = [
        { title: 'PRODUTO', dataIndex: 'produto', key: 'produto', },
        { title: 'COMPRADOR', dataIndex: 'comprador', key: 'comprador', },
        {
            title: 'QTDE.VND', dataIndex: 'quantidade', key: 'quantidade', align: 'right',
            render: (text: string, record: any) => <span style={{ fontSize: tamFonte }} >{(parseFloat(record.quantidade)).toFixed(2)} </span>
        },
        {
            title: 'VLR UNIT', dataIndex: 'valor_und', key: 'valor_und', align: 'right',
            render: (text: string, record: any) => <span style={{ fontSize: tamFonte }} >{(parseFloat(record.valor_und)).toFixed(2)} </span>
        },
        {
            title: 'VLR VENDA', dataIndex: 'vlr_vendido', key: 'vlr_vendido', align: 'right',
            render: (text: string, record: any) => <span style={{ fontSize: tamFonte }} >{(parseFloat(record.vlr_vendido)).toFixed(2)} </span>
        },
        {
            title: 'VLR TABELA', dataIndex: 'vlr_tabela', key: 'vlr_tabela', align: 'right',
            render: (text: string, record: any) => <span style={{ fontSize: tamFonte }} >{(parseFloat(record.vlr_tabela)).toFixed(2)} </span>
        },
        {
            title: 'DIFF.TAB', dataIndex: 'desconto', key: 'desconto', align: 'right',
            render: (text: string, record: any) => <span style={{ fontSize: tamFonte }} >{(parseFloat(record.desconto)).toFixed(2)} </span>
        },
        {
            title: 'IMPOSTO', dataIndex: 'imposto', key: 'imposto', align: 'right',
            render: (text: string, record: any) => <span style={{ fontSize: tamFonte }} >{(parseFloat(record.imposto)).toFixed(2)} </span>
        },
        {
            title: 'DESP.ADM', dataIndex: 'desp_adm', key: 'desp_adm', align: 'right',
            render: (text: string, record: any) => <span style={{ fontSize: tamFonte }} >{(parseFloat(record.desp_adm)).toFixed(2)} </span>
        },
        {
            title: 'FF%', dataIndex: 'fator_financeiro', key: 'fator_financeiro', align: 'right',
            render: (text: string, record: any) => <span style={{ fontSize: tamFonte }} >{(parseFloat(record.fator_financeiro)).toFixed(2)} </span>
        },
        ...(idNivelUsuario === 1 && subNivel1 === 1 || idNivelUsuario === 11 && subNivel1 === 1 || idNivelUsuario === 9 && subNivel1 === 1
            ? [{
                title: 'LUCRO', 
                dataIndex: 'lucro', 
                key: 'lucro', 
                align: 'right' as 'right', // Define o alinhamento com casting explícito
                render: (text: string, record: any) => (
                    <span style={{ fontSize: tamFonte }}>{parseFloat(record.lucro).toFixed(2)}</span>
                ),
            }]
            : []
        ),
        // {
        //     title: 'LUCRO', dataIndex: 'lucro', key: 'lucro', align: 'right',
        //     render: (text: string, record: any) => (idNivelUsuario === 1 && subNivel1 === 1)|| (idNivelUsuario === 11 && subNivel1 === 1) ?  <span style={{ fontSize: tamFonte }} >{(parseFloat(record.lucro)).toFixed(2)} </span> : null 
        // },
        {
            title: 'TAXA ENTREGA', dataIndex: 'taxaentrega', key: 'taxaentrega', align: 'right',
            render: (text: string, record: any) => <span style={{ fontSize: tamFonte }} >{(parseFloat(record.taxaentrega)).toFixed(2)} </span>
        },
    ];

    return (
        <>
            <div style={{ backgroundColor: '#FFFAF0' }}>
                <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div style={{ padding: '', position: 'relative', paddingTop: '20px', paddingRight: '30px' }}>
                        <Table
                            columns={columns}
                            dataSource={dados}
                            //dataSource={[...dados, totalRow]}
                            size="small"
                            rowKey={(record) => record.key}
                            bordered
                            title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>Produtos da NP {props.idNp}({registros})</Typography>}
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
        </>
    )
}