import React, { useEffect, useState } from 'react';

// Importação rápida do Space do Antd para o título
import { Space } from 'antd';
import { Card, Form, InputNumber, Switch, Button, message, Spin, Divider, Input, Row, Col } from 'antd';
import { SaveOutlined, SettingOutlined, ReloadOutlined, CalendarOutlined } from '@ant-design/icons';
import ConfigService from '../service/ConfigService';

const service = new ConfigService();

const ConfigPage: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        carregarConfigs();
    }, []);

    // Função para formatar data ISO/SQL para BR
    const formatarDataBR = (dataSql: string) => {
        if (!dataSql) return '';
        // Se vier no formato 2023-10-18...
        const partes = dataSql.split('T')[0].split('-');
        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        return dataSql;
    };

    const carregarConfigs = async () => {
        setLoading(true);
        try {
            const res = await service.buscarConfigs();
            if (res.data) {
                const dadosTratados = {
                    ...res.data,
                    // Formata a data antes de jogar no formulário
                    dataUltimaImportacaoEtapas: formatarDataBR(res.data.dataUltimaImportacaoEtapas)
                };
                form.setFieldsValue(dadosTratados);
            }
        } catch (error) {
            message.error("Erro ao carregar configurações");
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values: any) => {
        setSaving(true);
        try {
            // Removemos a data formatada do payload de envio se o seu banco não espera ela de volta
            // ou enviamos os dados numéricos e booleanos conforme necessário.
            await service.atualizarConfigs(values);
            message.success("Configurações salvas com sucesso!");
            carregarConfigs(); // Recarrega para garantir sincronia
        } catch (error) {
            message.error("Erro ao salvar configurações");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Card 
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space>
                            <SettingOutlined /> 
                            <span>Configurações do Sistema</span>
                        </Space>
                        <Button 
                            size="small"
                            icon={<ReloadOutlined />} 
                            onClick={carregarConfigs}
                            disabled={loading || saving}
                        >
                            Recarregar
                        </Button>
                    </div>
                } 
                bordered={false} 
                style={{ width: '100%', maxWidth: '850px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
                <Spin spinning={loading} tip="Sincronizando com o banco...">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        // Removido initialValues fixos para priorizar 100% o que vem do setFieldsValue
                    >
                        <Form.Item name="id" hidden>
                            <InputNumber />
                        </Form.Item>

                        <Divider orientation="left" style={{ marginTop: 0 }}>Parâmetros de O.S</Divider>
                        
                        <Row gutter={16}>
                            <Col xs={24} sm={8}>
                                <Form.Item label="Dias Criação OS" name="diasCriacaoOs">
                                    <InputNumber style={{ width: '100%' }} min={0} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Form.Item label="Dias Liberação OS" name="diasLiberacaoOs">
                                    <InputNumber style={{ width: '100%' }} min={0} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Form.Item label="Multi-Empresas" name="multiEmpresas">
                                    <Input maxLength={1} style={{ textTransform: 'uppercase' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left">Segurança e Rastreamento</Divider>

                        <Row gutter={16} align="middle">
                            <Col xs={24} sm={12}>
                                <Form.Item 
                                    label="Obrigar captura de GPS?" 
                                    name="obriga_gps" 
                                    valuePropName="checked"
                                >
                                    <Switch 
                                        checkedChildren="SIM" 
                                        unCheckedChildren="NÃO" 
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item 
                                    label="Última Importação (Etapas)" 
                                    name="dataUltimaImportacaoEtapas"
                                >
                                    <Input 
                                        prefix={<CalendarOutlined />} 
                                        disabled 
                                        style={{ color: '#000', fontWeight: '500' }} 
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <div style={{ marginTop: '10px' }}>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                icon={<SaveOutlined />} 
                                loading={saving}
                                size="large"
                            >
                                Salvar Configurações
                            </Button>
                        </div>
                    </Form>
                </Spin>
            </Card>
        </div>
    );
};


export default ConfigPage;