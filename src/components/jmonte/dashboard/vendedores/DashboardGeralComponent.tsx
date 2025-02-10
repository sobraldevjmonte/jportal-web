import { Button, Card, Modal, Skeleton, Spin, Table, TableColumnsType, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../../../../context/useContext";
import DashBoardVendedoresService from "../../../../service/DashBoardVendedores";
import { formatarSemDecimaisEmilhares } from "../../../../utils/formatarValores";
import { ReloadOutlined } from "@ant-design/icons";
import DashboardDetalhesVendedoresClientes from "./DashboardDetalhesVendedoresClientes";
import DashboardVendedoresGeralNps from "./DashboardVendedoresGeralNps";

const serviceDashBoardVendedor = new DashBoardVendedoresService()


interface DataType {
    key: string;
    periodo: string;
    acumulado: number;
    nps?: number; // Novo campo opcional
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

    const [registrosdadosHoje, setRegistrosDadosHoje] = useState<number>(0);
    const [registrosdadosUmDia, setRegistrosDadosUmDia] = useState<number>(0);
    const [registrosdadosUmaSemana, setRegistrosDadosUmaSemana] = useState<number>(0);
    const [registrosdadosMesAnterior, setRegistrosDadosMesAnterior] = useState<number>(0);
    const [registrosdadosSeisMeses, setRegistrosDadosSeisMeses] = useState<number>(0);



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

            const registrosHoje = rsHoje.data.lista_hoje_vendedor[0]?.total_pedidos || 0;
            const registrosDiaAnt = rsUmDia.data.lista_um_dia_vendedor[0]?.total_pedidos || 0;
            const registrosSemanaAnt = rsUmaSemana.data.lista_semana_anterior[0]?.total_pedidos || 0;
            const registrosMesAnt = rsMesAnterior.data.lista_mes_ant_vendedor[0]?.total_pedidos || 0;
            const registros180 = rsSeisMeses.data.lista_seis_meses[0]?.total_pedidos || 0;

            setRegistrosDadosHoje(registrosHoje)
            setRegistrosDadosUmDia(registrosDiaAnt)
            setRegistrosDadosUmaSemana(registrosSemanaAnt)
            setRegistrosDadosMesAnterior(registrosMesAnt)
            setRegistrosDadosSeisMeses(registros180)

            const hoje = rsHoje.data.lista_hoje_vendedor[0]?.acumuladohoje || 0;
            const umDia = rsUmDia.data.lista_um_dia_vendedor[0]?.acumuladoumdia || 0;
            const semana = rsUmaSemana.data.lista_semana_anterior[0]?.acumuladosemananterior || 0;
            const mesAnterior = rsMesAnterior.data.lista_mes_ant_vendedor[0]?.acumuladomesanterior || 0;
            const seisMeses = rsSeisMeses.data.lista_seis_meses[0]?.acumuladoseismeses || 0;

            setDadosHoje(hoje);
            setDadosUmDia(umDia);
            setDadosSemana(semana);
            setDadosMesAnterior(mesAnterior);
            setDadosSeisMeses(seisMeses);


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
        {
            key: "1",
            periodo: `HOJE`,
            acumulado: dadosHoje > 0 ? dadosHoje : 0, nps: registrosdadosHoje
        },
        { key: "2", periodo: `DIA ANT.`, acumulado: dadosUmDia > 0 ? dadosUmDia : 0, nps: registrosdadosUmDia },
        { key: "3", periodo: `SEMANA ANT.`, acumulado: dadosSemana > 0 ? dadosSemana : 0, nps: registrosdadosUmaSemana },
        { key: "4", periodo: `MÊS ANT.`, acumulado: dadosMesAnterior > 0 ? dadosMesAnterior : 0, nps: registrosdadosMesAnterior },
        { key: "5", periodo: `180 DIAS`, acumulado: dadosSeisMeses > 0 ? dadosSeisMeses : 0, nps: registrosdadosSeisMeses },
    ];

    const columnsGeral: TableColumnsType<DataType> = [
        {
            title: "PERÍODO",
            dataIndex: "periodo",
            key: "periodo",
            align: "left",
            render: (value: string, record: DataType) => (
                <Button
                    type="link"
                    onClick={() => showModal(value)}  // Agora passamos apenas o período!
                    style={{ color: '#000', textDecoration: 'none' }}
                >
                    {value} {/* O botão exibe o período corretamente */}
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
            title: "NPs",
            dataIndex: "nps",
            key: "nps",
            align: "right",
            render: (value: number) => (
                <span>{formatarSemDecimaisEmilhares(value)}</span>
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
            render: (value: number) => (
                <span>{formatarSemDecimaisEmilhares(value)}</span>
            ),
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
    const [periodoSelecionado, setPeriodoSelecionado] = useState<any>(null);

    const showModal = (periodo: any) => {
        setPeriodoSelecionado(periodo);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setPeriodoSelecionado(null);
        setIsModalVisible(false);
    };
    //************************** modal   dados cliente ***********************/



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
                    <Table
                        columns={columnsGeral}
                        dataSource={dadosGeral}
                        size="small"
                        rowKey={(record) => record.key}
                        bordered
                        // title={() => (
                        //     <Typography style={{ fontSize: "1.2rem" }}>Pendências(Geral)</Typography>
                        // )}
                        pagination={{
                            defaultPageSize: 5, // Define o tamanho padrão da página
                            pageSizeOptions: ['5', '10', '20'], // Opções de tamanho de página disponíveis
                        }}
                    />
                    <Modal
                        title={`Detalhes do Cliente: ${periodoSelecionado || ""}`}
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        width={800}
                    >
                        {periodoSelecionado && (
                            <DashboardVendedoresGeralNps
                                periodo={periodoSelecionado}
                                nome={periodoSelecionado}
                            />
                        )}
                    </Modal>
                </Skeleton>
            </Card>
        </div>
    )
}