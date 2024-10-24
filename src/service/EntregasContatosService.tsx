import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-type": "application/json",
    'Access-Control-Allow-Origin': '*',
  },
});
class EntregasContatosService {
  async alterarObsVendedor(dados: any) {
    console.log("*********** listaEntregasContatosDoVendedor *****************");
    let rs;
    try {
      const response = await api.put(`/entregas-contatos/alterar-obs-vendedor`, dados, {
        headers: { "Content-Type": "application/json" },
      });
      var q = response.data.quantidade
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
  async salvarObsVendedor(dados: any) {
    console.log("*********** listaEntregasContatosDoVendedor *****************");
    let rs;
    try {
      const response = await api.post(`/entregas-contatos/salvar-obs-vendedor`, dados, {
        headers: { "Content-Type": "application/json" },
      });
      var q = response.data.quantidade
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

  async listaLojasDoAdmin() {
    console.log("*********** listaVendedoresDoGerente *****************");
    let rs;
    try {
      const response = await api.get(`/entregas-contatos/lista-lojas-do-admin`);
      var q = response.data.quantidade
      rs = {
        statusCode: 200,
        data: response.data,
        quantidade: response.data.quantidade
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

  async listaVendedoresDoGerente(codigoLoja: string) {
    console.log("*********** listaVendedoresDoGerente *****************");
    console.log(codigoLoja);
    let rs;
    try {
      const response = await api.get(`/entregas-contatos/lista-vendedores-do-gerente/${codigoLoja}`);
      var q = response.data.quantidade
      rs = {
        statusCode: 200,
        data: response.data,
        quantidade: response.data.quantidade
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
  async listaEntregasContatosDoGerente(codigoLoja: string) {
    console.log("*********** listaEntregasContatosDoGerente *****************");
    let rs;
    try {
      const response = await api.get(`/entregas-contatos/lista-entregas-contatos-gerente/${codigoLoja}`);
      var q = response.data.quantidade
      rs = {
        statusCode: 200,
        data: response.data,
        quantidade: response.data.quantidade
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

  async listaEntregasContatosDoVendedor(codigoVendedor: string) {
    console.log("*********** listaEntregasContatosDoVendedor *****************");
    let rs;
    try {
      const response = await api.get(`/entregas-contatos/lista-entregas-contatos-vendedor/${codigoVendedor}`);
      var q = response.data.quantidade
      rs = {
        statusCode: 200,
        data: response.data,
        quantidade: response.data.quantidade
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

export default EntregasContatosService;