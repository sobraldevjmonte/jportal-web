import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-type": "application/json",
    'Access-Control-Allow-Origin': '*',
  },
});

class ProfissionaisService {
  async atualizarRegistro(objeto: any) {
    console.log("*********** upLoadImage(ProfissionaisService) *****************");
    let rs;
    let response;

    const dados = {
      descricao: objeto.descricao,
      pontos: objeto.pontos,
      valor: objeto.valor,
      quantidade: objeto.quantidade,
      imagem: objeto.imagem,
      ativo: 'S'
    }
    try {
      response = await api.put(`/profissionais/atualizar-brinde`, dados, { headers: { 'Content-Type': 'application/json' } });

      console.log(response)
      rs = {
        statusCode: response.status
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
    let response;

    const dados = {
      descricao: objeto.descricao,
      pontos: objeto.pontos,
      valor: objeto.valor,
      quantidade: objeto.quantidade,
      imagem: objeto.imagem,
      ativo: 'S'
    }
    try {
      response = await api.post(`/profissionais/salvar-brinde`, dados, { headers: { 'Content-Type': 'application/json' } });

      console.log(response)
      rs = {
        statusCode: response.status
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
  async salvarNp(dataEncontrada: string, valorEncontrado: number, vlr_pp: number, id_np: string, numero_np: string, idLoja: number) {
    console.log(dataEncontrada, valorEncontrado, vlr_pp, id_np);

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

      // const resposta = await axios.put(
      //   `${this.host}adm_vendas/atualizarStatusPedido`,
      //   dados,
      //   { headers: { 'Content-Type': 'application/json' } }
      // )

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

  async rejeitarPedido(id_vendas: number) {
    console.log("*********** listarPedidos(ProfissionaisService) *****************");
    let rs;
    try {
      const response = await api.put(`/profissionais/rejeitar-np/${id_vendas}`);
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

}

export default ProfissionaisService;