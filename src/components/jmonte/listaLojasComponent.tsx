import { Row, Col, Select, Spin } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import EtapasService from "../../service/EtapasService";

const service = new EtapasService()

interface LojasType {
    idLoja: number;
    codloja: string;
    descricao: string;
}

export default function ListaLojasComponent(props: any) {
    const [lojas, setLojas] = useState<LojasType[]>([])
    const [lojaSelecionada, setLojaSelecionada] = useState('00')
    const [lojaSelecionadaDescricao, setLojaSelecionadaDescricao] = useState('LOURIVAL')

    //console.log(props.funcao.toString());

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        _listaLojas()
    }, [])

    async function _listaLojas() {
        setLoading(true);
        try {
            let rs = await service.listarLojas();
            console.log(rs)
            setLojas(rs.data.lojas)


        } catch (error) {
            console.error('Erro ao buscar lojas:', error);
        } finally {
            setLoading(false);
        }
    }

    function _selecionarLoja(e: any, loja: any) {
        console.log(e);
        //console.log(loja.data.descricao);
        //const descricao = loja.data.descricao;
        setLojaSelecionada(e)
        setLojaSelecionadaDescricao(loja.data.descricao)

        props.funcao(e)
    } 
    return ( 
        <>
                <div>
                    <Row gutter={16} style={{ display: 'flex', padding: '10px' }}>
                        <Col >
                            <Title level={5}>Loja:</Title>
                                <Select id="selectLoja" onSelect={_selecionarLoja} defaultValue="sem" style={{ width: 200 }} loading={loading}>
                                    <Select.Option value="sem"> </Select.Option>
                                    {lojas.map(loja => (
                                        <Select.Option key={loja.idLoja} value={loja.idLoja} data={loja}>
                                            {loja.descricao}
                                        </Select.Option>
                                    ))}
                                </Select>
                        </Col>
                    </Row>
                </div>

        </>
    )
}