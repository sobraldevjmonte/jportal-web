import { useContext, useEffect, useState } from "react";
import EtapasService from "../../../service/EtapasService"
import { Button, Col, Row, Spin, Table, TableColumnsType, Typography } from "antd";

import { UsuarioContext } from "../../../context/useContext";

import { formatarMoeda, formatarMoedaComSimbolo } from "../../../utils/formatarValores"

// import './css/estilo.css';

const service = new EtapasService()

interface PropsSomaPendencias {
    seq: string;
    total_reais_pendencias: number;
    etapa1: number;
    etapa2: number;
    etapa3: number;
    etapa4: number;
    etapa5: number;
    etapa6: number;
    etapa7: number;
    etapa8: number;
    etapa9: number;
    etapa10: number;
    count_etapa1: number;
    count_etapa2: number;
    count_etapa3: number;
    count_etapa4: number;
    count_etapa5: number;
    count_etapa6: number;
    count_etapa7: number;
    count_etapa8: number;
    count_etapa9: number;
    count_etapa10: number;
    etapafat1: number;
    etapafat2: number;
    etapafat3: number;
    etapafat4: number;
    etapafat5: number;
    etapafat6: number;
    etapafat7: number;
    etapafat8: number;
    etapafat9: number;
    etapafat10: number;
    count_etapafinal1: number;
    count_etapafinal2: number;
    count_etapafinal3: number;
    count_etapafinal4: number;
    count_etapafinal5: number;
    count_etapafinal6: number;
    count_etapafinal7: number;
    count_etapafinal8: number;
    count_etapafinal9: number;
    count_etapafinal10: number;
}

