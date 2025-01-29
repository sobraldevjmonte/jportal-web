import axios from "axios";

import { getBaseUrl } from "../utils/redirec";


const api = axios.create({
  baseURL:  getBaseUrl(),
  headers: {
    "Content-type": "application/json",
    'Access-Control-Allow-Origin': '*',
  },
});


class AnaliseNpService {
    async listarProdutosNp(np: number){
      console.log("*********** listarProdutosNp(AnaliseNpService) *****************");
      let rs;
      try {
        const response = await api.get(`/analisenp/listar-produtos-np/${np}`);
        
        rs = {
          statusCode: 200,
          data: response.data,
        };
      } catch (error) {
        console.error("Error na requisição");
        rs = {
          status: 401,
          msg: "Erro na requisição",
        };
      }
      return rs;
    }
    async listarNps(mes: number, ano: number, idLoja: number) {
        console.log("*********** listaPendenciasVendasAdmin(AnaliseNpService) *****************");
        let rs;
        try {
          const response = await api.get(`/analisenp/listar-nps/${mes}/${ano}/${idLoja}`);
          rs = {
            statusCode: 200,
            data: response.data,
          };
        } catch (error) {
          console.error("Error na requisição");
          rs = {
            status: 401,
            msg: "Erro na requisição",
          };
        }
        return rs;
      }
}

export default AnaliseNpService;