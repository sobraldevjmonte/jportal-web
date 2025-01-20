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
  import { Layout, Menu, Button, theme, Image, Row, Typography } from "antd";
  import { useContext, useEffect, useState } from "react";
  import { Link, Outlet, redirect } from "react-router-dom";
  import { UsuarioContext } from "../context/useContext";
  
  const { Header, Sider, Content } = Layout;
  
  export default function HomePage() {
    const { nomeUsuario, codigoUsuario, nivelUsuario, idNivelUsuario, subNivel1, loja, idLoja, logado, setLogado } = useContext(UsuarioContext);
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
  
    const {
      token: { colorBgContainer },
    } = theme.useToken();
  
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
        if (window.innerWidth > 768) {
          setMenuVisible(false); // Ocultar menu flutuante no desktop
        }
      };
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    const logOut = () => {
      localStorage.clear();
      setLogado(false);
      redirect("/login");
    };
  
    return (
      <Layout>
        {isMobile && (
          <Button
            type="primary"
            icon={<MenuOutlined />}
            onClick={() => setMenuVisible(!menuVisible)}
            style={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            Menu
          </Button>
        )}
  
        {(menuVisible || !isMobile) && (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            style={{ backgroundColor: "#fff" }}
            width={220}
            theme="light"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px 0",
              }}
            >
              {collapsed ? (
                <Image
                  src="logo_durafix_quadrado.png"
                  preview={false}
                  style={{ width: 60, height: 60 }}
                />
              ) : (
                <Image
                  src="logo_duarfix_retangular.png"
                  preview={false}
                  style={{ width: 180, height: 60 }}
                />
              )}
            </div>
            <Menu mode="inline" defaultSelectedKeys={["dashboard"]}>
              <Menu.Item key="dashboard" icon={<BarChartOutlined />}>
                <Link to="/dashboard">DashBoard</Link>
              </Menu.Item>
              <Menu.SubMenu key="vendas" icon={<FolderAddOutlined />} title="Vendas">
                <Menu.Item key="rt-page">
                  <Link to="/rt-page">Form. RTs</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.Item key="relatorios" icon={<FilePdfOutlined />}>
                <Link to="/relatorios">Relatórios</Link>
              </Menu.Item>
              <Menu.Item key="chat" icon={<WhatsAppOutlined />}>
                <Link to="/chat">Chat</Link>
              </Menu.Item>
              <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logOut}>
                Sair
              </Menu.Item>
            </Menu>
          </Sider>
        )}
  
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {!isMobile && (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: 16,
                  width: 64,
                  height: 64,
                }}
              />
            )}
            <Typography.Title level={5} style={{ margin: 0 }}>
              Usuário: {nomeUsuario} ({codigoUsuario}) | Loja: {loja}/{idLoja}
            </Typography.Title>
          </Header>
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
  