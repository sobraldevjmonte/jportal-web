import { Form, Input, Modal, Spin } from "antd";
import { useEffect, useState } from "react"
import ProfissionaisService from "../../../service/ProfissonaisService";

interface RejeitarPedidoModalProps {
    pedidoId: number;
    visible: boolean;
    onConfirm: (obs: string) => void;
    onCancel: () => void;
}

const serviceProf = new ProfissionaisService()

export default function ModalJustificativaRejeicao({ pedidoId, visible, onConfirm, onCancel }: RejeitarPedidoModalProps) {
    const [form] = Form.useForm();
    const [obs, setObs] = useState("")
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            form.resetFields();
            setObs("");
        }
    }, [visible]);

    function atualizarValorObs(e: any){
        setObs(e)
    }

    const rejeitarPedido = async () => {
        const dados ={
            id: pedidoId,
            obs: obs
        }
        try {
            setLoading(true);
            await serviceProf.rejeitarPedido(dados);
            form.resetFields();  // Limpa o formulário após rejeição
            onConfirm(obs);  // Chama a função passada para o componente pai

        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Spin spinning={loading} tip="Salvando..." style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <Modal
                    title={`Rejeitar Pedido #${pedidoId}`}
                    visible={visible}
                    onOk={rejeitarPedido}
                    onCancel={onCancel}
                    okText="Confirmar Rejeição"
                    cancelText="Cancelar"
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="obs"
                            label="Observações"
                            rules={[{ required: true, message: 'Por favor, insira uma observação!' }]}

                        >
                            <Input maxLength={30} showCount onChange={(e) => atualizarValorObs(e.target.value)} autoFocus />
                        </Form.Item>
                    </Form>
                </Modal>
            </Spin>
        </div>
    );
}