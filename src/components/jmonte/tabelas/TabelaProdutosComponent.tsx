import { Spin, Table, TableColumnsType } from "antd";
import Typography from "antd/es/typography/Typography";
import { useEffect, useState } from "react";
import RtService from '../../../service/RtService';

const service = new RtService()

interface ProdutosType {
    key: number;
    cod_produto_pre: string; //ok
    produto: string; //ok
    tabela: string; //ok
    quant: number; //ok
    vlr_und: number; //ok
    vlr_custo: number; //ok
    vlr_importo: number; //ok
    vlr_tabela: number;
    vlr_desp_adm: number;
    vlr_fator_financeiro: number;
    vlr_lucro: number;
    vlr_lucro_bruto: number;
    vlr_total: number;
}

export default function TabelaProdutosComponent(props: any) {
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aux, setAux] = useState('')

    console.log('---------- Component produtos pre-vendas --------------')
    useEffect(() => {
        if (aux != props.idIndicador) {
            listaProdutosPreVendas()
            setAux(props.idIndicador)
        }
    }, [])

    async function listaProdutosPreVendas() {
        try {
            setLoading(true);
            let rs = await service.listaProdutos(props.np);
            setDados(rs.data.produtos)
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    }

    const columns: TableColumnsType<ProdutosType> = [
        { title: 'Código', dataIndex: 'cod_produto_pre', key: 'cod_produto_pre', width: '30px' },
        { title: 'Descrição', dataIndex: 'produto', key: 'produto' },
        { title: 'Tab.', dataIndex: 'tabela', key: 'tabela', width: '20px' },
        { title: 'Quant.', dataIndex: 'quant', key: 'quant' },
        { title: 'Vl.Und', dataIndex: 'vlr_und', key: 'vlr_und', render: (text: string) => <span>R$ {text}</span> },
        { title: 'Vl.Custo', dataIndex: 'vlr_custo', key: 'vlr_custo', render: (text: string) => <span>R$ {text}</span> },
        { title: 'Vl.Imposto', dataIndex: 'vlr_importo', key: 'vlr_importo', render: (text: string) => <span>R$ {text}</span> },
        { title: 'Vl.Tabela', dataIndex: 'vlr_tabela', key: 'vlr_tabela', render: (text: string) => <span>R$ {text}</span> },
        { title: 'Vl.Desp.Adm.', dataIndex: 'vlr_desp_adm', key: 'vlr_desp_adm', render: (text: string) => <span>R$ {text}</span> },
        { title: 'Vl.Fat.Fin.', dataIndex: 'vlr_fator_financeiro', key: 'vlr_fator_financeiro', render: (text: string) => <span>R$ {text}</span> },
        { title: 'Lucro', dataIndex: 'vlr_lucro', key: 'vlr_lucro' },
        { title: 'Lucro Bruto', dataIndex: 'vlr_lucro_bruto', key: 'vlr_lucro_bruto', render: (text: string) => <span>R$ {text}</span> },
        { title: 'Vl Total', dataIndex: 'vlr_total', key: 'vlr_total', render: (text: string) => <span>R$ {text}</span> },
    ];

    return (
        <>
            <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <Table
                    columns={columns} 
                    dataSource={dados} 
                    pagination={false} 
                    style={{backgroundColor: '#FFF8DC'}}
                    rowKey={(record) => record.cod_produto_pre}
                    title={() => <Typography style={{fontSize: '1.2rem', padding: '0px'}}>Produtos</Typography>}
                />
            </Spin>
        </>
    );
}

