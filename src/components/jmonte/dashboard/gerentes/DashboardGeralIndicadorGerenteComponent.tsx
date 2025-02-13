
import { UsuarioContext } from "../../../../context/useContext";

import { Button, Card, Modal, Skeleton, Table, TableColumnsType } from "antd";
import { useContext, useEffect, useState } from "react";
import DashBoardVendedoresService from "../../../../service/DashBoardVendedores";

import DashboardGeralIndicadorDetalheGerenteComponent from "./DashboardGeralIndicadorDetalheGerenteComponent";

import { formatarSemDecimaisEmilhares } from "../../../../utils/formatarValores";
import { ReloadOutlined } from "@ant-design/icons";

const serviceDashBoardVendedor = new DashBoardVendedoresService()

interface DataTypeProfissionais {
    key: string;
    cod_indica_pre: string;
    indicador: string;
    valorTotal: string;
}
export default function DashboardGeralIndicadorGerenteComponent(props: any) {
    const [loading, setLoading] = useState(false);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { icomp, setIcomp } = useContext(UsuarioContext);
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);


    const [dadosProfissionais, setDadosProfissionais] = useState<DataTypeProfissionais[]>([]);
    useEffect(() => {
        buscaDados()
    }, [])
    async function buscaDados() {
        try {
            setLoading(true);
            let rsIndica = await serviceDashBoardVendedor.listarDashBoardIndicadorIndicadoresLista(icomp)
            setDadosProfissionais(rsIndica.data.lista_indicadores_desc)

        } catch (error) {
            console.error('Erro ao buscar dados um dia:', error);
        } finally {
            setLoading(false);
        }
    }


    ////******************** clientes ************************/
    const columnsProfissionais: TableColumnsType<DataTypeProfissionais> = [
        {
            title: "INDICADOR",
            dataIndex: "indicador",
            key: "indicador",
            align: "left",
            render: (text: any, record: any) => (
                <Button type="link" onClick={() => showModalIndicador(record)} style={{ color: '#000', textDecoration: 'none' }}>
                    {record.indicador}
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
            dataIndex: "valorTotal",
            key: "valorTotal",
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


    //************************** modal   dados indicador ***********************/
    const [isModalVisibleIndicador, setIsModalVisibleIndicador] = useState(false);
    const [indicadorSelecionado, setIndicadorSelecionado] = useState<any>(null);

    const showModalIndicador = (record: any) => {
        setIndicadorSelecionado(record);
        setIsModalVisibleIndicador(true);
    };

    const handleCancelIndicador = () => {
        setIndicadorSelecionado(null);
        setIsModalVisibleIndicador(false);
    };


    //************************** modal dados indicador ***********************/

    const tamFonteTitulo = '1.2rem';
    const colorContatou = 'blue'
    const corDestaque = '#000'

    function refresh() {
        buscaDados()
    }


    return (
        <div style={{ maxWidth: '900px', paddingBottom: '10px' }}>
            <Card
                style={{ backgroundColor: '#F5F5F5', padding: '0px', margin: '0px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', }}
                title={<span style={{ fontSize: tamFonteTitulo }}>PENDÊNCIAS POR INDICADOR</span>}
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
                        columns={columnsProfissionais}
                        dataSource={dadosProfissionais}
                        size="small"
                        rowKey={(record) => record.cod_indica_pre}
                        bordered
                        // title={() => (
                        //     <Typography style={{ fontSize: "1.2rem" }}>Pendências (Por Indicador)</Typography>
                        // )}
                        pagination={{
                            defaultPageSize: 5, // Define o tamanho padrão da página
                            pageSizeOptions: ['5', '10', '20'], // Opções de tamanho de página disponíveis
                        }}
                    />
                    <Modal
                        title={`Detalhes do Indicador: ${indicadorSelecionado?.indicador || ""}`}
                        visible={isModalVisibleIndicador}
                        onCancel={handleCancelIndicador}
                        footer={null}
                        width={800}
                    >
                        {indicadorSelecionado && (
                            <DashboardGeralIndicadorDetalheGerenteComponent
                                indicador={indicadorSelecionado.cod_indica_pre}
                                nome={indicadorSelecionado.indicador}
                            />
                        )}
                    </Modal>
                </Skeleton>
            </Card>
        </div>
    )
}