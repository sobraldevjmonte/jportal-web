import { SyncOutlined, TagOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Spin, Table, TableColumnsType, Tooltip, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../../../../context/useContext";
import EtapasService from "../../../../service/EtapasService";
import TabelaPendenciasVendasContatosComponent from "../TabelaPendenciasVendasContatosComponent";
import TabelaPendenciasSomaEtapasComponent from "./TabelaPendenciasSomaEtapasComponent";

import './css/estilo.css';

import { formatarMoeda } from "../../../../utils/formatarValores";

const service = new EtapasService()

interface PendenciasVendasType {
    key: string;
    seq: string;
    idvendedor: number;
    nomecliente: string;
    idcliente: number;
    totalcliente: string;
    nomeVendedor: string;
    codigoLoja: string;
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
    contatou: boolean;
    cliente_obra: string;
}

interface PropsPendencias {
    idLoja: number;
    idVendedor: number;
}

export default function TabelaPendeciasVendasVendedoresComponent() {
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
    const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);

    const [dados, setDados] = useState([]);
    const [quantidade, setQuantidade] = useState(0);
    const [loading, setLoading] = useState(false);

    const [ordem, setOrdem] = useState('DESC');


    useEffect(() => {
        listaPendenciasVendas()

        setObsModal('')
        setIdClienteModal(0)
    }, [ordem])

    async function listaPendenciasVendas() {
        setLoading(true);
        try {
            const rs = await service.listaPendenciasVendas(codigoUsuario, ordem);
            console.log(rs?.data);
    
            // Adiciona um `key` sequencial aos itens da lista
            const dadosComKey = rs?.data?.pendenciasVendas?.map((item: any, index: any) => ({
                ...item,
                key: `pendencia-${index}`, // Gera um identificador único sequencial
            })) || [];
    
            setDados(dadosComKey);
            setQuantidade(rs?.data?.quantidade || 0);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            setDados([]); // Evita exibir dados inconsistentes
            setQuantidade(0);
        } finally {
            setLoading(false);
        }
    }
    

    const tamFonte = '0.9rem';
    const colorContatou = 'blue'
    const corDestaque = 'red'

    const columns: TableColumnsType<PendenciasVendasType> = [
        {
            title: '+Obs.',
            key: 'percentual_repasse',
            dataIndex: 'percentual_repasse',
            align: 'right',
            width: '60px',
            render: (text, record) => (
                <Button icon={<TagOutlined />} onClick={() => setDadosModal(record.nomecliente, record.idcliente)} style={{ color: 'orange', marginRight: '5px', borderColor: 'orange', width: '30px' }} title="Inserir Obs. de contato com o cliente." />
            ),
        },
        { title: 'OBRA', dataIndex: 'cliente_obra', key: 'nomeVendedor', align: 'center', 
            // render: (cliente_obra, record) => <span style={{ fontSize: tamFonte}}>{cliente_obra !== null ? 'S': '' }</span> },
            render: (text, record) => (
                <Tooltip title='Cliente é OBRA?' color="#000" style={{alignContent: 'center'}}>
                    <Typography>{record.cliente_obra}</Typography>
                </Tooltip>
            ),
        },
        {
            title: 'Cliente',
            dataIndex: 'nomecliente',
            key: 'nomecliente',
            sorter: (a: any, b: any) => a.nomecliente.localeCompare(b.nomecliente),
            render: (text, record) => {
                const truncatedText = text.length > 30 ? `${text.substring(0, 30)}...` : text;
                return (
                    <span
                        title={record.contatou ? 'Cliente já foi contatado.' : ''}
                        style={{ fontSize: tamFonte, color: record.contatou ? colorContatou : '#000' }}
                        className="cliente-cell"
                    >
                        {truncatedText}
                    </span>
                );
            },
        },
        {
            title: 'TTL Vendas',
            dataIndex: 'totalcliente',
            key: 'totalcliente',
            width: '120px',
            align: 'right',
            sorter: (a: any, b: any) => a.totalcliente - b.totalcliente,
            defaultSortOrder: 'descend', // Ordem padrão descendente
            render: (totalcliente) => (
                <span title="Total em R$ das pendências do cliente." style={{ fontSize: tamFonte }}>
                    {formatarMoeda(+totalcliente)}
                </span>
            ),
        },

        { title: 'BASICOS', dataIndex: 'etapa1', key: 'nomeVendedor', align: 'right', 
            render: (etapa1, record) => <span style={{ fontSize: tamFonte, color: record.etapa1 > 1000 ? corDestaque : '#000' }}>{etapa1 !== null ? formatarMoeda(+etapa1) : '0.00'}</span> },
        { title: 'EPI/IMP/FERRAM', dataIndex: 'etapa2', key: 'nomeVendedor', align: 'right', 
            render: (etapa2, record) => <span style={{ fontSize: tamFonte, color: record.etapa2 > 1000 ? corDestaque : '#000' }}>{etapa2 !== null ? formatarMoeda(+etapa2) : '0.00'}</span> },
        { title: 'HIDRAULICOS', dataIndex: 'etapa3', key: 'nomeVendedor', align: 'right', 
            render: (etapa3, record) => <span style={{ fontSize: tamFonte, color: record.etapa3 > 1000 ? corDestaque : '#000' }}>{etapa3 !== null ? formatarMoeda(+etapa3): '0.00'}</span> },
        { title: 'CABOS', dataIndex: 'etapa4', key: 'nomeVendedor', align: 'right', 
            render: (etapa4, record) => <span style={{ fontSize: tamFonte, color: record.etapa4 > 1000 ? corDestaque : '#000' }}>{etapa4 !== null ? formatarMoeda(+etapa4) : '0.00'}</span> },
        { title: 'TOM/AC', dataIndex: 'etapa5', key: 'nomeVendedor', align: 'right', 
            render: (etapa5, record) => <span style={{ fontSize: tamFonte, color: record.etapa5 > 1000 ? corDestaque : '#000' }}>{etapa5 !== null ? formatarMoeda(+etapa5) : '0.00'}</span> },
        { title: 'PISOS/REV/ACES/ARG/REJ', dataIndex: 'etapa6', key: 'nomeVendedor', align: 'right', 
            render: (etapa6, record) => <span style={{ fontSize: tamFonte, color: record.etapa6 > 2000 ? corDestaque : '#000' }}>{etapa6 !== null ? formatarMoeda(+etapa6) : '0.00'}</span> },
        { title: 'LOUC/MET/PIAS/CB/GB/BAN', dataIndex: 'etapa7', key: 'nomeVendedor', align: 'right', 
            render: (etapa7, record) => <span style={{ fontSize: tamFonte, color: record.etapa7 > 1000 ? corDestaque : '#000' }}>{etapa7 !== null ? formatarMoeda(+etapa7) : '0.00'}</span> },
        { title: 'PORTAS/FERRAG/FECH', dataIndex: 'etapa8', key: 'nomeVendedor', align: 'right', 
            render: (etapa8, record) => <span style={{ fontSize: tamFonte, color: record.etapa8 > 1000 ? corDestaque : '#000' }}>{etapa8 !== null ? formatarMoeda(+etapa8) : '0.00'}</span> },
        { title: 'PINTURAS', dataIndex: 'etapa9', key: 'nomeVendedor', align: 'right', 
            render: (etapa9, record) => <span style={{ fontSize: tamFonte, color: record.etapa9 > 1000 ? corDestaque : '#000' }}>{etapa9 !== null ? formatarMoeda(+etapa9) : '0.00'}</span> },
        { title: 'ILUMINACAO', dataIndex: 'etapa10', key: 'nomeVendedor', align: 'right', 
            render: (etapa10, record) => <span style={{ fontSize: tamFonte, color: record.etapa10 > 1000 ? corDestaque : '#000' }}>{etapa10 !== null ? formatarMoeda(+etapa10) : '0.00'}</span> },
    ];


    //************************ MODAL PARA INSERIR CONTATOS COM OS CLIENTE **************************/
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clienteModal, setClienteModal] = useState('');
    const [idClienteModal, setIdClienteModal] = useState(0);

    const [obsModal, setObsModal] = useState('')

    function setDadosModal(nomeCliente: string, idCliente: number) {
        setClienteModal(nomeCliente)
        setIdClienteModal(idCliente)
        showModal()
    }
    const showModal = () => {
        setObsModal('')
        setIsModalOpen(true);
    };
    const handleOk = () => {
        listaPendenciasVendas();
        service.salvarObservacao(idClienteModal, idUsuario, obsModal)
        setObsModal('')
        setIdClienteModal(0)

        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    function salvarObservacao(e: any) {
        setObsModal(e.target.value.toUpperCase())
        console.log(obsModal)
    }
    const ModalContatoComponent = (
        <>
            <div>
                <Modal title="Observaçãoes de contato" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <Typography>{clienteModal}({idClienteModal})</Typography>

                    <TextArea autoFocus style={{ marginTop: '10px' }} rows={2} onChange={salvarObservacao} placeholder="Digite sua anotação aqui" ></TextArea >
                </Modal>

            </div>
        </>

    );

    const escolherOrdem = (value: string) => {
        console.log(value)
        setOrdem(value);
    };
    //***************** Inserindo Componente TabelaPendenciasVendasVendedoreNps  ******************/
    const expandedRowRender = (record: any) => {
        let x = record.idcliente
        return <TabelaPendenciasVendasContatosComponent idCliente={x} />;
    };


    //************************ MODAL PARA INSERIR CONTATOS COM OS CLIENTE **************************/
    return (
        <>
            <div style={{maxWidth: '2000px'}}>

                <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div style={{ backgroundColor: '#fff' }}>
                        <TabelaPendenciasSomaEtapasComponent codigoUsuario={codigoUsuario} />
                        <Row style={{ display: 'flex', flexDirection: 'column', paddingTop: '40px' }}>
                            <Col>
                                <Typography style={{ fontSize: '24px', marginBottom: '5px' }}>
                                    Resumo Etapas(Vendedores)
                                </Typography>
                            </Col>

                        </Row>
                    </div>
                    <div>
                        <Button icon={<SyncOutlined />} onClick={() => listaPendenciasVendas()} style={{ backgroundColor: '#2F4F4F', color: '#fff', borderColor: '#2F4F4F', marginRight: '5px', width: '130px' }} title="Atualizar todos os registros">Atualizar</Button>
                    </div>
                    {/* <div style={{ paddingTop: '10px', paddingBottom: "10px" }}>
                        <Row>
                            {/* <Col>
                                <Title level={5}>Loja:</Title>
                                <Select id="selectLoja" defaultValue="sem" style={{ width: 200 }}>
                                    <Select.Option value="sem"> </Select.Option>
                                   
                                </Select>
                            </Col> */}
                           {/* <Col style={{ paddingLeft: '5px' }}>
                                <Title level={5}>Ordem:</Title>
                                <Select id="selectLoja" onSelect={escolherOrdem} defaultValue="DESC" style={{ width: 200 }} disabled>
                                    <Select.Option value="DESC">Decrescente</Select.Option>
                                    <Select.Option value="ASC">Crescente</Select.Option>

                                </Select>
                            </Col>
                        </Row>
                    </div> */}
                    <div style={{ padding: '', position: 'relative' }}>
                        <Table
                            columns={columns}
                            dataSource={dados}
                            size="small"
                            rowKey={(record) => record.idcliente}
                            bordered
                            title={() => <Typography style={{ fontSize: '1.2rem', padding: '0px' }}>Clientes({quantidade})</Typography>}
                            expandedRowRender={expandedRowRender}
                        />
                    </div>
                </Spin>
            </div>
            {ModalContatoComponent}
        </>
    )
}