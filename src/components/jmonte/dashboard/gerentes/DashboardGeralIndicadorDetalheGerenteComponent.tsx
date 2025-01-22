

import { Spin, Table, TableColumnsType, Typography } from "antd";
import { useContext, useEffect, useState } from "react";


import { UsuarioContext } from "../../../../context/useContext";
import DashBoardVendedoresService from "../../../../service/DashBoardVendedores";

const serviceDashBoardVendedor = new DashBoardVendedoresService()

interface DataTypeClientes {
    key: string;
    cod_indica_pre: string;
    indicador: string;
    umDia: number;
    semanaAnterior: number;
    mesAnterior: number;
    centoOitentaDias: number;
}

export default function DashboardGeralIndicadorDetalheGerenteComponent(props: any) {
    const [loading, setLoading] = useState(false);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { icomp, setIcomp } = useContext(UsuarioContext);
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);



    const [dadosIndicador, setDadosIndicador] = useState<DataTypeClientes[]>([]);
    const [codIndicadorAtual, setCodIndicadorAtual] = useState<string | null>(null);

    useEffect(() => {
        console.log(props.indicador)
        buscaListaVendasDetalhe()
    }, [props])

    async function buscaListaVendasDetalhe() {
        setLoading(true)
        try {

            //***************** vendedores x indicador inicio *************/

            let rsClientes = await serviceDashBoardVendedor.listarDashBoardGerenteIndicadoresListaDetalhes(icomp, props.indicador)
            setDadosIndicador(rsClientes.data.lista_detalhes_indicadores)
            setCodIndicadorAtual(rsClientes.data.lista_detalhes_indicadores[0].indicador)

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
            title: "DIA ANT.",
            dataIndex: "umDia",
            key: "umDia",
            align: "left",
            render: (text: string, record: any) =>
                <span style={{ fontSize: tamFonte }} >
                    {record.umDia > 0 ? parseFloat(record.umDia).toFixed(2) : '0.00'}
                </span>,
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#87CEEB",
                },
            }),
        },
        {
            title: "SEMANA ANT.",
            dataIndex: "semanaAnterior",
            key: "semanaAnterior",
            align: "left",
            render: (text: string, record: any) =>
                <span style={{ fontSize: tamFonte }} >
                    {record.semanaAnterior > 0 ? parseFloat(record.semanaAnterior).toFixed(2) : '0.00'}
                </span>,
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#87CEEB",
                },
            }),
        },
        {
            title: "MÊS ANT.",
            dataIndex: "mesAnterior",
            key: "mesAnterior",
            align: "left",
            render: (text: string, record: any) =>
                <span style={{ fontSize: tamFonte }} >
                    {record.mesAnterior > 0 ? parseFloat(record.mesAnterior).toFixed(2) : '0.00'}
                </span>,
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#87CEEB",
                },
            }),
        },
        {
            title: "180 DIAS",
            dataIndex: "centoOitentaDias",
            key: "centoOitentaDias",
            align: "left",
            render: (text: string, record: any) =>
                <span style={{ fontSize: tamFonte }} >
                    {record.centoOitentaDias > 0 ? parseFloat(record.centoOitentaDias).toFixed(2) : 'R$ 0.00'}
                </span>,
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#87CEEB",
                },
            }),
        },
        ];
    return (
        <Spin
            spinning={loading}
            tip="Carregando..."
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
                    dataSource={dadosIndicador}
                    size="small"
                    rowKey={(record) => record.cod_indica_pre}
                    bordered
                    title={() => (
                        <Typography style={{ fontSize: "1.0rem" }}>Cód.: {codIndicadorAtual}</Typography>
                    )}
                    pagination={false}
                />
            </div>

        </Spin>
    );
}