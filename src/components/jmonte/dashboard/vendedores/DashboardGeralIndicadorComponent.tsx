


import { UsuarioContext } from "../../../../context/useContext";

import { Button, Card, Modal, Skeleton, Table, TableColumnsType } from "antd";
import { useContext, useEffect, useState } from "react";
import DashBoardVendedoresService from "../../../../service/DashBoardVendedores";

import DashboardDetalhesIndicadores from "./../vendedores/DashboardDetalhesIndicadores";

const serviceDashBoardVendedor = new DashBoardVendedoresService()

interface DataTypeProfissionais {
    key: string;
    cod_indica_pre: string;
    indicador: string;
    valorTotal: string;
}
export default function DashboardGeralIndicadorComponent(props: any) {
    const [loading, setLoading] = useState(false);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { icomp, setIcomp } = useContext(UsuarioContext);
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);


    const [dadosProfissionais, setDadosProfissionais] = useState<DataTypeProfissionais[]>([]);
    useEffect(() => {
        // buscaDados()
    }, [])
    async function buscaDados() {
        try {
            setLoading(true);
            let rsIndica = await serviceDashBoardVendedor.listarDashBoardVendedorIndicadoresLista(codigoUsuario)
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
            title: "VL ACUM.",
            dataIndex: "valorTotal",
            key: "valorTotal",
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
    return (
        <div style={{ maxWidth: '600px', paddingBottom: '10px' }}>
            <Card
                style={{ backgroundColor: '#F5F5F5', padding: '0px', margin: '0px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', }}
                title={<span style={{ fontSize: tamFonteTitulo }}>Pendências Por Indicador</span>}
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
                        pagination={false}
                    />
                    <Modal
                        title={`Detalhes do Indicador: ${indicadorSelecionado?.indicador || ""}`}
                        visible={isModalVisibleIndicador}
                        onCancel={handleCancelIndicador}
                        footer={null}
                        width={800}
                    >
                        {indicadorSelecionado && (
                            <DashboardDetalhesIndicadores
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