
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
//   baseURL: process.env.REACT_APP_BASE_URL,
//   headers: {
//     "Content-type": "application/json",
//     'Access-Control-Allow-Origin': '*',
//   },
// });

class GrupoSubGrupoService{
    async listarVendasGruposPorLojaAnoAnterior(grupo: string, loja: string, mes: string) {
      let rs;
      try {
        const response = await api.get(`/grupos-subgrupos/listar-vendas-por-loja-ano-anterior/${grupo}/${loja}/${mes}`);
  
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
    async listarVendasGruposPorLoja(grupo: string, loja: string, mes: string) {
      let rs;
      try {
        const response = await api.get(`/grupos-subgrupos/listar-vendas-por-loja/${grupo}/${loja}/${mes}`);
  
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
    async listarCodigosGrupos(grupo: string) {
        let rs;
        try {
          const response = await api.get(`/grupos-subgrupos/listar-codigos-grupos/${grupo}`);
    
          rs = {
            statusCode: 200,
            data: response.data,
          };
        } catch (error) {
          console.error(error);
          rs = {
            status: 401,
            msg: "Erro na requisição",
          };
        }
        return rs;
    }
    async listarGrupos(loja: string, mes: string){
        let rs;
        try {
          const response = await api.get(`/grupos-subgrupos/listar-grupos/${loja}/${mes}`);
          rs = {
            statusCode: 200,
            data: response.data,
          };
        } catch (error) {
          // console.error("Error na requisição xxx");
          console.log(error)
          rs = {
            status: 401,
            msg: error,
          };
        }
        return rs;
    }
    async listarGruposAnoAnterior(loja: string, mes: string){
        let rs;
        try {
          const response = await api.get(`/grupos-subgrupos/listar-grupos-ano-anterior/${loja}/${mes}`);
          rs = {
            statusCode: 200,
            data: response.data,
          };
        } catch (error) {
          // console.error("Error na requisição xxx");
          console.log(error)
          rs = {
            status: 401,
            msg: error,
          };
        }
        return rs;
    }

}

export default GrupoSubGrupoService