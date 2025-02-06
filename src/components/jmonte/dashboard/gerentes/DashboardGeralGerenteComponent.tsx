import { Button, Card, Modal, Skeleton, Table, TableColumnsType, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../../../../context/useContext";
import DashBoardVendedoresService from "../../../../service/DashBoardVendedores";

import { formatarSemDecimaisEmilhares } from "../../../../utils/formatarValores"
import { ReloadOutlined } from "@ant-design/icons";
import DashboardGerenteGeralNps from "./DashboardGerenteGeralNps";


const serviceDashBoardVendedor = new DashBoardVendedoresService()

interface DataType {
    key: string;
    periodo: string;
    acumulado: number;
}

export default function DashboardGeralGerenteComponent() {
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
                serviceDashBoardVendedor.listarDashBoardGerenteHoje(icomp),
                serviceDashBoardVendedor.listarDashBoardGerenteUmDia(icomp),
                serviceDashBoardVendedor.listarDashBoardGerenteSemanaAnterior(icomp),
                serviceDashBoardVendedor.listarDashBoardGerenteMesAnterior(icomp),
                serviceDashBoardVendedor.listarDashBoardGerenteSeisMeses(icomp),
            ]);

            setDadosHoje(rsHoje.data.lista_um_hoje[0].acumuladohoje);
            setDadosUmDia(rsUmDia.data.lista_um_dia_vendedor[0].acumuladoumdia);
            setDadosSemana(rsUmaSemana.data.lista_semana_anterior[0].acumuladosemananterior);
            setDadosMesAnterior(rsMesAnterior.data.lista_mes_ant_vendedor[0].acumuladomesanterior);
            setDadosSeisMeses(rsSeisMeses.data.lista_seis_meses[0].acumuladoseismeses);
            //***************** vendedores geral fim ****************/

            console.log(rsSeisMeses)

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
        <div style={{ maxWidth: '900px', paddingBottom: '10px' }}>
            <Card style={{ backgroundColor: '#F5F5F5', padding: '0px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', }}
                title={<span style={{ fontSize: tamFonteTitulo }}>PENDÊNCIAS(Loja)</span>}
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
                                <DashboardGerenteGeralNps
                                    periodo={periodoSelecionado}
                                    nome={periodoSelecionado}
                                />
                            )}
                        </Modal>
                    </div>
                </Skeleton>
            </Card>
        </div>
    )
}