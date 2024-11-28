import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-type": "application/json",
    'Access-Control-Allow-Origin': '*',
  },
});
class EtapasService {
  //********************** PENDENCIAS ADMIN LOJAS  *****************/
  async gerarPdfObras(idUsuario: number) {
    let idLoja = 0;
    let mes = 0;
    let tipo = ''
    let ano = ''

    // const response = await api.get(`/etapas/gerar-pdf-obras/${tipo}/${idLoja}/${mes}/${ano}`, {
    const response = await api.get(`/etapas/gerar-pdf-obras/A/B/C/D`, {
      responseType: 'blob',  // Importante para garantir que o PDF seja tratado como um arquivo
    });
    // console.log(response);
    return response;

  }
  async listaPendenciasVendasAdmin(idUsuario: number) {
    console.log("*********** listaPendenciasVendasAdmin *****************");
    let rs;
    try {
      const response = await api.get(`/etapas/lista-admin-pendencias-por-loja/${idUsuario}`);
      var q = response.data.quantidade
      let totalgx = 80.00;
      for (var i = 0; i < q; i++) {
        let xx = parseFloat(response.data.pendenciasAdminVendas[i].totalvendas)
        if (xx > 0) {
          totalgx += xx
        }
        response.data.totalgeral = totalgx
      }

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
  async listaPendenciasVendasGerentes(idLoja: number, ordem: string) {
    console.log("*********** listaPendenciasVendasGerentes *****************");
    let rs;
    try {
      const response = await api.get(`/etapas/lista-vendedores-por-loja/${idLoja}/${ordem}`);
      let size = response.data.quantidade;

      let vendedores = response.data.vendedores;
      for (let i = 0; i < size; i++) {
        let idvendedor = vendedores[i].codigoVendedor
        let rsVendasDoVendedor = await this.listaSomaEtapasPorVendedor(idvendedor)

        const arrayx = rsVendasDoVendedor.data.somaEtapasPeloVendedor;
        vendedores[i].pendenciasVendas = rsVendasDoVendedor.data.somaEtapasPeloVendedor

        for (let j = 0; j < arrayx.length; j++) {
          let x1 = arrayx[j];
          vendedores[i].etapa1 = x1.etapa1;
          vendedores[i].etapa2 = x1.etapa2;
          vendedores[i].etapa3 = x1.etapa3;
          vendedores[i].etapa4 = x1.etapa4;
          vendedores[i].etapa5 = x1.etapa5;
          vendedores[i].etapa6 = x1.etapa6;
          vendedores[i].etapa7 = x1.etapa7;
          vendedores[i].etapa8 = x1.etapa8;
          vendedores[i].etapa9 = x1.etapa9;
          vendedores[i].etapa10 = x1.etapa10;
          vendedores[i].total_reais_pendencias = x1.total_reais_pendencias;
        }
      }

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
  //********************** SOMA ADMIN LOJAS  *****************/
  async listaAdminSomaEtapasPorLoja(idLoja: number) {
    console.log("*********** listaSomaTotalEtapas *****************");
    let rs;
    try {
      const response = await api.get(`/etapas/lista-admin-soma-pendencias-por-loja/${idLoja}`);
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
  async listaSomaEtapasPorLoja(idLoja: number) {
    console.log("*********** listaSomaTotalEtapas *****************");
    let rs;
    try {
      const response = await api.get(`/etapas/lista-soma-etapas-por-loja/${idLoja}`);
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
  async clienteObra(idCliente: number) {
    let rs;
    try {
      const response = await api.get(`/etapas/cliente-obra/${idCliente}`);
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
  }
  async listaPendenciasVendas(idVendedor: number, ordem: string) {
    console.log("*********** listaVendedores *****************");
    let rs;
    try {
      const response = await api.get(`/etapas/lista-pendencias-vendas/${idVendedor}/${ordem}`);
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
  async listaPendenciasVendasdoCliente(idCliente: number) {
    console.log("*********** listaVendedores *****************");
    let rs;
    try {
      const response = await api.get(`/etapas/lista-pendencias-vendas-cliente/${idCliente}`);
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
  async listaSomaEtapasPorVendedor(idVendedor: number) {
    console.log("*********** listaSomaTotalEtapas *****************");
    let rs;
    try {
      const response = await api.get(`/etapas/lista-soma-etapas-por-vendedor/${idVendedor}`);
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
  async listaContatosFeitos(idCliente: number) {
    console.log("*********** listaContatosFeitos *****************");
    let rs;
    try {
      const response = await api.get(`/etapas/lista-contatos-feitos/${idCliente}`);
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

  async listarLojas() {
    console.log("*********** listarLojas *****************");
    let rs;
    try {
      const response = await api.get(`/etapas/listarlojas`);
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

  async listaVendedores(idLoja: number) {
    console.log("*********** listaVendedores *****************");
    let rs;
    try {
      const response = await api.get(`/etapas/listavendedores/${idLoja}`);
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

  async fitlrarVendedores(idLoja: number) {
    console.log("*********** listaVendedores *****************");
    let rs;
    try {
      const response = await api.get(`/etapas/filtrarvendedores/${idLoja}`);
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
  async salvarObservacao(idCliente: number, idVendedor: number, observacao: string) {

    console.log("*********** salvarObservacao *****************");
    let rs;
    let contato = {
      idCliente,
      idVendedor,
      observacao
    }
    try {
      const response = await api.post(`/etapas/salvar-obervacao`, contato, {
        headers: { "Content-Type": "application/json" },
      });

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

export default EtapasService;
