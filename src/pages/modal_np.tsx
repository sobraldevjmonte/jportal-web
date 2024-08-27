import React, { useEffect } from 'react';
import { Modal, Table, Button } from 'antd';

interface NpType {
    id_np: number;
    numero_np: string;
    data_np: string;
    vlr_total: string;
    total_pontos: string;
    id_loja: number;
    descricao_loja: string;
}

interface SelecaoNpModalProps {
    visible: boolean;
    onClose: () => void;
    npList: NpType[];
    onSelect: (np: NpType) => void;
}

const SelecaoNpModal: React.FC<SelecaoNpModalProps> = ({ visible, onClose, npList, onSelect }) => {

    useEffect(() => {
        console.log('**** useEffect modals ****')
        console.log(npList)
        console.log('**** useEffect modals ****')
    })
    const columns = [
        {
            title: 'Data NP',
            dataIndex: 'data_np',
            key: 'data_np',
        },
        {
            title: 'Valor NP',
            dataIndex: 'vlr_total',
            key: 'vlr_total',
        },
        {
            title: 'Loja',
            dataIndex: 'descricao_loja',
            key: 'descricao_loja',
        },
        {
            title: 'Ação',
            key: 'action',
            render: (_: any, record: NpType) => (
                <Button type="primary" onClick={() => onSelect(record)}>
                    Selecionar
                </Button>
            ),
        },
    ];

    return (
        <Modal
            title="Selecione uma NP"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={800}  // Aumente o tamanho do modal aqui
        >
            <Table
                columns={columns}
                dataSource={npList}
                rowKey="numero"
                pagination={false}
            />
        </Modal>
    );
};

export default SelecaoNpModal;
