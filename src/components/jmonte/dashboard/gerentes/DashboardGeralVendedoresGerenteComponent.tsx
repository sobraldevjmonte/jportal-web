
import { UsuarioContext } from "../../../../context/useContext";

import { Button, Card, Modal, Skeleton, Table, TableColumnsType } from "antd";
import { useContext, useEffect, useState } from "react";
import DashBoardVendedoresService from "../../../../service/DashBoardVendedores";

import DashboardGeralVendedorDetalhesGerenteComponent from "./DashboardGeralVendedorDetalhesGerenteComponent";

import { formatarSemDecimaisEmilhares } from "../../../../utils/formatarValores";

const serviceDashBoardVendedor = new DashBoardVendedoresService()

interface DataTypeClientes {
    key: string;
    cod_vendedor_pre: string;
    nome: string;
    acumulado: number;
}


export default function DashboardGeralVendedoresGerenteComponent(props: any) {
    const [loading, setLoading] = useState(false);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { icomp, setIcomp } = useContext(UsuarioContext);
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);

    const [dadosVendedores, setDadosVendedores] = useState<DataTypeClientes[]>([]);


    useEffect(() => {
        buscaDados()
    }, [])


    async function buscaDados() {
        try {
            setLoading(true);
            let rsClientes = await serviceDashBoardVendedor.listarDashBoardGerenteVendedoresLista(icomp)
            setDadosVendedores(rsClientes.data.lista_vendedores_desc)

        } catch (error) {
            console.error('Erro ao buscar dados um dia:', error);
        } finally {
            setLoading(false);
        }
    }
    const columnsClientes: TableColumnsType<DataTypeClientes> = [
        {
            title: "VENDEDOR",
            dataIndex: "nome",
            key: "nome",
            align: "left",
            render: (text: any, record: any) => (
                <Button type="link" onClick={() => showModal(record)} style={{ color: '#000', textDecoration: 'none' }}>
                    {record.nome}
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
            title: "ACUMULADO",
            dataIndex: "acumulado",
            key: "acumulado",
            align: "right",
            render: (text: string) => <span>{formatarSemDecimaisEmilhares(text)}</span>,
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
        <div style={{ maxWidth: '900px', paddingBottom: '10px' }}>
            <Card style={{ backgroundColor: '#F5F5F5', padding: '0px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', }}
                title={<span style={{ fontSize: tamFonteTitulo }}>PENDÊNCIAS POR VENDEDOR</span>}
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
                        dataSource={dadosVendedores}
                        size="small"
                        rowKey={(record) => record.cod_vendedor_pre}
                        bordered
                        // title={() => (
                        //     <Typography style={{ fontSize: "1.2rem" }}>Pendências (Por Cliente)</Typography>
                        // )}
                        pagination={false}
                    />
                    <Modal
                        title={`Detalhes do Cliente: ${clienteSelecionado?.nome || ""}`}
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        width={800}
                    >
                        {clienteSelecionado && (
                            <DashboardGeralVendedorDetalhesGerenteComponent
                                codigo={clienteSelecionado.cod_vendedor_pre}
                                nome={clienteSelecionado.nome}
                            />
                        )}
                    </Modal>
                </Skeleton>
            </Card>
        </div>
    )
}