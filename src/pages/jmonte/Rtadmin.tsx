import { Button, Spin, Table } from 'antd';
import RtService from '../../service/RtService';
import Typography from 'antd/es/typography/Typography';
import { useContext, useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { EditOutlined, FullscreenOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ModalPreVendasComponent from '../../components/jmonte/ModalPreVendasComponent';
import { UsuarioContext } from '../../context/useContext';

const service = new RtService()

const divCenter = {
  display: "flex",
  flexdirection: 'column',
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  boxShadow: "1px 1px 1px 1px #363333",
};

export default function Rtadmin() {
  const { idLoja, setIdLoja } = useContext(UsuarioContext);
  
  const [limit, setlimit] = useState(20)
  const [page, setpage] = useState(1)
  const [indicador, setindicador] = useState('')
  const [preVenda, setPreVenda] = useState(0);

  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mes, setMes] = useState(0)
  const [ano, setAno] = useState(0)

  const [lojaSelecionada, setLojaSelecionada] = useState(idLoja)

  const date = new Date();

  const mesConsulta = date.getMonth() + 12
  const currentMonth = date.getMonth() + 1;
  const anoConsulta = date.getFullYear() - 1

  useEffect(() => {
    const dataAtual = new Date();
    const mesAtual: number = dataAtual.getMonth() + 1; // getMonth() retorna de 0 a 11, então somamos 1
    const anoAtual: number = dataAtual.getFullYear();

    console.log(`Mês Atual: ${mesAtual}, Ano Atual: ${anoAtual}`);


    if (mesAtual == 1) {
      setMes(11)
      setAno(anoAtual - 1)
      listaIndicadores(11, anoAtual - 1, lojaSelecionada)
    } else {
      setMes(mesAtual - 1)
      setAno(anoAtual)
      listaIndicadores(mesAtual - 1, anoAtual, lojaSelecionada)
    }
  }, [])
  async function listaIndicadores(mes: number, ano: number, loja: string) {
    try {
      setLoading(true);
      let rs = await service.listarIndicadores(mes, ano, loja);
      setDados(rs.data.indicadores)
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  }
  
  interface IndicadoresType {
    key: number;
    cod_indica_pre: number;
    indicador: string;
    total: number;
  }

  const columns: ColumnsType<IndicadoresType> = [
    {
      title: '',
      dataIndex: 'nome_escola',
      key: 'id_escola',
      width: '30px',
      //render: (_, index) => <Button icon={<EditOutlined />} onClick={() => <CadUsuarios nome={index.nome} idusuario={index.usuario_id} />} />
      render: (item, record, index) =>
        <>
          <ModalPreVendasComponent codigoIndicador={record.cod_indica_pre} metodoService={service.buscarPreVendas} />
        </>
    },
    {
      title: 'Cód.Indicador', dataIndex: 'cod_indica_pre', key: 'cod_indica_pre'
    },
    {
      title: 'Nome Indicador', dataIndex: 'indicador', key: 'cod_indica_pre'
    },
    {
      title: 'Total Geral Indicador', dataIndex: 'total', key: 'cod_indica_pre',
      render: (text: string) => <span>R$ {text}</span>
    },
  ];


  return (
    <>
      <div style={{ padding: '10px' }}>
        <Typography style={{ fontSize: '24px' }}>
          Formulário RT JMonte
        </Typography>
        <div style={{ padding: '10px', height: '800px', position: 'relative' }}>
          <Spin spinning={loading} tip="Carregando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <Table
              bordered
              size="small"
              dataSource={dados}
              columns={columns}
              rowKey={(record) => record.cod_indica_pre}
            />
          </Spin>
        </div>
      </div>
    </>
  )
}