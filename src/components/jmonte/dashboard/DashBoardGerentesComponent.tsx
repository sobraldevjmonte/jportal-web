import { Col, Row } from "antd";
import DashboardGeralGerenteComponent from "./gerentes/DashboardGeralGerenteComponent";
import DashboardGeralClienteGerenteComponent from "./gerentes/DashboardGeralClienteGerenteComponent";
import DashboardGeralVendedoresGerenteComponent from "./gerentes/DashboardGeralVendedoresGerenteComponent";
import DashboardGeralIndicadorGerenteComponent from "./gerentes/DashboardGeralIndicadorGerenteComponent";


export default function DashBoardGerentesComponent(props: any) {
    return (
        <div style={{ backgroundColor: "#fff" }}>
            <Row gutter={[8, 8]} justify="start">
                <Col xs={24} sm={24} md={24} lg={6}>
                    <DashboardGeralGerenteComponent />
                </Col>
                <Col xs={24} sm={24} md={24} lg={6}>
                    <DashboardGeralVendedoresGerenteComponent />
                </Col>
                <Col xs={24} sm={24} md={24} lg={6}>
                    <DashboardGeralClienteGerenteComponent />
                </Col>
                <Col xs={24} sm={24} md={24} lg={6}>
                    <DashboardGeralIndicadorGerenteComponent />
                </Col>
            </Row>
        </div>
    )
}