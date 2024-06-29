import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-type": "application/json",
    'Access-Control-Allow-Origin': '*',
  },
});

class RtService {

  async listarIndicadores(mes: number , ano: number, loja: string ){
    console.log(mes + '/'+ano)
    console.log('loja: ' + loja)

    let page = 1
    console.log("*********** listarIndicadores *****************");
    let rs;
    try {
      const response = await api.get(`/indicadores/${mes}/${ano}/${loja}`);
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
  async listaPreVendas(indicador: string, mes: number, ano: number, loja:string){
    console.log("*********** listaPreVendas *****************");
    let rs;

    try {
      const response = await api.get(`prevendas/${indicador}/${mes}/${ano}/${loja}`, {
        headers: { "Content-Type": "application/json" },
      });
      rs = {
        statusCode: 200,
        data: response.data,
      };

    } catch (e) {
      console.error("Error na requisição");
      rs = {
        status: 401,
        msg: "Erro na requisição",
      };
    }
    return rs;
  }
  async listaProdutos(prevenda: string) {
    console.log("*********** listaProdutos *****************");
    let rs;

    try {
      const response = await api.get(`produtos/${prevenda}`, {
        headers: { "Content-Type": "application/json" },
      });
      rs = {
        statusCode: 200,
        data: response.data,
      };

    } catch (e) {
      console.error("Error na requisição");
      rs = {
        status: 401,
        msg: "Erro na requisição",
      };
    }
    return rs;
  }

  async buscarPreVendas(codigoIndicador: number) {
    let rs
    try {
      const response = await api.get(`/prevendas/${codigoIndicador}/11/2023`);
      rs = {
        statusCode: 200,
        data: response.data,
        //tamanho: response.data.tamanho,
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
  async listarLojas(){
    console.log("*********** listarLojas *****************");
    let rs;
    try {
      const response = await api.get(`/prevendas/listarlojas`);
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

export default RtService;
