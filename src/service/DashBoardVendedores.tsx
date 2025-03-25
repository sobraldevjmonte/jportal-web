import axios from "axios";

import { getBaseUrl } from "../utils/redirec";


const api = axios.create({
  baseURL:  getBaseUrl(),
  headers: {
    "Content-type": "application/json",
    'Access-Control-Allow-Origin': '*',
  },
});


// const api = axios.create({
//     baseURL: process.env.REACT_APP_BASE_URL,
//     headers: {
//         "Content-type": "application/json",
//         'Access-Control-Allow-Origin': '*',
//     },
// });

export default class DashBoardVendedoresService {
    async listarDashBoardVendedorSeisMeses(vendedor: number) {
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

    async listaDadosVendedorGeralNps(loja: number, perido: string, vendedor: string ) {
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-nps-vendedor-nps-geral-hoje/${loja}/${perido}/${vendedor}`);
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
    
    async listaDadosGerenteGeralNps(loja: number, perido: string ) {
        let rs;
        try {
            const response = await api.get(`/dashboard/lista-dashboard-nps-gerente-nps-geral-hoje/${loja}/${perido}`);
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

    //******* contagem geral pedidos quantidade vendedor */
    async somaGeralPedidos(vendedor: number) {
        let rs;
        try {
            const response = await api.get(`/dashboard/soma-geral-registros/${vendedor}`);
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
    async somaGeralValores(vendedor: number) {
        let rs;
        try {
            const response = await api.get(`/dashboard/soma-geral-valores/${vendedor}`);
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

     //******* contagem geral pedidos quantidade gerente */
     async somaGeralPedidosGerente(loja: number) {
        let rs;
        try {
            const response = await api.get(`/dashboard/soma-geral-registros-gerente/${loja}`);
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
    async somaGeralValoresGerente(loja: number) {
        let rs;
        try {
            const response = await api.get(`/dashboard/soma-geral-valores-gerente/${loja}`);
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
