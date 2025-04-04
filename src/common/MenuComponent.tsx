import {
  BarChartOutlined,
  FilePdfOutlined,
  FolderAddOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Image, Row, Typography, Col, Drawer } from "antd";
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
  const { subNivel1, setSubNivel1 } = useContext(UsuarioContext);
  const { loja, setLoja } = useContext(UsuarioContext);
  const { idLoja, setIdLoja } = useContext(UsuarioContext);
  const { logado, setLogado } = useContext(UsuarioContext);
  const { icomp, setIcomp } = useContext(UsuarioContext);


  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuMobile = () => {
    const handleMenuClick = () => {
      setIsMenuOpen(false); // Fecha o menu ao clicar em qualquer item
    };

    return (
      <div>
        {/* Botão flutuante */}
        <Button
          type="primary"
          icon={<MenuOutlined />}
          onClick={toggleMenu}
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1000,
            width:'45px',
            height:'40px',
            backgroundColor:'#B22222',
          }}
        />
        {/* Menu Drawer */}
        <Drawer
          title="Menu"
          placement="left"
          onClose={toggleMenu}
          open={isMenuOpen}
          width={230}
        >
          <Menu mode="vertical" onClick={handleMenuClick}>
            <Menu.Item key="dashboard" icon={<BarChartOutlined />}>
              <Link to="/dashboard" className="nav-text" accessKey="c">
                DashBoard
              </Link>
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logOut}>
              <Link to="/login">
                Sair
              </Link>
            </Menu.Item>
          </Menu>
        </Drawer>
        <Layout>
          <Row style={{height: '50px'}}>
            <Header style={{ paddingLeft: 10, background: colorBgContainer, backgroundColor: '#fff', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                Usuário: {nomeUsuario}({codigoUsuario})
              </div>
            </Header>
          </Row>
          <Content
            style={{
              margin: "24px 10px",
              padding: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </div>
    );
  };

  const menuDurafix = () => {

    return (

      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ backgroundColor: "#fff", paddingTop: "5px" }}
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
                src="logo_durafix_quadrado.png"
                style={{
                  width: "60px",
                  height: "60px",
                }}
                preview={false}
              />
            ) : (
              <Image
                src="logo_duarfix_retangular.png"
                style={{ width: "180px", height: "60px" }}
                preview={false}
              />
            )}
          </div>
          <Menu theme="light" mode="inline" defaultSelectedKeys={["dashboard"]}>
            <Menu.Item key="dashboard" icon={<BarChartOutlined />}>
              <Link to="/dashboard" className="nav-text" accessKey="c">
                DashBoard
              </Link>
            </Menu.Item>
            <SubMenu
              key="sub-menu-vendas"
              icon={<FolderAddOutlined />}
              title="Vendas"
            >{idNivelUsuario === 11 ?
              <SubMenu
                key="sub-menu-prof"
                icon={<FolderAddOutlined />}
                title="Profissionais"
              >


                <Menu.Item key="adm-prof-jmonte">
                  <Link to="/adm-prof-jmonte" className="nav-text">
                    Pedidos NP
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
                <Menu.Item key="adm-prof-premios" title="Premios Profissionais">
                  <Link
                    to="/adm-prof-premios"
                    className="nav-text"
                    title="Premios Profissionais"

                  >
                    Prêmios
                  </Link>
                </Menu.Item>
                <Menu.Item key="adm-prof-premios-pedidos" title="Pedidos(Premios) Profissionais">
                  <Link
                    to="/adm-prof-premios-pedidos"
                    className="nav-text"
                    title="Pedidos Premios Profissionais"

                  >
                    Pedidos Prêmios
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
              {idNivelUsuario === 1 || idNivelUsuario === 2 || idNivelUsuario === 11 || idNivelUsuario === 3 || idNivelUsuario === 4 ?
                <Menu.Item key="entregas-pedidos">
                  <Link to="/entregas-pedidos" className="nav-text">
                    Entregas Pedidos
                  </Link>
                </Menu.Item>
                : null}

              {idNivelUsuario !== 3 || idNivelUsuario !== 9 ?
                <Menu.Item key="analise-np-page">
                  <Link to="/analise-np" className="nav-text">
                    Análise NP
                  </Link>
                </Menu.Item>
                : null}

              {idNivelUsuario === 1 || idNivelUsuario === 2 || idNivelUsuario === 11 || idNivelUsuario === 3 || idNivelUsuario === 4 ?
                <Menu.Item key="entregas-pedidos">
                  <Link to="/entregas-pedidos" className="nav-text">
                    Entregas Pedidos
                  </Link>
                </Menu.Item>
                : null}


            </SubMenu>

            {/* <Menu.Item key="relatorios" icon={<FilePdfOutlined />}>
              <Link to="/relatorios" className="nav-text">
                Relatórios
              </Link>
            </Menu.Item>
            <Menu.Item key="chat" icon={<WhatsAppOutlined />}>
              <Link to="/chat" className="nav-text">
                Chat
              </Link>
            </Menu.Item> */}

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
                Usuário: {nomeUsuario}({codigoUsuario}) Nível: {nivelUsuario}/{idNivelUsuario} SubNivel: {subNivel1} Loja: {loja}/{idLoja}/Icompany: {icomp}
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

    )
  }
  const menuJmonte = () => {
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ backgroundColor: "#fff", paddingTop: "5px" }}
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
                  width: "60px",
                  height: "60px",
                }}
                preview={false}
              />
            ) : (
              <Image
                src="logo.jpg"
                style={{ width: "160px", height: "80px" }}
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
            >{idNivelUsuario === 11 ?
              <SubMenu
                key="sub-menu-prof"
                icon={<FolderAddOutlined />}
                title="Profissionais"
              >


                <Menu.Item key="adm-prof-jmonte">
                  <Link to="/adm-prof-jmonte" className="nav-text">
                    Pedidos NP
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
                <Menu.Item key="adm-prof-premios" title="Premios Profissionais">
                  <Link
                    to="/adm-prof-premios"
                    className="nav-text"
                    title="Premios Profissionais"

                  >
                    Prêmios
                  </Link>
                </Menu.Item>
                <Menu.Item key="adm-prof-premios-pedidos" title="Pedidos(Premios) Profissionais">
                  <Link
                    to="/adm-prof-premios-pedidos"
                    className="nav-text"
                    title="Pedidos Premios Profissionais"

                  >
                    Pedidos Prêmios
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
              {idNivelUsuario === 1 || idNivelUsuario === 2 || idNivelUsuario === 11 || idNivelUsuario === 3 || idNivelUsuario === 4 ?
                <Menu.Item key="entregas-pedidos">
                  <Link to="/entregas-pedidos" className="nav-text">
                    Entregas Pedidos
                  </Link>
                </Menu.Item>
                : null}

              {idNivelUsuario !== 3 || idNivelUsuario !== 9 ?
                <Menu.Item key="analise-np-page">
                  <Link to="/analise-np" className="nav-text">
                    Análise NP
                  </Link>
                </Menu.Item>
                : null}


              {idNivelUsuario === 1 || idNivelUsuario === 2 || idNivelUsuario === 9 || idNivelUsuario === 11 ?
                <Menu.Item key="analise-np-grupo-subgrupo">
                  <Link to="/grupo-subgrupo" className="nav-text">
                    Grupo/Sub-Grupo
                  </Link>
                </Menu.Item>
                : null}

            </SubMenu>
{/* 
            <Menu.Item key="relatorios" icon={<FilePdfOutlined />}>
              <Link to="/relatorios" className="nav-text">
                Relatórios
              </Link>
            </Menu.Item>
            <Menu.Item key="chat" icon={<WhatsAppOutlined />}>
              <Link to="/chat" className="nav-text">
                Chat
              </Link>
            </Menu.Item> */}

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
                Usuário: {nomeUsuario}({codigoUsuario}) Nível: {nivelUsuario}/{idNivelUsuario} SubNivel: {subNivel1} Loja: {loja}/{idLoja}/Icompany: {icomp}
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
    )
  }

  const renderMenu = () => {
    if (isMobile) {
      return menuMobile();
    } else {
      return idLoja !== 9 ? menuJmonte() : menuDurafix();
    }
  };

  return <div>{renderMenu()}</div>;
}
