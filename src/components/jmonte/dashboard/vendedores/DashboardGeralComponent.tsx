import { Card, Skeleton, Spin, Table, TableColumnsType, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../../../../context/useContext";
import DashBoardVendedoresService from "../../../../service/DashBoardVendedores";

const serviceDashBoardVendedor = new DashBoardVendedoresService()

interface DataType {
    key: string;
    periodo: string;
    acumulado: string;
}

export default function DashboardGeralComponent() {
    const [loading, setLoading] = useState(false);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { icomp, setIcomp } = useContext(UsuarioContext);
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);

    const [dadosUmDia, setDadosUmDia] = useState<number>(0);
    const [dadosSemana, setDadosSemana] = useState(0)
    const [dadosMesAnterior, setDadosMesAnterior] = useState(0)
    const [dadosSeisMeses, setDadosSeisMeses] = useState(0)

    useEffect(() => {
        buscaDados()
    }, [])


    async function buscaDados() {
        try {
            setLoading(true);

            //***************** vendedores geral inicio ******************/
            const [
                rsUmDia,
                rsUmaSemana,
                rsMesAnterior,
                rsSeisMeses,
            ] = await Promise.all([
                serviceDashBoardVendedor.listarDashBoardVendedorUmDia(codigoUsuario),
                serviceDashBoardVendedor.listarDashBoardVendedorSemanaAnterior(codigoUsuario),
                serviceDashBoardVendedor.listarDashBoardVendedorMesAnterior(codigoUsuario),
                serviceDashBoardVendedor.listarDashBoardVendedorSeisMeses(codigoUsuario),
            ]);

            setDadosUmDia(rsUmDia.data.lista_um_dia_vendedor[0].acumuladoumdia);
            setDadosSemana(rsUmaSemana.data.lista_semana_anterior[0].acumuladosemananterior);
            setDadosMesAnterior(rsMesAnterior.data.lista_mes_ant_vendedor[0].acumuladomesanterior);
            setDadosSeisMeses(rsSeisMeses.data.lista_seis_meses[0].acumuladoseismeses);
            //***************** vendedores geral fim ****************/

        } catch (error) {
            console.error('Erro ao buscar dados um dia:', error);
        } finally {
            setLoading(false);
        }
    }



    const tamFonte = '0.9rem';
    const tamFonteTitulo = '1.2rem';
    const colorContatou = 'blue'
    const corDestaque = '#000'

    const dadosGeral: DataType[] = [
        { key: "1", periodo: "DIA ANT.", acumulado: `${dadosUmDia > 0 ? dadosUmDia : 'R$ 0.00'}` },
        { key: "2", periodo: "SEMANA ANT.", acumulado: `${dadosSemana > 0 ? dadosSemana : 'R$ 0.00'}` },
        { key: "3", periodo: "MÊS ANT.", acumulado: `${dadosMesAnterior > 0 ? dadosMesAnterior : 'R$ 0.00'}` },
        { key: "4", periodo: "180 DIAS", acumulado: `${dadosSeisMeses > 0 ? dadosSeisMeses : 'R$ 0.00'}` },
    ];
    const columnsGeral: TableColumnsType<DataType> = [
        {
            title: "PERÍODO",
            dataIndex: "periodo",
            key: "periodo",
            align: "left",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#B22222",
                    color: "#FFFFFF",
                },
            }),
        },
        {
            title: "VL ACUM.",
            dataIndex: "acumulado",
            key: "acumulado",
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


    return (
        <div style={{ maxWidth: '600px', paddingBottom: '10px' }}>
            <Card style={{ backgroundColor: '#F5F5F5', padding: '0px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', }}
                bordered
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
                    <div>
                        <Table
                            columns={columnsGeral}
                            dataSource={dadosGeral}
                            size="small"
                            rowKey={(record) => record.key}
                            bordered
                            // title={() => (
                            //     <Typography style={{ fontSize: "1.2rem" }}>Pendências(Geral)</Typography>
                            // )}
                            pagination={false}
                        />
                    </div>
                </Skeleton>
            </Card>
        </div>
    )
}