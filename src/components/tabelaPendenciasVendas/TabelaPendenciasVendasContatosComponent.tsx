import { useEffect, useState } from "react";
import EtapasService from "../../service/EtapasService";
import { Button, Spin, Table, TableColumnsType, Typography } from "antd";
import { SyncOutlined } from "@ant-design/icons";

interface PropsPendenciasVendasContatos {
    idCliente: number;
}

const service = new EtapasService()

interface PreVendasType {
    key: number;
    idcontato: number;
    nomevendedor: string;
    datacontato: string;
    observacao: string;
    contatou: boolean;
}

interface PropsContato {
    idCliente: string;
}

export default function TabelaPendenciasVendasContatosComponent(props: any) {
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantidade, setQuantidade] = useState(0);

    console.log('---------- Component pre-vendas --------------')
    useEffect(() => {
        listaPreVendasContatos()
    }, [])

    async function listaPreVendasContatos() {
        try {
            setLoading(true);
            let rs = await service.listaContatosFeitos(props.idCliente);
            console.log(rs.data)
            setDados(rs.data.contatos)
            setQuantidade(rs.data.quantidade)
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    }

    const columns: TableColumnsType<PreVendasType> = [
        { title: 'Data', dataIndex: 'datacontato', key: 'datacontato', width: '5%' },
        { title: 'Vendedor', dataIndex: 'nomevendedor', key: 'nomevendedor', width: '20%' },
        { title: 'Obs.', dataIndex: 'observacao', key: 'observacao' },
    ];

    return (
        <>
            <div style={{ backgroundColor: '#B0E0E6' }}>
                <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div>
                        <Button type="primary" icon={<SyncOutlined />} onClick={() => listaPreVendasContatos()} style={{ marginTop: '5px', marginBottom: '15px', marginLeft: '15px', width: '130px' }} title="Atualizar registros do vendedor">Atualizar</Button>
                    </div>
                    <div style={{ paddingTop: '20px', paddingLeft: '0px', width: '99%', position: 'relative', backgroundColor: '#B0E0E6' }}>
                        <Table
                            columns={columns}
                            dataSource={dados}
                            pagination={false}
                            size="small"
                            rowKey={(record) => record.idcontato}
                            style={{ backgroundColor: '#B0E0E6' }}
                            title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>Contatos Feitos({quantidade})</Typography>}
                            bordered
                        />
                    </div>
                </Spin>
            </div>
        </>
    )
}