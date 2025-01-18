import { UsuarioContext } from "../../../../context/useContext";

import { Button, Card, Modal, Skeleton, Table, TableColumnsType } from "antd";
import { useContext, useEffect, useState } from "react";
import DashBoardVendedoresService from "../../../../service/DashBoardVendedores";

import DashboardDetalhesVendedores from "./DashboardDetalhesVendedoresClientes";

const serviceDashBoardVendedor = new DashBoardVendedoresService()

interface DataTypeClientes {
    key: string;
    cod_cliente_pre: string;
    cliente: string;
    valortotal: number;
}


export default function DashboardGeralClienteComponent(props: any) {
    const [loading, setLoading] = useState(false);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { icomp, setIcomp } = useContext(UsuarioContext);
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);

    const [dadosClientes, setDadosClientes] = useState<DataTypeClientes[]>([]);


    useEffect(() => {
        buscaDados()
    }, [])


    async function buscaDados() {
        try {
            setLoading(true);

            //***************** vendedores x clientes inicio *************/
            let rsClientes = await serviceDashBoardVendedor.listarDashBoardVendedorClienteLista(codigoUsuario)
            setDadosClientes(rsClientes.data.lista_clientes_desc)

        } catch (error) {
            console.error('Erro ao buscar dados um dia:', error);
        } finally {
            setLoading(false);
        }
    }
    const columnsClientes: TableColumnsType<DataTypeClientes> = [
        {
            title: "CLIENTE",
            dataIndex: "cliente",
            key: "cliente",
            align: "left",
            render: (text: any, record: any) => (
                <Button type="link" onClick={() => showModal(record)}>
                    {record.cliente}
                </Button>
            ),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#B22222",
                    color: "#FFFFFF",
                },
            }),
        },

        {
            title: "VL ACUM.",
            dataIndex: "valortotal",
            key: "valortotal",
            align: "right",
            render: (text: string) => <span>R$ {text}</span>,
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#B22222",
                    color: "#FFFFFF",
                },
            }),
        },
    ];


    //************************** modal   dados cliente ***********************/
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);

    const showModal = (record: any) => {
        setClienteSelecionado(record);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setClienteSelecionado(null);
        setIsModalVisible(false);
    };



    const tamFonte = '0.9rem';
    const tamFonteTitulo = '1.2rem';
    const colorContatou = 'blue'
    const corDestaque = '#000'


    return (
        <div style={{ maxWidth: '600px', paddingBottom: '10px' }}>
            <Card style={{ backgroundColor: '#F5F5F5', padding: '0px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', }}
                title={<span style={{ fontSize: tamFonteTitulo }}>Pendências Geral</span>}
                tabProps={{
                    size: 'middle',
                }}>
                <Skeleton
                    active
                    loading={loading}
                    style={{ backgroundColor: '#fff' }} // Cor de fundo para todo o Skeleton
                    paragraph={{ rows: 4, style: { backgroundColor: '#fff' } }} // Cor para as linhas
                    title={{ style: { backgroundColor: '#fff' } }} // Cor para o título
                >
                    <Table
                        columns={columnsClientes}
                        dataSource={dadosClientes}
                        size="small"
                        rowKey={(record) => record.cod_cliente_pre}
                        bordered
                        // title={() => (
                        //     <Typography style={{ fontSize: "1.2rem" }}>Pendências (Por Cliente)</Typography>
                        // )}
                        pagination={false}
                    />
                    <Modal
                        title={`Detalhes do Cliente: ${clienteSelecionado?.cliente || ""}`}
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        width={800}
                    >
                        {clienteSelecionado && (
                            <DashboardDetalhesVendedores
                                codigo={clienteSelecionado.cod_cliente_pre}
                                nome={clienteSelecionado.cliente}
                            />
                        )}
                    </Modal>
                </Skeleton>
            </Card>
        </div>
    )
}