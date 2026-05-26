
import { Button, Input, Form, notification, Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginService from "../service/LoginService";
import { LoginOutlined, LockOutlined, UserOutlined, SafetyOutlined } from "@ant-design/icons";
import { UsuarioContext } from "../context/useContext";

const service = new LoginService();

export default function LoginPage2() {
    const navigate = useNavigate();

    const {
        setNomeUsuario, setCodigoUsuario, setIdUsuario, setNivelUsuario,
        setLoja, setIdLoja, setIcomp, setLogado, setIdNivelUsuario, setSubNivel1
    } = useContext(UsuarioContext);

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

    const [isModalSenhaVisible, setIsModalSenhaVisible] = useState(false);
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [dadosTemp, setDadosTemp] = useState<any>(null);

    useEffect(() => {}, []);

    function resetCampos() {
        setNomeUsuario("");
        setSenha("");
        setIdUsuario("");
        setCodigoUsuario("");
        setLoja("999");
        setIdLoja(999999);
        setNivelUsuario("999");
        setIdNivelUsuario(999);
        setSubNivel1(999);
        setLogado(false);
        setIcomp("");
        localStorage.removeItem("nomeUsuario");
        localStorage.removeItem("idUsuario");
        localStorage.removeItem("codigoUsuario");
        localStorage.removeItem("loja");
        localStorage.removeItem("nivelUsuario");
        localStorage.removeItem("logado");
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };

    const efetivarLogin = (data: any) => {
        localStorage.setItem("codigoUsuario", data.codigousuario);
        localStorage.setItem("loja", data.loja);
        localStorage.setItem("idLoja", data.idLoja);
        localStorage.setItem("nomeUsuario", data.nomeusuario);
        localStorage.setItem("logado", "true");
        localStorage.setItem("IdUsuario", data.idusuario);
        setLogado(true);
        setNomeUsuario(data.nomeusuario);
        setIdUsuario(data.idusuario);
        setCodigoUsuario(data.codigousuario);
        setLoja(data.loja);
        setIdLoja(data.idLoja);
        setIcomp(data.icomp);
        setNivelUsuario(data.nivelusuario);
        setIdNivelUsuario(data.idNivelUsuario);
        setSubNivel1(data.subNivel1);
        setLoading(false);
        navigate("/dashboard", { replace: true });
    };

    async function onFinish() {
        setLoading(true);
        try {
            let resp = await service.login(usuario, senha);
            if (resp.data == null) {
                setLoading(false);
                setLogado(false);
                showErrorNotification("Verifique suas credenciais!");
            } else {
                if (resp.data.forcarTroca) {
                    setDadosTemp(resp.data);
                    setIsModalSenhaVisible(true);
                    setLoading(false);
                    return;
                }
                efetivarLogin(resp.data);
            }
        } catch (error) {
            setLoading(false);
            showErrorNotification("Erro ao processar login.");
        }
    }

    async function handleTrocarSenha() {
        if (novaSenha.length < 2)
            return notification.warning({ message: "A nova senha deve ter pelo menos 2 dígitos!" });
        if (novaSenha !== confirmarSenha)
            return notification.error({ message: "As senhas digitadas não conferem!" });

        setLoading(true);
        try {
            // Agora a chamada pode disparar uma exceção capturável caso venha um status 400
            const resUpdate = await service.atualizarSenha(dadosTemp.idusuario, dadosTemp.idLoja, novaSenha);
            
            if (resUpdate) {
                notification.success({ message: "Senha updated com sucesso!" });
                setIsModalSenhaVisible(false);
                efetivarLogin(dadosTemp);
            }
        } catch (error: any) {
            setLoading(false);
            
            // --- PEGA A MENSAGEM REAL ENVIADA PELO SERVER ---
            if (error.response && error.response.data && error.response.data.mensagem) {
                notification.error({ 
                    message: "Restrição de Segurança",
                    description: error.response.data.mensagem, // Exibe o texto completo histórico
                    duration: 6
                });
            } else {
                notification.error({ 
                    message: "Falha na Operação",
                    description: "Erro técnico ou de rede na atualização da senha." 
                });
            }
        }
    }

    const showErrorNotification = (message: string) => {
        Modal.error({
            title: <div style={{ fontSize: "18px" }}>Erro de Autenticação</div>,
            content: <div style={{ fontSize: "18px" }}>{message}</div>,
            centered: true,
        });
    };

    return (
        <>
            <style>{`
                #login_page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(145deg,rgb(236, 238, 240) 0%,rgb(170, 179, 191) 40%,rgb(156, 194, 227) 100%);
                    position: relative;
                    overflow: hidden;
                }

                /* Círculos decorativos de fundo */
                #login_page::before {
                    content: '';
                    position: absolute;
                    width: 500px;
                    height: 500px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.04);
                    top: -180px;
                    right: -140px;
                    pointer-events: none;
                }
                #login_page::after {
                    content: '';
                    position: absolute;
                    width: 320px;
                    height: 320px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.04);
                    bottom: -100px;
                    left: -80px;
                    pointer-events: none;
                }

                .login-box {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 420px;
                    padding: 0 16px;
                }

                .login-card {
                    background: rgba(255,255,255,0.97);
                    border-radius: 20px;
                    box-shadow:
                        0 20px 60px rgba(0,0,0,0.3),
                        0 4px 16px rgba(0,0,0,0.15);
                    overflow: hidden;
                    border: none;
                }

                /* Faixa superior colorida */
                .login-top-bar {
                    background: linear-gradient(135deg, #1e4d8c 0%, #3282c7 100%);
                    padding: 28px 32px 24px;
                    text-align: center;
                }

                .login-icon-wrap {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 56px;
                    height: 56px;
                    background: rgba(255,255,255,0.15);
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 16px;
                    margin-bottom: 12px;
                    backdrop-filter: blur(4px);
                }

                .login-title {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #fff;
                    letter-spacing: 0.03em;
                    margin: 0;
                    line-height: 1.2;
                }

                .login-subtitle {
                    font-size: 0.75rem;
                    color: rgba(255,255,255,0.65);
                    margin-top: 4px;
                    letter-spacing: 0.05em;
                }

                .login-form-wrap {
                    padding: 28px 32px 32px;
                }

                .login-label {
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: #1a2e4a;
                    letter-spacing: 0.02em;
                }

                .login-input-field {
                    height: 46px !important;
                    border-radius: 10px !important;
                    border: 1.5px solid #d6e4f0 !important;
                    font-size: 0.92rem !important;
                    transition: border-color 0.2s, box-shadow 0.2s !important;
                }
                .login-input-field:hover,
                .login-input-field:focus,
                .login-input-field:focus-within {
                    border-color: #3282c7 !important;
                    box-shadow: 0 0 0 3px rgba(50,130,199,0.14) !important;
                }
                .login-input-field .ant-input {
                    font-size: 0.92rem !important;
                }

                .login-btn-entrar {
                    width: 100%;
                    height: 46px !important;
                    border-radius: 10px !important;
                    font-size: 0.98rem !important;
                    font-weight: 700 !important;
                    letter-spacing: 0.05em !important;
                    background: linear-gradient(135deg, #3282c7 0%, #1a5fa0 100%) !important;
                    border: none !important;
                    box-shadow: 0 4px 16px rgba(50,130,199,0.4) !important;
                    transition: transform 0.15s, box-shadow 0.15s !important;
                    margin-top: 4px;
                }
                .login-btn-entrar:hover:not(:disabled) {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 8px 24px rgba(50,130,199,0.5) !important;
                }
                .login-btn-entrar:active {
                    transform: translateY(0) !important;
                }

                .login-btn-limpar {
                    width: 100%;
                    height: 42px !important;
                    border-radius: 10px !important;
                    font-size: 0.88rem !important;
                    font-weight: 600 !important;
                    background: #dfe187 !important;
                    color: #4a4a00 !important;
                    border: 1.5px solid #cdd170 !important;
                    box-shadow: 0 2px 8px rgba(180,180,50,0.2) !important;
                    transition: filter 0.15s, transform 0.15s !important;
                }
                .login-btn-limpar:hover {
                    filter: brightness(1.05) !important;
                    transform: translateY(-1px) !important;
                }

                .login-divider {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 4px 0 16px;
                    color: #b0bec5;
                    font-size: 0.75rem;
                    letter-spacing: 0.06em;
                }
                .login-divider::before,
                .login-divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: #e8f0f7;
                }

                /* Modal senha */
                .modal-senha .ant-modal-content {
                    border-radius: 16px;
                    overflow: hidden;
                    padding: 0;
                }
                .modal-senha .ant-modal-header {
                    background: linear-gradient(135deg, #1e4d8c, #3282c7);
                    padding: 18px 24px;
                    border-bottom: none;
                    margin-bottom: 0;
                }
                .modal-senha .ant-modal-title {
                    color: #fff !important;
                    font-weight: 700 !important;
                    font-size: 0.98rem !important;
                }
                .modal-senha .ant-modal-body {
                    padding: 24px;
                }
                .modal-senha .ant-modal-footer {
                    padding: 12px 24px 20px;
                    border-top: 1px solid #eef4fb;
                }
            `}</style>

            <div id="login_page">
                <div className="login-box">
                    <div className="login-card">

                        {/* ── Faixa superior ── */}
                        <div className="login-top-bar">
                            <div className="login-icon-wrap">
                                <SafetyOutlined style={{ fontSize: '1.6rem', color: '#fff' }} />
                            </div>
                            <p className="login-title">Portal 2.0</p>
                            <p className="login-subtitle">Atualização: 22/05/2026 — v2.10.7</p>
                        </div>

                        {/* ── Formulário ── */}
                        <div className="login-form-wrap">
                            <Form
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                                layout="vertical"
                            >
                                <Form.Item
                                    name="login"
                                    label={<span className="login-label">Usuário</span>}
                                    rules={[{ required: true, message: "Digite seu usuário!" }]}
                                    style={{ marginBottom: 16 }}
                                >
                                    <Input
                                        className="login-input-field"
                                        prefix={<UserOutlined style={{ color: '#3282c7', marginRight: 4 }} />}
                                        placeholder="Digite seu usuário"
                                        onChange={(e) => setUsuario(e.target.value)}
                                        autoFocus
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="senha"
                                    label={<span className="login-label">Senha</span>}
                                    rules={[{ required: true, message: "Digite sua senha!" }]}
                                    style={{ marginBottom: 24 }}
                                >
                                    <Input.Password
                                        className="login-input-field"
                                        prefix={<LockOutlined style={{ color: '#3282c7', marginRight: 4 }} />}
                                        placeholder="Digite sua senha"
                                        onChange={(e) => setSenha(e.target.value)}
                                    />
                                </Form.Item>

                                <Form.Item style={{ marginBottom: 12 }}>
                                    <Button
                                        className="login-btn-entrar"
                                        loading={loading}
                                        type="primary"
                                        htmlType="submit"
                                        icon={<LoginOutlined />}
                                    >
                                        {loading ? "Aguarde..." : "Entrar"}
                                    </Button>
                                </Form.Item>

                                <div className="login-divider">ou</div>

                                <Button
                                    className="login-btn-limpar"
                                    type="primary"
                                    htmlType="reset"
                                    onClick={resetCampos}
                                >
                                    Limpar Campos
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Modal troca de senha ── */}
            <Modal
                className="modal-senha"
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <LockOutlined />
                        Senha expirada — troca obrigatória
                    </div>
                }
                open={isModalSenhaVisible}
                onOk={handleTrocarSenha}
                confirmLoading={loading}
                okText="Atualizar e Entrar"
                cancelButtonProps={{ style: { display: 'none' } }}
                closable={false}
                centered
                okButtonProps={{
                    style: {
                        background: 'linear-gradient(135deg, #3282c7, #1a5fa0)',
                        border: 'none',
                        borderRadius: 8,
                        height: 40,
                        fontWeight: 700,
                        paddingInline: 24,
                    }
                }}
            >
                <div style={{
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: 10,
                    padding: '12px 16px',
                    marginBottom: 20,
                    fontSize: '0.84rem',
                    color: '#78450a',
                    display: 'flex',
                    gap: 8,
                }}>
                    <SafetyOutlined style={{ marginTop: 2, flexShrink: 0, color: '#d97706' }} />
                    <span>
                        Sua senha está há mais de <strong>60 dias</strong> sem atualização.
                        Cadastre uma nova senha para continuar.
                    </span>
                </div>

                <Form layout="vertical">
                    <Form.Item
                        label={<span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a2e4a' }}>Nova Senha</span>}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#3282c7' }} />}
                            placeholder="Mínimo 2 dígitos"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            style={{ height: 44, borderRadius: 10 }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={<span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a2e4a' }}>Confirmar Nova Senha</span>}
                        style={{ marginBottom: 0 }}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#3282c7' }} />}
                            placeholder="Repita a nova senha"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            style={{ height: 44, borderRadius: 10 }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}