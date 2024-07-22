import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-type": "application/json",
    'Access-Control-Allow-Origin': '*',
  },
});

class ProfissionaisService {

  async ativarUsuario(id: number, ativo: string) {
    console.log("*********** listarPedidos(ProfissionaisService) *****************");
    let rs;
    let response;
    try {
      if (ativo === 'S') {
        response = await api.put(`/profissionais/inativar-usuario/${id}`);
      } else {
        response = await api.put(`/profissionais/ativar-usuario/${id}`);
      }

      rs = {
        statusCode: response.status,
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
  async listarPedidos() {
    console.log("*********** listarPedidos(ProfissionaisService) *****************");
    let rs;
    try {
      const response = await api.get(`/profissionais/listar-pedidos`);

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

  async listarUsuarios() {
    console.log("*********** listarPedidos(ProfissionaisService) *****************");
    let rs;
    try {
      const response = await api.get(`/profissionais/listar-usuarios`);

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

export default ProfissionaisService;