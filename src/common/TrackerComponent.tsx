import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { UsuarioContext } from "../context/useContext";
import { Button, Result, Typography, Card, Space } from "antd";
import { StopOutlined, EnvironmentOutlined, LockOutlined } from "@ant-design/icons";
import TrackerService from "../service/TrackerService";

const trackerService = new TrackerService();
const { Text, Title } = Typography;

export default function TrackerComponent() {
    const { codigoUsuario, idLoja, logado } = useContext(UsuarioContext);
    const [bloqueado, setBloqueado] = useState(false);
    const [obrigaGps, setObrigaGps] = useState<boolean>(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const ultimaExecucaoRef = useRef<number>(0);

    // 1. Busca a configuração do banco de dados ao carregar
    const carregarConfiguracaoGps = useCallback(async () => {
        try {
            const res = await trackerService.buscarConfiguracoes();
            if (res.data) {
                setObrigaGps(!!res.data.obriga_gps);
            }
        } catch (error) {
            console.error("Erro ao carregar parâmetro de GPS:", error);
            setObrigaGps(false); // Em caso de erro, por segurança não bloqueia
        }
    }, []);

    // 2. Monitora mudanças de permissão no navegador
    useEffect(() => {
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((permissionStatus) => {
                permissionStatus.onchange = () => {
                    if (permissionStatus.state === 'granted') {
                        setBloqueado(false);
                        window.location.reload();
                    }
                };
            });
        }
    }, []);

    // 3. Lógica principal de rastro e bloqueio sistemático
    useEffect(() => {
        const isReady = logado && codigoUsuario && codigoUsuario !== "999" && codigoUsuario !== 999;

        if (!isReady) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        const executarRastro = () => {
            // 1. PRIMEIRA TRAVA: Se o banco diz que NÃO é obrigatório, 
            // enviamos apenas o pulso vazio e SAÍMOS da função sem tocar no GPS do navegador.
            if (!obrigaGps) {
                trackerService.registrarHeartbeat(codigoUsuario, Number(idLoja), null, null);
                setBloqueado(false); // Garante que a tela de erro não apareça
                return; // <--- Importante: encerra aqui para o navegador não abrir o pop-up
            }

            const agora = Date.now();
            if (agora - ultimaExecucaoRef.current < 5000) return;
            ultimaExecucaoRef.current = agora;

            // 2. Só chegamos aqui se obrigaGps for TRUE
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        setBloqueado(false);
                        trackerService.registrarHeartbeat(
                            codigoUsuario,
                            Number(idLoja),
                            pos.coords.latitude,
                            pos.coords.longitude
                        );
                    },
                    (err) => {
                        // Se o usuário negou e é obrigatório, bloqueia
                        if (err.code === 1) {
                            setBloqueado(true);
                        }
                        trackerService.registrarHeartbeat(codigoUsuario, Number(idLoja), null, null);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
                );
            } else {
                setBloqueado(true);
            }
        };

        // Inicia o ciclo
        carregarConfiguracaoGps().then(() => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            executarRastro();
            intervalRef.current = setInterval(executarRastro, 20000);
        });

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [codigoUsuario, idLoja, logado, obrigaGps, carregarConfiguracaoGps]);

    // UI DE BLOQUEIO TOTAL (Overlay)
    if (bloqueado) {
        return (
            <div style={{
                position: 'fixed',
                top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: '#fff',
                zIndex: 999999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '20px'
            }}>
                <Result
                    status="error"
                    icon={<StopOutlined style={{ color: '#ff4d4f', fontSize: '64px' }} />}
                    title={<Title level={2}>PERMISSÃO OBRIGATÓRIA</Title>}
                    subTitle={
                        <div style={{ fontSize: '16px' }}>
                            <p>O acesso ao sistema está bloqueado porque a localização foi desativada nas configurações do seu dispositivo.</p>
                            <Card style={{ backgroundColor: '#fffbe6', border: '1px solid #ffe58f', marginTop: 20, textAlign: 'left' }}>
                                <Space direction="vertical">
                                    <Text strong><LockOutlined /> COMO DESBLOQUEAR:</Text>
                                    <Text>1. Clique no <b>ícone de cadeado</b> na barra de endereços do seu navegador.</Text>
                                    <Text>2. Altere a permissão de <b>Localização</b> para "Permitir".</Text>
                                    <Text>3. Clique no botão abaixo para recarregar.</Text>
                                </Space>
                            </Card>
                        </div>
                    }
                    extra={[
                        <Button
                            type="primary"
                            size="large"
                            key="retry"
                            icon={<EnvironmentOutlined />}
                            onClick={() => window.location.reload()}
                        >
                            Já ativei! Acessar Sistema
                        </Button>
                    ]}
                />
            </div>
        );
    }

    return null;
}