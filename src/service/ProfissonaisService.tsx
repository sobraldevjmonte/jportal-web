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

class ProfissionaisService {
  async inativarPremio(id_brinde: number) {
    let rs;
    let response;
    try {
      response = await api.put(`/profissionais/inativar-brinde/${id_brinde}`);
      rs = {
        msg: response.data.mensagem,
        statusCode: response.status
      };
    } catch (error) {
      console.error("Error na requisição");
      rs = {
        msg: 'Não foi possível excluir.',
        status: 401,
      };
    }
    return rs;
  }
  async excluirPremio(id_brinde: number) {
    console.log("*********** upLoadImage(ProfissionaisService) *****************");
    let rs;
    let response;
    try {
      response = await api.delete(`/profissionais/excluir-brinde/${id_brinde}`);
      rs = {
        msg: response.data.mensagem,
        statusCode: response.status
      };
    } catch (error: any) {
      rs = {
        msg: error.response?.data?.mensagem || 'Erro ao excluir brinde',
        status: error.response?.status || 409,
      };
    }
    return rs;
  }
  async atualizarRegistro(objeto: any) {
    console.log("*********** upLoadImage(ProfissionaisService) *****************");
    let rs;
    let response;

    const dados = {
      id_brinde: objeto.id_brinde,
      descricao: objeto.descricao,
      pontos: objeto.pontos,
      valor: objeto.valor,
      quantidade: objeto.quantidade,
      imagem: objeto.imagem,
      codigo: objeto.codigo,
      ativo: 'S'
    }
    try {
      response = await api.put(`/profissionais/atualizar-brinde`, dados, { headers: { 'Content-Type': 'application/json' } });
      rs = {
        statusCode: 200
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
  async salvarRegistro(objeto: any) {
    console.log("*********** upLoadImage(ProfissionaisService) *****************");
    let rs;

    const dados = {
      descricao: objeto.descricao,
      pontos: objeto.pontos,
      valor: objeto.valor,
      quantidade: objeto.quantidade,
      imagem: objeto.imagem,
      codigo: objeto.codigo,
      ativo: 'S'
    }
    try {
      rs = await api.post(`/profissionais/salvar-brinde`, dados);

      return rs.data;
    } catch (error) {
      console.log(error);
    }
    return rs;
  }
  async upLoadImage(image: any) {
    let rs;
    let response;

    try {
      response = await api.post(`/profissionais/anexar-arquivo`,
        image,
        {
          headers: { "Content-Type": "multipart/form-data" },
        });

      rs = {
        statusCode: response.status,
        data: response.data,
      };
      return rs;
    } catch (error) {
      console.error("Error na requisição");

      rs = {
        status: 401,
        msg: "Erro na requisição",
      };
    }
    return rs;
  }
  async salvarNp(dataEncontrada: string, valorEncontrado: number, vlr_pp: number, id_np: number, numero_np: string, idLoja: number) {
    console.log("*********** salvarNp(ProfissionaisService) *****************");
    let rs;

    const dados = {
      data_np: dataEncontrada,
      valor_np: valorEncontrado,
      vlr_pp: vlr_pp,
      numero_np: numero_np,
      id_loja: idLoja
    }
    try {
      const response = await api.put(`/profissionais/salvar-np/${id_np}`, dados, { headers: { 'Content-Type': 'application/json' } });
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
  async rejeitarPedido(obj: any) {
    console.log("*********** listarPedidos(ProfissionaisService) *****************");
    let rs;
    try {
      const response = await api.put(`/profissionais/rejeitar-np`, { obj });
      if (response.status) {
        rs = {
          statusCode: response.status,
          data: response.data,
        };
      } else {
        rs = {
          statusCode: response.status,
          data: null,
        };
      }

    } catch (error) {
      console.error("Error na requisição");
      rs = {
        status: 401,
        msg: "Erro na requisição",
      };
    }
    return rs;
  }
  async aprovarPedido(id_vendas: number, id_usuario: number, total_pontos: number) {
    console.log("*********** listarPedidos(ProfissionaisService) *****************");
    let rs;
    try {
      const response = await api.put(`/profissionais/aprovar-np/${id_vendas}/${id_usuario}/${total_pontos}`);
      console.log(response)
      if (response.status) {
        rs = {
          statusCode: response.status,
          data: response.data,
        };
      } else {
        rs = {
          statusCode: response.status,
          data: null,
        };
      }

    } catch (error) {
      console.error("Error na requisição");
      rs = {
        status: 401,
        msg: "Erro na requisição",
      };
    }
    return rs;
  }
  async buscarNp(id_np: number) {
    console.log("*********** listarPedidos(ProfissionaisService) *****************");
    let rs;
    try {
      const response = await api.get(`/profissionais/buscar-np/${id_np}`);
      if (response.status) {
        rs = {
          statusCode: response.status,
          data: response.data,
        };
      } else {
        rs = {
          statusCode: response.status,
          data: null,
        };
      }

    } catch (error) {
      console.error("Error na requisição");
      rs = {
        status: 401,
        msg: "Erro na requisição",
      };
    }
    return rs;
  }
  async listarPedidos(mes: number, ano: number, idLoja: number) {
    console.log("*********** listarPedidos(ProfissionaisService) *****************");
    let rs;
    try {
      const response = await api.get(`/profissionais/listar-pedidos/${mes}/${ano}/${idLoja}`);
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



  async imprimirPedidos(mes: number, ano: number, idLoja: number) {
    const response = await api.get(`/profissionais/imprimir-pedidos/${mes}/${ano}/${idLoja}`, {
      responseType: 'blob',  // Importante para garantir que o PDF seja tratado como um arquivo
    });
    console.log(response);
    return response;
  }

  async imprimirTodosPedidos() {
    const response = await api.get(`/profissionais/imprimir-todos-pedidos`, {
      responseType: 'blob',  // Importante para garantir que o PDF seja tratado como um arquivo
    });
    return response;
  }





  async listarPremios() {
    console.log("*********** listarPremios(ProfissionaisService) *****************");
    let rs;
    try {
      const response = await api.get(`/profissionais/premios-listar`);

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
  async ativarUsuario(id: number, ativo: string) {
    console.log("*********** ativar/inativar usuario(ProfissionaisService) *****************");
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
      console.error(error);
      rs = {
        status: 401,
        msg: "Erro na requisição",
      };
    }
    return rs;
  }
  async excluirUsuario(id: number) {
    console.log("*********** excluir usuario(ProfissionaisService) *****************");
    let rs;
    let response;
    try {
      response = await api.delete(`/profissionais/excluir-usuario/${id}`);
      rs = {
        statusCode: response.status,
        data: response.data,
      };
    } catch (error) {
      console.error(error);
      rs = {
        statusCode: 401,
        msg: "Não é permito a exclusão.",
      };
    }
    return rs;
  }
}

export default ProfissionaisService;