import { Col, Row } from "antd";
import DashboardGeralGerenteComponent from "./gerentes/DashboardGeralGerenteComponent";
import DashboardGeralClienteGerenteComponent from "./gerentes/DashboardGeralClienteGerenteComponent";
import DashboardGeralVendedoresGerenteComponent from "./gerentes/DashboardGeralVendedoresGerenteComponent";


export default function DashBoardGerentesComponent(props: any) {
    return (

        <div style={{ backgroundColor: "#fff"}}>
            <Row gutter={[8, 8]} justify="center">
                <Col xs={24} sm={24} md={24} lg={8}>
                    <DashboardGeralGerenteComponent />
                </Col>
                <Col xs={24} sm={24} md={24} lg={8}>
                    <DashboardGeralVendedoresGerenteComponent />
                </Col>
                <Col xs={24} sm={24} md={24} lg={8}>
                    <DashboardGeralClienteGerenteComponent />
                </Col>
            </Row>
        </div>
    )
}