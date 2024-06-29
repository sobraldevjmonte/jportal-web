import { Row, Col, Select  } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import EtapasService from "../service/EtapasService";

const service = new EtapasService()


interface VendedoresType {
    idUsuario: number;
    idLoja: number;
    idNivelUsuario: number;
    codigoVendedor: string;
    nomeUsuario: string;
}


export default function ListaVendedoresComponent(props: any) {
    const [listaVendedores, setListaVendedores] = useState<VendedoresType[]>([])
    const [vendedorSelecionada, setVendedorSelecionado] = useState('')
    const [vendedorSelecionadaDescricao, setLVendedoraSelecionadoNome] = useState('')

    useEffect(() => {
        listarVendedores(props.idLoja)
    }, [])

    async function listarVendedores(id: number) {
        console.log(id)
        try {
            let rs = await service.fitlrarVendedores(id);
            console.log(rs)
            setListaVendedores(rs.data.vendedores)
        } catch (error) {
            console.error('Erro ao buscar vendedores:', error);
        } 
    }

    function selecionarVendedor(e: any, vendedor: any) {
        console.log(e);
        console.log(vendedor.data.nomeUsuario);
        //const descricao = loja.data.descricao;
        setVendedorSelecionado(e)
        setLVendedoraSelecionadoNome(vendedor.data.nomeUsuario)
    }

    
    return (
        <>
            <Row gutter={16} style={{ display: 'flex', padding: '10px' }}>
                <Col >
                    <Title level={5}>Vendedores:</Title>
                    <Select id="selectLoja" onSelect={selecionarVendedor} defaultValue="sem" style={{ width: 200 }}>
                        <Select.Option value="sem"> </Select.Option>
                        {listaVendedores.map(vendedor => (
                            <Select.Option key={vendedor.idUsuario} value={vendedor.codigoVendedor} data={vendedor}>
                                {vendedor.nomeUsuario}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
            </Row>
        </>
    )
}
