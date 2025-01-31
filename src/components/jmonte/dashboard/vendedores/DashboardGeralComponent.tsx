import { Button, Card, Skeleton, Spin, Table, TableColumnsType, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../../../../context/useContext";
import DashBoardVendedoresService from "../../../../service/DashBoardVendedores";
import { formatarSemDecimaisEmilhares } from "../../../../utils/formatarValores";
import { ReloadOutlined } from "@ant-design/icons";

const serviceDashBoardVendedor = new DashBoardVendedoresService()



interface DataType {
    key: string;
    periodo: string;
    acumulado: number;
}

export default function DashboardGeralComponent() {
    const [loading, setLoading] = useState(false);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { icomp, setIcomp } = useContext(UsuarioContext);
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);

    const [dadosHoje, setDadosHoje] = useState<number>(0);
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
                rsHoje,
                rsUmDia,
                rsUmaSemana,
                rsMesAnterior,
                rsSeisMeses,
            ] = await Promise.all([
                serviceDashBoardVendedor.listarDashBoardVendedorHoje(codigoUsuario),
                serviceDashBoardVendedor.listarDashBoardVendedorUmDia(codigoUsuario),
                serviceDashBoardVendedor.listarDashBoardVendedorSemanaAnterior(codigoUsuario),
                serviceDashBoardVendedor.listarDashBoardVendedorMesAnterior(codigoUsuario),
                serviceDashBoardVendedor.listarDashBoardVendedorSeisMeses(codigoUsuario),
            ]);

            setDadosHoje(rsHoje.data.lista_hoje_vendedor[0].acumuladohoje);
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
        { key: "1", periodo: "HOJE", acumulado: dadosHoje > 0 ? dadosHoje : 0 },
        { key: "2", periodo: "DIA ANT.", acumulado: dadosUmDia > 0 ? dadosUmDia : 0 },
        { key: "3", periodo: "SEMANA ANT.", acumulado: dadosSemana > 0 ? dadosSemana : 0 },
        { key: "4", periodo: "MÊS ANT.", acumulado: dadosMesAnterior > 0 ? dadosMesAnterior : 0 },
        { key: "5", periodo: "180 DIAS", acumulado: dadosSeisMeses > 0 ? dadosSeisMeses : 0 },
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

    function refresh() {
        buscaDados()
    }

    return (
        <div style={{ maxWidth: '600px', paddingBottom: '10px' }}>
            <Card style={{ backgroundColor: '#F5F5F5', padding: '0px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', }}
                bordered
                title={<span style={{ fontSize: tamFonteTitulo }}>PENDÊNCIAS(GERAL)</span>}
                extra={
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={refresh}
                        style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50", width: '40px', height: '40px' }}
                    />
                }
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