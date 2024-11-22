import { Spin, Table, TableColumnsType, Typography } from "antd";
import { useEffect, useState } from "react";
import RtService from '../../../service/RtService';
import TabelaProdutosComponent from "./TabelaProdutosComponent";

const service = new RtService()
interface PreVendasType {
    key: number;
    np: string; //ok
    data_pre: string; //ok
    nome_cliente: string; //ok
    vendedor: string; //ok
    loja: string; //ok
    idIndicador: string; //ok
    comissao: number; //ok
    perc_ap: number;
    total_vlr_tabela: number;
    total_vlr_base_pp_lista: number;
    total_lb_percentual: number;
    valor_pp: number;
    vlr_fator_financeiro: number;
    vlr_lb_fator_financeiro: number;
    vlr_diff_tab: number;
    vlr_base_pp: number;
    plano: string; //ok
}

export default function TabelaPreVendasComponent(props: any) {
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aux, setAux] = useState('')

    console.log('---------- Component pre-vendas --------------')
    useEffect(() => {
        if (aux !== props.idIndicador) {
            listaPreVendas()
            setAux(props.idIndicador)
        }
    }, [])


    async function listaPreVendas() {
        try {
            setLoading(true);
            let rs = await service.listaPreVendas(props.idIndicador, props.mes, props.ano, props.loja);
            setDados(rs.data.prevendas)
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    }

    const columns: TableColumnsType<PreVendasType> = [
        { title: 'Pré-Venda', dataIndex: 'np', key: 'cod_indica_pre', width: '100px' },
        { title: 'Data', dataIndex: 'data_pre', key: 'data_pre', width: '100px' },
        { title: 'Loja', dataIndex: 'loja', key: 'loja', width: '100px' },
        { title: 'Cliente', dataIndex: 'nome_cliente', key: 'nome_cliente' },
        { title: 'Vendedor', dataIndex: 'vendedor', key: 'vendedor' },
        { title: 'F.Pgto', dataIndex: 'plano', key: 'plano'},
        { title: 'Vlr.Venda', dataIndex: 'ptotal', key: 'ptotal', render: (text: string) => <span>R$ {text}</span>},
        { title: 'Vlr.Tabela.', dataIndex: 'total_vlr_tabela', key: 'total_vlr_tabela', render: (text: string) => <span>R$ {text}</span>},
        { title: 'Vlr.Base PP', dataIndex: 'total_vlr_base_pp_lista', key: 'total_vlr_base_pp_lista',  render: (text: string) => <span>R$ {text}</span>},
        { title: '(%)L.B.', dataIndex: 'total_lb_percentual', key: 'cod_indica_pre', align: 'right', render: (text: string) => <span >{text}</span> },
        { title: '(%)FatorFin.', dataIndex: 'vlr_fator_financeiro', key: 'vlr_fator_financeiro', align: 'right', render: (text: string) => <span >{text}</span> },
        { title: '(%)LB.Fator', dataIndex: 'vlr_lb_fator_financeiro', key: 'vlr_lb_fator_financeiro', align: 'right', render: (text: string) => <span >{text}</span> },
        { title: '(%)Diff.Tab.', dataIndex: 'vlr_diff_tab', key: 'vlr_diff_tab', align: 'right', render: (text: string) => <span >{text}</span> },
        { title: 'VL.PP.', dataIndex: 'valor_pp', key: 'valor_pp', align: 'right', render: (text: string) => <span >{text}</span> },
    ];

    //***************** Inserindo Componente TabelaProdutosComponent  ******************/
    const expandedRowRender = (record: any) => {
        let x = record.np
        return <TabelaProdutosComponent np={x} />;
    };

    return (
        <>
            <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <Table
                    columns={columns}
                    dataSource={dados}
                    pagination={false}
                    size="small"
                    expandedRowRender={expandedRowRender}
                    rowKey={(record) => record.np}
                    style={{backgroundColor: '#B0E0E6'}}
                    title={() => <Typography style={{fontSize: '1.2rem', padding: '0px'}}>Pré-Vendas</Typography>}
                    bordered
                />
            </Spin>
        </>
    );
}

