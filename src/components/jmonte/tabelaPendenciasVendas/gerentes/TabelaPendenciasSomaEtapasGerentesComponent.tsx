import { Col, Row, Spin, Table, TableColumnsType, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import EtapasService from "../../../../service/EtapasService";

import { UsuarioContext } from "../../../../context/useContext";
import { formatarMoeda, formatarMoedaComSimbolo } from "../../../../utils/formatarValores";

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

export default function TabelaPendenciasSomaEtapasGerentesComponent(props: any) {
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
    const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { idLoja, setIdLoja } = useContext(UsuarioContext)

    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalg, setTotalG] = useState(0);
    const [totalgFat, setTotalgFat] = useState(0);


    useEffect(() => {
        listarSomaPendencias()
    }, [])

    async function listarSomaPendencias() {
        //setLoading(true);
        try {
            let rs = await service.listaSomaEtapasPorLoja(idLoja);
            //console.log(rs)
            setDados(rs.data.somaEtapasPorLoja)
            setTotalG(rs.data.somaEtapasPorLoja[0].total_reais_pendencias)
            setTotalgFat(rs.data.somaEtapasPorLoja[0].total_reais_faturadas)
            //console.log(rs.data)
        } catch (error) {
            console.error('Erro ao buscar somas das etapas:', error);
        } finally {
            setLoading(false);
        }
    }

    const tamFonte = '0.9rem';
    const corDestaque = '#000'
    const corFundoColuna = '#F5F5F5'
    const corFat = 'blue'

    const renderCell = (etapa: number, etapaFat: number, countEtapa: any, countEtapaFat: any, totalg: number, totalgFat: number, corDestaque: string, tamFonte: string, colorPend: string) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', padding: '0px' }}>
                <div style={{ width: '50%', height: '100px', textAlign: 'center', backgroundColor: '#FFFAFA', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box', padding: '5px' }}>
                    <span style={{ fontSize: tamFonte, color: etapa > 1000 ? corDestaque : '#000' }}>
                        {etapa !== null ? formatarMoeda(+etapa) : formatarMoeda('0.00')}
                        <div>({etapa > 0 ? ((etapa / totalg) * 100).toFixed(2) : '0'}%)</div>
                        <div style={{ color: 'red' }}>Pend: {countEtapa}</div>
                    </span>
                </div>
                <div style={{ width: '50%', height: '100px', textAlign: 'center', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box', padding: '5px' }}>
                    <span style={{ fontSize: tamFonte, color: etapaFat > 1000 ? corDestaque : '#000' }}>
                        {etapaFat !== null ? formatarMoeda(+etapaFat) : formatarMoeda('0.00')}
                        <div>({etapaFat > 0 ? ((etapaFat / totalgFat) * 100).toFixed(2) : '0'}%)</div>
                        <div style={{ color: colorPend }}>Fat: {countEtapaFat}</div>
                    </span>
                </div>
            </div>
        );
    };

    const coresEtapas = [
        { solida: "#1f77b4", fundo: "#e6f4ff" }, // 1 - Azul
        { solida: "#ff7f0e", fundo: "#fff7e6" }, // 2 - Laranja
        { solida: "#2ca02c", fundo: "#f6ffed" }, // 3 - Verde
        { solida: "#d62728", fundo: "#fff1f0" }, // 4 - Vermelho
        { solida: "#9467bd", fundo: "#f9f0ff" }, // 5 - Roxo
        { solida: "#8c564b", fundo: "#fdf5f2" }, // 6 - Marrom
        { solida: "#e377c2", fundo: "#fff0f6" }, // 7 - Rosa
        { solida: "#7f7f7f", fundo: "#f5f5f5" }, // 8 - Cinza
        { solida: "#bcbd22", fundo: "#fcffe6" }, // 9 - Oliva
        { solida: "#17becf", fundo: "#e6fffb" }, // 10 - Ciano
    ];


    const columns1: TableColumnsType<PropsSomaPendencias> = [
        {
            title: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.1' }}>
                    <span style={{ fontSize: '0.8rem', color: coresEtapas[0].solida, fontWeight: 'bold' }}>(1)</span>
                    <span style={{ fontSize: '14px' }}>BASICOS</span>
                </div>
            ),
            dataIndex: 'etapa1',
            key: 'etapa1',
            align: 'center',
            width: '20%',
            render: (etapa1, record) => renderCell(etapa1, record.etapafat1, record.count_etapa1, record.count_etapafinal1, totalg, totalgFat, corDestaque, tamFonte, corFat),
            onHeaderCell: () => ({
                style: { backgroundColor: coresEtapas[0].fundo, verticalAlign: 'top', textAlign: 'center', padding: '4px' }
            }),
        },
        {
            title: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.1' }}>
                    <span style={{ fontSize: '0.8rem', color: coresEtapas[1].solida, fontWeight: 'bold' }}>(2)</span>
                    <span style={{ fontSize: '14px' }}>EPI/IMP/FERRAM</span>
                </div>
            ),
            dataIndex: 'etapa2',
            key: 'etapa2',
            align: 'center',
            width: '20%',
            render: (etapa2, record) => renderCell(etapa2, record.etapafat2, record.count_etapa2, record.count_etapafinal2, totalg, totalgFat, corDestaque, tamFonte, corFat),
            onHeaderCell: () => ({
                style: { backgroundColor: coresEtapas[1].fundo, verticalAlign: 'top', textAlign: 'center', padding: '4px' }
            }),
        },
        {
            title: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.1' }}>
                    <span style={{ fontSize: '0.8rem', color: coresEtapas[2].solida, fontWeight: 'bold' }}>(3)</span>
                    <span style={{ fontSize: '14px' }}>HIDRAULICOS</span>
                </div>
            ),
            dataIndex: 'etapa3',
            key: 'etapa3',
            align: 'center',
            width: '20%',
            render: (etapa3, record) => renderCell(etapa3, record.etapafat3, record.count_etapa3, record.count_etapafinal3, totalg, totalgFat, corDestaque, tamFonte, corFat),
            onHeaderCell: () => ({
                style: { backgroundColor: coresEtapas[2].fundo, verticalAlign: 'top', textAlign: 'center', padding: '4px' }
            }),
        },
        {
            title: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.1' }}>
                    <span style={{ fontSize: '0.8rem', color: coresEtapas[3].solida, fontWeight: 'bold' }}>(4)</span>
                    <span style={{ fontSize: '14px' }}>CABOS</span>
                </div>
            ),
            dataIndex: 'etapa4',
            key: 'etapa4',
            align: 'center',
            width: '20%',
            render: (etapa4, record) => renderCell(etapa4, record.etapafat4, record.count_etapa4, record.count_etapafinal4, totalg, totalgFat, corDestaque, tamFonte, corFat),
            onHeaderCell: () => ({
                style: { backgroundColor: coresEtapas[3].fundo, verticalAlign: 'top', textAlign: 'center', padding: '4px' }
            }),
        },
        {
            title: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.1' }}>
                    <span style={{ fontSize: '0.8rem', color: coresEtapas[4].solida, fontWeight: 'bold' }}>(5)</span>
                    <span style={{ fontSize: '14px' }}>TOM/AC</span>
                </div>
            ),
            dataIndex: 'etapa5',
            key: 'etapa5',
            align: 'center',
            width: '20%',
            render: (etapa5, record) => renderCell(etapa5, record.etapafat5, record.count_etapa5, record.count_etapafinal5, totalg, totalgFat, corDestaque, tamFonte, corFat),
            onHeaderCell: () => ({
                style: { backgroundColor: coresEtapas[4].fundo, verticalAlign: 'top', textAlign: 'center', padding: '4px' }
            }),
        },
    ];

    const columns2: TableColumnsType<PropsSomaPendencias> = [
        {
            title: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.1' }}>
                    <span style={{ fontSize: '0.8rem', color: coresEtapas[5].solida, fontWeight: 'bold' }}>(6)</span>
                    <span style={{ fontSize: '14px' }}>PISOS/REV/REJ...</span>
                </div>
            ),
            dataIndex: 'etapa6',
            key: 'etapa6',
            align: 'center',
            width: '20%',
            render: (etapa6, record) => renderCell(etapa6, record.etapafat6, record.count_etapa6, record.count_etapafinal6, totalg, totalgFat, corDestaque, tamFonte, corFat),
            onHeaderCell: () => ({
                style: { backgroundColor: coresEtapas[5].fundo, verticalAlign: 'top', textAlign: 'center', padding: '4px' }
            }),
        },
        {
            title: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.1' }}>
                    <span style={{ fontSize: '0.8rem', color: coresEtapas[6].solida, fontWeight: 'bold' }}>(7)</span>
                    <span style={{ fontSize: '14px' }}>LOUC/MET/PIAS...</span>
                </div>
            ),
            dataIndex: 'etapa7',
            key: 'etapa7',
            align: 'center',
            width: '20%',
            render: (etapa7, record) => renderCell(etapa7, record.etapafat7, record.count_etapa7, record.count_etapafinal7, totalg, totalgFat, corDestaque, tamFonte, corFat),
            onHeaderCell: () => ({
                style: { backgroundColor: coresEtapas[6].fundo, verticalAlign: 'top', textAlign: 'center', padding: '4px' }
            }),
        },
        {
            title: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.1' }}>
                    <span style={{ fontSize: '0.8rem', color: coresEtapas[7].solida, fontWeight: 'bold' }}>(8)</span>
                    <span style={{ fontSize: '14px' }}>PORTAS/FERRAG</span>
                </div>
            ),
            dataIndex: 'etapa8',
            key: 'etapa8',
            align: 'center',
            width: '20%',
            render: (etapa8, record) => renderCell(etapa8, record.etapafat8, record.count_etapa8, record.count_etapafinal8, totalg, totalgFat, corDestaque, tamFonte, corFat),
            onHeaderCell: () => ({
                style: { backgroundColor: coresEtapas[7].fundo, verticalAlign: 'top', textAlign: 'center', padding: '4px' }
            }),
        },
        {
            title: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.1' }}>
                    <span style={{ fontSize: '0.8rem', color: coresEtapas[8].solida, fontWeight: 'bold' }}>(9)</span>
                    <span style={{ fontSize: '14px' }}>PINTURAS</span>
                </div>
            ),
            dataIndex: 'etapa9',
            key: 'etapa9',
            align: 'center',
            width: '20%',
            render: (etapa9, record) => renderCell(etapa9, record.etapafat9, record.count_etapa9, record.count_etapafinal9, totalg, totalgFat, corDestaque, tamFonte, corFat),
            onHeaderCell: () => ({
                style: { backgroundColor: coresEtapas[8].fundo, verticalAlign: 'top', textAlign: 'center', padding: '4px' }
            }),
        },
        {
            title: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.1' }}>
                    <span style={{ fontSize: '0.8rem', color: coresEtapas[9].solida, fontWeight: 'bold' }}>(10)</span>
                    <span style={{ fontSize: '14px' }}>ILUMINAÇÃO</span>
                </div>
            ),
            dataIndex: 'etapa10',
            key: 'etapa10',
            align: 'center',
            width: '20%',
            render: (etapa10, record) => renderCell(etapa10, record.etapafat10, record.count_etapa10, record.count_etapafinal10, totalg, totalgFat, corDestaque, tamFonte, corFat),
            onHeaderCell: () => ({
                style: { backgroundColor: coresEtapas[9].fundo, verticalAlign: 'top', textAlign: 'center', padding: '4px' }
            }),
        },
    ];
    return (
        <>
            <div>
                <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div style={{ backgroundColor: '#fff' }}>
                        <Row style={{ display: 'flex', flexDirection: 'column' }}>
                            <Col>
                                <Typography style={{ fontSize: '24px', margin: '10px' }}>
                                    Total Pendss.: R$ {formatarMoedaComSimbolo(+totalg)} - <span style={{ color: corFat }}>Fat.: {formatarMoedaComSimbolo(+totalgFat)}</span>
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