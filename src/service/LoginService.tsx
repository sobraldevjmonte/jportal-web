import axios from "axios";
import { getBaseUrl } from "../utils/redirec";


const api = axios.create({
  baseURL:  getBaseUrl(),
  headers: {
    "Content-type": "application/json",
    'Access-Control-Allow-Origin': '*',
  },
});


class LoginService {
  async login(usuario: string, senha: string) {
    console.log("*********** login do usuario(Service) *****************");
    let rs;
    let user = {
      usuario,
      senha
    }
    try {
      const response = await api.post(`/usuarios/login`, user, {
        headers: { "Content-Type": "application/json" },
      });

      rs = {
        statusCode: 200,
        data: response.data
      };
      return rs;
    } catch (error) {
      rs = {
        data: null,
        status: 401,
        msg: "Erro na requisição",
      };
    }
    return rs;
  }
}


export default LoginService;