export default function TabelaPendenciasSomaEtapasComponent(props: any) {
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
    const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);

    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalg, setTotalG] = useState(0);
    const [totalgFat, setTotalgFat] = useState(0);

    useEffect(() => {
        listarSomaPendencias()
    }, [])

    async function listarSomaPendencias() {
        setLoading(true);
        try {
            let rs = await service.listaSomaEtapasPorVendedor(codigoUsuario);
            console.log(rs)
            setDados(rs.data.somaEtapasPeloVendedor)
            setTotalG(rs.data.somaEtapasPeloVendedor[0].total_reais_pendencias)
            setTotalgFat(rs.data.somaEtapasPeloVendedor[0].total_reais_faturadas)
            console.log(rs.data)
        } catch (error) {
            console.error('Erro ao buscar somas das etapas:', error);
        } finally {
            setLoading(false);
        }
    }

    const tamFonte = '0.9rem';
    const corDestaque = '#000'
    const corFundoColuna = '#F5F5F5'
    const getColumnBackgroundColor = (index: number): string => {
        const colors = ['#f0f8ff', '#faebd7'];
        return colors[index % 2];
    };

    const filtrarDadosEtapa = (title: string) => {
        console.log(`Botão clicado na coluna: ${title}`);
        // Adicione aqui a lógica que você deseja executar quando o botão for clicado
    };

    const renderCell = (etapa: number, etapaFat: number, countEtapa: any, countEtapaFat: any, totalg: number, totalgFat: number, corDestaque: string, tamFonte: string, colorPend: string) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', padding: '0px' }}>
                <div style={{ width: '50%', height: '100px', textAlign: 'center', backgroundColor: '#F0F8FF', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box', padding: '5px' }}>
                    <span style={{ fontSize: tamFonte, color: etapa > 1000 ? corDestaque : '#000' }}>
                        {etapa !== null ? formatarMoeda(+etapa) : formatarMoeda('0.00')}
                        <div>({etapa > 0 ? ((etapa / totalg) * 100).toFixed(2) : '0'}%)</div>
                        <div style={{ color: 'red' }}>Pend: {countEtapa}</div>
                    </span>
                </div>
                <div style={{ width: '50%', height: '100px', textAlign: 'center', backgroundColor: '#FFFAF0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box', padding: '5px' }}>
                    <span style={{ fontSize: tamFonte, color: etapaFat > 1000 ? corDestaque : '#000' }}>
                        {etapaFat !== null ? formatarMoeda(+etapaFat) : formatarMoeda('0.00')}
                        <div>({etapaFat > 0 ? ((etapaFat / totalgFat) * 100).toFixed(2) : '0'}%)</div>
                        <div style={{ color: colorPend }}>Fat: {countEtapaFat}</div>
                    </span>
                </div>
            </div>
        );
    };
    const columns1: TableColumnsType<PropsSomaPendencias> = [
        {
            title: <span style={{ fontSize: '14px' }}>BASICOS</span>,
            dataIndex: 'etapa1',
            key: 'etapa1',
            align: 'center',
            width: '20%',
            render: (etapa1, record) => renderCell(etapa1, record.etapafat1, record.count_etapa1, record.count_etapafinal1, totalg, totalgFat, corDestaque, tamFonte, 'blue'),
            onCell: () => ({ style: { backgroundColor: corFundoColuna } }),
            onHeaderCell: () => ({ style: { backgroundColor: corFundoColuna } }),
        },
        {
            title: <span style={{ fontSize: '14px' }}>EPI/IMP/FERRAM</span>,
            dataIndex: 'etapa2',
            key: 'etapa2',
            align: 'center',
            width: '20%',
            render: (etapa2, record) => renderCell(etapa2, record.etapafat2, record.count_etapa2, record.count_etapafinal2, totalg, totalgFat, corDestaque, tamFonte, 'blue'),
        },
        {
            title: <span style={{ fontSize: '14px' }}>HIDRAULICOS</span>,
            dataIndex: 'etapa3',
            key: 'etapa3',
            align: 'center',
            width: '20%',
            render: (etapa3, record) => renderCell(etapa3, record.etapafat3, record.count_etapa3, record.count_etapafinal3, totalg, totalgFat, corDestaque, tamFonte, 'blue'),
            onCell: () => ({ style: { backgroundColor: corFundoColuna } }),
            onHeaderCell: () => ({ style: { backgroundColor: corFundoColuna } }),
        },
        {
            title: <span style={{ fontSize: '14px' }}>CABOS</span>,
            dataIndex: 'etapa4',
            key: 'etapa4',
            align: 'center',
            width: '20%',
            render: (etapa4, record) => renderCell(etapa4, record.etapafat4, record.count_etapa4, record.count_etapafinal4, totalg, totalgFat, corDestaque, tamFonte, 'blue'),
        },
        {
            title: <span style={{ fontSize: '14px' }}>TOM/AC</span>,
            dataIndex: 'etapa5',
            key: 'etapa5',
            align: 'center',
            width: '20%',
            render: (etapa5, record) => renderCell(etapa5, record.etapafat5, record.count_etapa5, record.count_etapafinal5, totalg, totalgFat, corDestaque, tamFonte, 'blue'),
            onCell: () => ({ style: { backgroundColor: corFundoColuna } }),
            onHeaderCell: () => ({ style: { backgroundColor: corFundoColuna } }),
        },

        // Adicione outras colunas aqui seguindo o mesmo padrão
    ];
    const columns2: TableColumnsType<PropsSomaPendencias> = [
        {
            title: <span style={{ fontSize: '14px' }}>PISOS/REV/ACES/ARG/REJ</span>,
            dataIndex: 'etapa6',
            key: 'etapa6',
            align: 'center',
            width: '20%',
            render: (etapa6, record) => renderCell(etapa6, record.etapafat6, record.count_etapa6, record.count_etapafinal6, totalg, totalgFat, corDestaque, tamFonte, 'blue'),
        },
        {
            title: <span style={{ fontSize: '14px' }}>LOUC/MET/PIAS/CB/GB/BAN</span>,
            dataIndex: 'etapa7',
            key: 'etapa7',
            align: 'center',
            width: '20%',
            render: (etapa7, record) => renderCell(etapa7, record.etapafat7, record.count_etapa7, record.count_etapafinal7, totalg, totalgFat, corDestaque, tamFonte, 'blue'),
            onCell: () => ({ style: { backgroundColor: corFundoColuna } }),
            onHeaderCell: () => ({ style: { backgroundColor: corFundoColuna } }),
        },
        {
            title: <span style={{ fontSize: '14px' }}>PORTAS/FERRAG/FECH</span>,
            dataIndex: 'etapa8',
            key: 'etapa8',
            align: 'center',
            width: '20%',
            render: (etapa8, record) => renderCell(etapa8, record.etapafat8, record.count_etapa8, record.count_etapafinal8, totalg, totalgFat, corDestaque, tamFonte, 'blue'),
        },
        {
            title: <span style={{ fontSize: '14px' }}>PINTURAS</span>,
            dataIndex: 'etapa9',
            key: 'etapa9',
            align: 'center',
            width: '20%',
            render: (etapa9, record) => renderCell(etapa9, record.etapafat9, record.count_etapa9, record.count_etapafinal9, totalg, totalgFat, corDestaque, tamFonte, 'blue'),
            onCell: () => ({ style: { backgroundColor: corFundoColuna } }),
            onHeaderCell: () => ({ style: { backgroundColor: corFundoColuna } }),
        },
        {
            title: <span style={{ fontSize: '14px' }}>ILUMINAÇÃO</span>,
            dataIndex: 'etapa10',
            key: 'etapa10',
            align: 'center',
            width: '20%',
            render: (etapa10, record) => renderCell(etapa10, record.etapafat10, record.count_etapa10, record.count_etapafinal10, totalg, totalgFat, corDestaque, tamFonte, 'blue'),
        },


        // Adicione outras colunas aqui seguindo o mesmo padrão
    ];

    return (
        <>
            <div>
                <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div style={{ backgroundColor: '#fff' }}>
                        <Row style={{ display: 'flex', flexDirection: 'column' }}>
                            <Col>
                                <Typography style={{ fontSize: '24px', margin: '10px' }}>
                                    Total Pend.: R$ {formatarMoedaComSimbolo(+totalg)} - Fat.: R$ {formatarMoedaComSimbolo(+totalgFat)}
                                </Typography>
                            </Col>
                        </Row>
                    </div>
                    <div style={{ padding: '0px', position: 'relative' }}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Table
                                    columns={columns1}
                                    dataSource={dados}
                                    size="small"
                                    rowKey={(record) => record.seq}
                                    pagination={false}
                                    bordered
                                    style={{ height: '100%' }} // Adicionado para garantir que a tabela preencha o espaço disponível
                                />
                            </Col>
                        </Row>
                    </div>
                    <div style={{ padding: '0px', position: 'relative' }}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Table
                                    columns={columns2}
                                    dataSource={dados}
                                    size="small"
                                    rowKey={(record) => record.seq}
                                    pagination={false}
                                    bordered
                                    style={{ height: '100%' }} // Adicionado para garantir que a tabela preencha o espaço disponível
                                />
                            </Col>
                        </Row>
                    </div>
                </Spin>
            </div>
        </>
    )
}