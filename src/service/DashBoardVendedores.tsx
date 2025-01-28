import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        "Content-type": "application/json",
        'Access-Control-Allow-Origin': '*',
    },
});

export default class DashBoardVendedoresService {
    async listarDashBoardVendedorSeisMeses(vendedor: number) {

        console.log("*********** listarDashBoardVendedorSeisMeses *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-vendedor-geral-seis-meses/${vendedor}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }
    async listarDashBoardVendedorHoje(vendedor: number) {

        console.log("*********** listarDashBoardVendedorUmDia *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-vendedor-geral-hoje/${vendedor}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }
    async listarDashBoardVendedorUmDia(vendedor: number) {

        console.log("*********** listarDashBoardVendedorUmDia *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-vendedor-geral-um-dia/${vendedor}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }
    async listarDashBoardVendedorMesAnterior(vendedor: number) {

        console.log("*********** listarDashBoardVendedorMesAnterior *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-vendedor-geral-mes-anterior/${vendedor}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }
    async listarDashBoardVendedorSemanaAnterior(vendedor: number) {

        console.log("*********** listarDashBoardVendedorSemanaAnterior *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-vendedor-geral-semana-anterior/${vendedor}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }

    //******************** vendedores x clientes  *************/

    async listarDashBoardVendedorClienteLista(vendedor: number) {
        console.log("*********** listarDashBoardVendedorClienteLista *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-vendedor-cliente-lista/${vendedor}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }
    async listarDashBoardVendedorClienteListaDetalhes(vendedor: number, cliente: string) {
        console.log("*********** listarDashBoardVendedorClienteListaDetalhes *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-vendedor-cliente-lista-detalhes/${vendedor}/${cliente}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }


    //********************** vendedors x indica */
    async listarDashBoardVendedorIndicadoresLista(vendedor: number) {
        console.log("*********** listarDashBoardVendedorIndicadoresLista *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-vendedor-indicador-lista/${vendedor}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }
    async listarDashBoardVendedorIndicadoresListaDetalhes(vendedor: number, indicador: string) {
        console.log("*********** listarDashBoardVendedorIndicadoresListaDetalhes *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-vendedor-indicador-lista-detalhes/${vendedor}/${indicador}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }


    //********************* gerentes  ********************/
    //********************* gerentes  ********************/

    async listarDashBoardGerenteHoje(loja: number) {

        console.log("*********** listarDashBoardGerenteHoje *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-gerente-geral-hoje/${loja}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }
    async listarDashBoardGerenteUmDia(loja: number) {

        console.log("*********** listarDashBoardGerenteUmDia *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-gerente-geral-um-dia/${loja}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }
    async listarDashBoardGerenteMesAnterior(loja: number) {

        console.log("*********** listarDashBoardGerenteMesAnterior *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-gerente-geral-mes-anterior/${loja}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }
    async listarDashBoardGerenteSemanaAnterior(loja: number) {

        console.log("*********** listarDashBoardGerenteSemanaAnterior *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-gerente-geral-semana-anterior/${loja}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }

    async listarDashBoardGerenteSeisMeses(loja: number) {

        console.log("*********** listarDashBoardGerenteSeisMeses *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-gerente-geral-seis-meses/${loja}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }

    //************ gerente x cliente ************/
    async listarDashBoardGerenteClienteLista(loja: number) {
        console.log("*********** listarDashBoardVendedorClienteLista *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-gerente-cliente-lista/${loja}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }

    async listarDashBoardGerenteClienteListaDetalhes(loja: number, cliente: string) {
        console.log("*********** listarDashBoardVendedorClienteListaDetalhes *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-gerente-cliente-lista-detalhes/${loja}/${cliente}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }
    //************ gerente x cliente ************/
    async listarDashBoardGerenteVendedoresLista(loja: number) {
        console.log("*********** listarDashBoardVendedorClienteLista *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-gerente-vendedor-lista/${loja}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }

    async listarDashBoardGerenteVendedoresListaDetalhes(loja: number, id_vendedor: string) {
        console.log("*********** listarDashBoardVendedorClienteListaDetalhes *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-gerente-vendedor-lista-detalhes/${loja}/${id_vendedor}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }

    //************ gerente x indicador ************/
    async listarDashBoardIndicadorIndicadoresLista(loja: number) {
        console.log("*********** listarDashBoardVendedorIndicadoresLista *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-gerente-indicador-lista/${loja}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }


    async listarDashBoardGerenteIndicadoresListaDetalhes(loja: number, indicador: string) {
        console.log("*********** listarDashBoardVendedorIndicadoresListaDetalhes *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-gerente-indicador-lista-detalhes/${loja}/${indicador}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }
    //**************** vendedor x clientes x nps *********/
    async listaDadosVendedorClientesNps(loja: number, cliente: string, vendedor: string) {
        console.log("*********** listaDadosVendedorClientesNps *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-nps-vendedor-cliente/${loja}/${cliente}/${vendedor}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }
    //**************** gerentes x clientes x nps *********/
    async listaDadosGerenteClientesNps(loja: number, cliente: string) {
        console.log("*********** listaDadosVendedorClientesNps *****************");
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-nps-gerente-cliente/${loja}/${cliente}`);
            rs = {
                statusCode: 200,
                data: response.data,
            };
        } catch (error) {
            console.error("Error na requisição");
            rs = {
                statusCode: 401,
                msg: "Erro na requisição",
            };
        }
        return rs;
    }



}
