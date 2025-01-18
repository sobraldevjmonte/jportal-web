import { useContext, useState } from "react";
import { UsuarioContext } from "../../../context/useContext";

import { Col, Row } from "antd";
import DashboardGeralClienteComponent from "./vendedores/DashboardGeralClienteComponent";
import DashboardGeralComponent from "./vendedores/DashboardGeralComponent";
import DashboardGeralIndicadorComponent from "./vendedores/DashboardGeralIndicadorComponent";


interface DataTypeGeral {
  key: string;
  periodo: string;
  acumulado: string;
}




export default function DashBoardVendedoresComponent() {
  const [loading, setLoading] = useState(false);
  const { nivelUsuario, setNivelUsuario } = useContext(UsuarioContext);
  const { idNivelUsuario, setIdNivelUsuario } = useContext(UsuarioContext);
  const { icomp, setIcomp } = useContext(UsuarioContext);
  const { codigoUsuario, setCodigoUsuario } = useContext(UsuarioContext);

  return (
    <div style={{ backgroundColor: "#fff", padding: "16px" , maxWidth: '1200px'}}>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={24} md={20} lg={8}>
          <DashboardGeralComponent />
        </Col>
        <Col xs={24} sm={24} md={20} lg={8}>
          <DashboardGeralClienteComponent />
        </Col>
        <Col xs={24} sm={24} md={20} lg={8}>
          <DashboardGeralIndicadorComponent />
        </Col>
      </Row>
    </div>
  );
}
