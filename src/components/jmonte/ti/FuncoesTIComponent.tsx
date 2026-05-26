import React, { useState } from 'react';
import { Button, Card, Typography, Row, Col, message, Spin, Alert , Divider} from 'antd';
import { CloudDownloadOutlined, InfoCircleOutlined, SyncOutlined } from '@ant-design/icons';
import TIService from '../../../service/TIService';

const { Title, Text } = Typography;
const service = TIService;

export default function FuncoesTIComponent() {
    const [loading, setLoading] = useState(false);

    const handleImportar = async () => {
        setLoading(true);
        try {
            const response = await TIService.importarPendenciasVendas();
            if (response.status === 200) {
                message.success("Sincronização realizada com sucesso!");
            }
        } catch (error) {
            message.error("Falha ao importar dados. Verifique o servidor.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={3}>Painel de Controle TI</Title>
            <Alert
                message="Atenção"
                description="Estas funções realizam alterações estruturais nos dados locais sincronizando com o servidor principal. Use com cautela."
                type="warning"
                showIcon
                style={{ marginBottom: '20px' }}
            />

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                    <Card 
                        title="Sincronização de Pendências" 
                        bordered={false} 
                        style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                        extra={<CloudDownloadOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
                    >
                        <Text type="secondary">
                            Importa produtos, pré-vendas e resumo de etapas do servidor JM para o banco local.
                        </Text>
                        <Divider />
                        <Spin spinning={loading}>
                            <Button 
                                type="primary" 
                                block 
                                icon={<SyncOutlined />} 
                                onClick={handleImportar}
                                style={{ backgroundColor: '#2F4F4F', borderColor: '#2F4F4F' }}
                            >
                                Importar Agora
                            </Button>
                        </Spin>
                    </Card>
                </Col>
                
                {/* Futuras funções de TI podem ser adicionadas aqui como novos Cards */}
            </Row>
        </div>
    );
}