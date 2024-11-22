import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import TabelaModalPreVendas from './TabelaModalPreVendas';

interface ModalProps {
  codigoIndicador: number,
  metodoService: Function
}

export default function ModalPreVendasComponent(props: ModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nomeIndicador, setNomeIndicador] = useState('')
  const [codCliente, setCodigoCliente] = useState('')
  const [np, setNp] = useState('')
  const [dataPreVenda, setDataPreVenda] = useState('')

  const [exibirTabela, setExibirTabela] = useState(false)


  async function buscarPreVendas(id: number) {
    //------------- ativar/desativar registro -----------------
    var rs
    try {
      rs = await props.metodoService(id);
      let x = rs.data.prevendas
      console.log(x)
      setNp(x[0].np)
      setCodigoCliente(x[0].cod_cliente_pre)
      setNomeIndicador(x[0].indicador)
    } catch (e) {
      console.error(e)
    }
  }

  const showModal = () => {
    setIsModalOpen(true);
    setExibirTabela(true)
    buscarPreVendas(props.codigoIndicador)
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setExibirTabela(false)
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setExibirTabela(false)
  };

  return (
    <>
      <PlusCircleOutlined onClick={showModal} title="Exibir Pré-Vendas" />

      <Modal title="Pré-Vendas" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width='90%' style={{ top: 20, left: 0, height: 600 }}>
        <div>Np: {np} Cód. Cliente: {codCliente} </div>
        <div>Indicador: {props.codigoIndicador} {nomeIndicador}</div>
        <div>
          {exibirTabela ? <TabelaModalPreVendas /> : null}
        </div>
      </Modal>

    </>
  );
};
