import { Button, Card, Col, Input, Row, Form } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginService from "../service/LoginService";
import { LoginOutlined } from "@ant-design/icons";

import { UsuarioContext } from "../context/useContext";

const service = new LoginService();

export default function LoginPage2() {
    const navigate = useNavigate()

    const { nomeUsuario, setNomeUsuario } = useContext(UsuarioContext);
    const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
    const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
    const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
    const { loja, setLoja } = useContext(UsuarioContext);
    const { idLoja, setIdLoja } = useContext(UsuarioContext);
    const { icomp, setIcomp} = useContext(UsuarioContext);
    const { logado, setLogado } = useContext(UsuarioContext);
    const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);


    const [msg, setMsg] = useState('')
    const [senha, setSenha] = useState("");
    const [usuario, setUsuario] = useState('')

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        //resetCampos()
    }, []);

    function salvarUsuario(e: any) {
        setUsuario(e.target.value);
    }
    function salvarSenha(e: any) {
        setSenha(e.target.value);
    }

    function resetCampos() {
        setNomeUsuario('')
        setSenha('')
        setIdUsuario('')
        setCodigoUsuario('')
        setLoja('999')
        setIdLoja(999999)
        setNivelUsuario('999')
        setIdNivelUsuario(999)
        setLogado(false)
        setMsg('')
        setIcomp('')

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
        console.log("************ onfinish ************");
        setLoading(true);
        let resp = await service.login(usuario, senha);
        console.log(resp)

        if (resp.data == null) {
            setLoading(false);
            setMsg('Falha de autenticação!')
            setLogado(false)
        } else {

            

            setLogado(true);

            setNomeUsuario(resp.data.nomeusuario)
            setIdUsuario(resp.data.idusuario)
            setCodigoUsuario(resp.data.codigousuario)
            setLoja(resp.data.loja)
            setIdLoja(resp.data.idLoja)
            setIcomp(resp.data.icomp)
            setNivelUsuario(resp.data.nivelusuario)
            setIdNivelUsuario(resp.data.idNivelUsuario)
            setMsg('Redirecionando...')

            setTimeout(function () {
                setLogado(true);

                setLoading(false);
                setLogado(true);

                return navigate('/')
            }, 3000);

            
        }
    }

    const estiloDiv = {
        display: "flex",
        flexdirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
    };

    const estiloCard = {
        width: "300px",
        height: "400px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
    };

    return (
        <div id="login_page" style={estiloDiv}>
            <Card
                title="Login do Sistema(Portal 2.0)"
                bordered={true}
                style={{
                    width: "400px",
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
                                {/*<label htmlFor="usuario">Username:</label>*/}
                                <Input onChange={salvarUsuario} autoFocus />
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item
                        label="Senha..."
                        name="senha"
                        rules={[{ required: true, message: "Digite sua senha!" }]}
                    >
                        <Row>
                            <Col span={24} style={{ width: "100%" }}>
                                <Input.Password onChange={salvarSenha} />
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item>
                        <Row>
                            <Col span={48} style={{ width: "100%" }}>
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
                        <Col span={48} style={{ width: "100%" }}>
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
                <div style={{ alignContent: 'center', justifyContent: 'center', display: 'flex', marginTop: 10, color: 'blue' }}>{msg}</div>
            </Card>
        </div>
    );
}