import { Modal, Spin, Table, TableColumnsType, Typography } from "antd";
import { useContext, useEffect, useState } from "react";

import DashBoardVendedoresService from "../../../../service/DashBoardVendedores";
import { UsuarioContext } from "../../../../context/useContext";

import { formatarSemDecimaisEmilhares } from "../../../../utils/formatarValores";

const serviceDashBoardVendedor = new DashBoardVendedoresService()

interface DataTypeClientes {
    key: string;
    acumulado: number;
    np: number;
    cliente: string;
}

export default function DashboardVendedoresGeralNps(props: any) {
    const [loading, setLoading] = useState(false);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { icomp, setIcomp } = useContext(UsuarioContext);
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);



    const [dadosClientes, setDadosClientes] = useState<DataTypeClientes[]>([]);
    const [quant, setQuant] = useState(0)

    useEffect(() => {
        buscaListaVendasDetalhe()
        console.log('********** modal hoje **********')
        console.log(props)
        console.log('********** modal hoje **********')
    }, [props])

    async function buscaListaVendasDetalhe() {
        setLoading(true)
        try {

            //***************** vendedores x clientes inicio *************/

            let rsClientes = await serviceDashBoardVendedor.listaDadosVendedorGeralNps(icomp, props.periodo, codigoUsuario)
            setDadosClientes(rsClientes.data.lista_nps_cliente)
            setQuant(rsClientes.data.lista_nps_cliente.length)

            console.log(rsClientes)

        } catch (error) {
            console.error('Erro ao buscar dados um dia:', error);
        } finally {
            setLoading(false);
        }
    }


    const tamFonte = '0.9rem';
    const colorContatou = 'blue'
    const corDestaque = '#000'

    const columnsClientes: TableColumnsType<DataTypeClientes> = [
        {
            title: "NP",
            dataIndex: "np",
            key: "np",
            align: "left",
            render: (text: string, record: any) =>
                <span style={{ fontSize: tamFonte }} >
                    {record.np}
                </span>,
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#B0C4DE",
                },
            }),
        },
        {
            title: "CLIENTE",
            dataIndex: "cliente",
            key: "cliente",
            align: "left",
            render: (text: string, record: any) =>
                <span style={{ fontSize: tamFonte }} >
                    {record.cliente}
                </span>,
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#B0C4DE",
                },
            }),
        },
       
        {
            title: "TOTAL(R$)",
            dataIndex: "acumulado",
            key: "acumulado",
            align: "left",
            render: (text: string, record: any) =>
                <span style={{ fontSize: tamFonte }} >
                    {record.acumulado > 0 ? formatarSemDecimaisEmilhares(record.acumulado) : 0}
                </span>,
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#B0C4DE",
                },
            }),
        },
    ];

    return (
        <Spin
            spinning={loading}
            tip="Carregando NPs..."
            style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
            }}
        >


            <div style={{ padding: "0px 0px" }}>
                <Table
                    columns={columnsClientes}
                    dataSource={dadosClientes}
                    size="small"
                    rowKey={(record) => record.np}
                    bordered
                    title={() => (
                        <Typography style={{ fontSize: "1.0rem" }}>NPs do cliente(Total {quant})</Typography>
                    )}
                    pagination={{
                        defaultPageSize: 5, // Define o tamanho padrão da página
                        pageSizeOptions: ['5', '10', '20'], // Opções de tamanho de página disponíveis
                    }}
                />
            </div>
        </Spin>
    );
}