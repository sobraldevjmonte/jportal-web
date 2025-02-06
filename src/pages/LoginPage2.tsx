import { Button, Card, Col, Input, Row, Form, notification } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginService from "../service/LoginService";
import { LoginOutlined } from "@ant-design/icons";
import { UsuarioContext } from "../context/useContext";

import { Modal } from "antd";

const service = new LoginService();

export default function LoginPage2() {
    const navigate = useNavigate();

    const { nomeUsuario, setNomeUsuario } = useContext(UsuarioContext);
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
    const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { loja, setLoja } = useContext(UsuarioContext);
    const { idLoja, setIdLoja } = useContext(UsuarioContext);
    const { icomp, setIcomp } = useContext(UsuarioContext);
    const { logado, setLogado } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
    const { subNivel1, setSubNivel1 } = useContext(UsuarioContext);

    const [senha, setSenha] = useState("");
    const [usuario, setUsuario] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // resetCampos();
    }, []);

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

    async function onFinish() {
        console.log("************ onFinish ************");
        setLoading(true);
        let resp = await service.login(usuario, senha);
        console.log(resp);

        if (resp.data == null) {
            setLoading(false);
            setLogado(false);

            showErrorNotification("Verifique suas credenciais!");
        } else {
            setLogado(true);

            setNomeUsuario(resp.data.nomeusuario);
            setIdUsuario(resp.data.idusuario);
            setCodigoUsuario(resp.data.codigousuario);
            setLoja(resp.data.loja);
            setIdLoja(resp.data.idLoja);
            setIcomp(resp.data.icomp);
            setNivelUsuario(resp.data.nivelusuario);
            setIdNivelUsuario(resp.data.idNivelUsuario);
            setSubNivel1(resp.data.subNivel1);

            setTimeout(() => {
                setLoading(false);
                navigate("/");
            }, 2000);
        }
    }

    const estiloDiv: React.CSSProperties = {
        display: "flex",
        flexDirection: "column", // Corrigido o nome da propriedade
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        paddingTop: "20px",
        transform: "translateY(-60px)",
    };

    const showErrorNotification = (message: string) => {
        Modal.error({
            title: <div style={{ fontSize: "18px",  }}>Erro de Autenticação</div>,
            content: <div style={{ fontSize: "18px",}}>{message}</div>,
            centered: true,
        });
    };
    




    return (
        <div id="login_page" style={estiloDiv}>
            <Card
                title="Login do Sistema (Portal 2.0)"
                bordered={true}
                style={{
                    maxWidth: "400px",
                    padding: "0px",
                    borderRadius: "5px",
                    backgroundColor: "#fff",
                    boxShadow: "1px 1px 1px 1px #363333",
                }}
                headStyle={{ fontSize: "24px", textAlign: "center" }}
            >
                <Form
                    style={{ width: "100%" }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        name="login"
                        label="Usuário"
                        rules={[{ required: true, message: "Digite seu usuário!" }]}
                    >
                        <Row>
                            <Col span={24} style={{ width: "100%" }}>
                                <Input onChange={(e) => setUsuario(e.target.value)} autoFocus />
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item
                        label="Senha"
                        name="senha"
                        rules={[{ required: true, message: "Digite sua senha!" }]}
                    >
                        <Row>
                            <Col span={24} style={{ width: "100%" }}>
                                <Input.Password onChange={(e) => setSenha(e.target.value)} />
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item>
                        <Row>
                            <Col span={24} style={{ width: "100%" }}>
                                <Button
                                    loading={loading}
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        backgroundColor: "#3282c7",
                                        color: "#fff",
                                    }}
                                    type="primary"
                                    htmlType="submit"
                                    icon={<LoginOutlined />}
                                >
                                    {loading ? "Aguarde ..." : "Entrar"}
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Row>
                        <Col span={24} style={{ width: "100%" }}>
                            <Button
                                style={{
                                    width: "100%",
                                    height: "40px",
                                    backgroundColor: "#dfe187",
                                    color: "#000",
                                }}
                                type="primary"
                                htmlType="reset"
                                onClick={resetCampos}
                            >
                                Limpar Campos
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    );
}
