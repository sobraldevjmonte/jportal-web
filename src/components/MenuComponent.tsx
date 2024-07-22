import {
  BarChartOutlined,
  FilePdfOutlined,
  FolderAddOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Image, Row, Typography, Col } from "antd";
import { useContext, useEffect, useState } from "react";
import { Link, Outlet, redirect } from "react-router-dom";
import { UsuarioContext } from "../context/useContext";

const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;

export default function HomePage() {
  const { nomeUsuario, setNomeUsuario } = useContext(UsuarioContext);
  const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);
  const { idUsuario, setIdUsuario } = useContext(UsuarioContext);
  const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
  const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
  const { loja, setLoja } = useContext(UsuarioContext);
  const { idLoja, setIdLoja } = useContext(UsuarioContext);
  const { logado, setLogado } = useContext(UsuarioContext);

  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    localStorage.removeItem("remember");
    localStorage.removeItem("logado");
    localStorage.removeItem("id_empresa");
    //localStorage.removeItem("logado");
    setNomeUsuario('')
    setLogado(false);

    redirect('/login')
  };

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ backgroundColor: "#fff" }}
        width="220px"
        theme="light"
      >
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            verticalAlign: "middle",
            alignContent: "center",
            flexDirection: "column",
            display: "flex",
          }}
        >
          {collapsed ? (
            <Image
              src="logo2.jpg"
              style={{
                width: "50px",
                height: "60px",
              }}
              preview={false}
            />
          ) : (
            <Image
              src="logo.jpg"
              style={{ width: "180px", height: "100px" }}
              preview={false}
            />
          )}
        </div>
        <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="dashboard" icon={<BarChartOutlined />}>
            <Link to="/dashboard" className="nav-text" accessKey="c">
              DashBoard
            </Link>
          </Menu.Item>
          <SubMenu
            key="sub-menu-vendas"
            icon={<FolderAddOutlined />}
            title="Vendas"
          >{idNivelUsuario !== 3 ?
            <SubMenu
              key="sub-menu-prof"
              icon={<FolderAddOutlined />}
              title="Profissionais"
            >


              <Menu.Item key="adm-prof-jmonte">
                <Link to="/adm-prof-jmonte" className="nav-text">
                  Pedidos
                </Link>
              </Menu.Item>


              <Menu.Item key="adm-prof-usuarios" title="Usuários Profissionais">
                <Link
                  to="/adm-prof-usuarios"
                  className="nav-text"
                  title="Usuários Profissionais"

                >
                  Usuários
                </Link>
              </Menu.Item>

            </SubMenu>
            : null}

            <Menu.Item key="rt-page">
              <Link
                to="/rt-page"
                className="nav-text"
                title="Formulário RTs"
              >
                Form.RTs.
              </Link>
            </Menu.Item>
            <Menu.Item key="resumo-etapas-page">
              <Link to="/resumo-etapas" className="nav-text">
                Etapas/Pendencias
              </Link>
            </Menu.Item>

            {idNivelUsuario !== 3 ?
              <Menu.Item key="analise-np-page">
                <Link to="/analise-np" className="nav-text">
                  Análise NP
                </Link>
              </Menu.Item>
              : null}



          </SubMenu>


          <Menu.Item key="relatorios" icon={<FilePdfOutlined />}>
            <Link to="/relatorios" className="nav-text">
              Relatórios
            </Link>
          </Menu.Item>
          <Menu.Item key="chat" icon={<WhatsAppOutlined />}>
            <Link to="/chat" className="nav-text">
              Chat
            </Link>
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logOut}>
            <Link to="/login">
              Sair
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Row>

          <Header style={{ padding: 0, background: colorBgContainer, backgroundColor: '#fff', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />

            <div style={{ paddingRight: 10 }}>
              Usuário: {nomeUsuario}({nivelUsuario}/{codigoUsuario}/{idNivelUsuario}) - {loja}/{idLoja}
            </div>
          </Header>
        </Row>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
