import axios from "axios";
import AuditoriaService from "./AuditoriaService";

import api from './api'; // Importa a instância central
// import api from './api'
// const api = axios.create({
//   baseURL: getBaseUrl(),
//   withCredentials: true, // ADICIONE ISSO para suportar HTTPS e Cookies
//   headers: {
//     "Content-type": "application/json",
//     // REMOVIDO: 'Access-Control-Allow-Origin': '*'  <-- APAGUE ESTA LINHA!
//   },
// });

class AnaliseNpService {
  async gerarPdfProdutosNp(np: number) {
    console.log("*********** gerarPdfProdutosNp(AnaliseNpService) *****************");
   
    await AuditoriaService.registrar(
      "/analise-np",
      `metodo gerarPdfProdutosNp`,
      `np: ${np}`,
    );

    try {
      const response = await api.get(`/analisenp/gerar-pdf-produtos-np/${np}`, {
        responseType: 'blob', // IMPORTANTE: para tratar a resposta como arquivo
      });
      return response;
    } catch (error) {
      console.error("Error na requisição do PDF", error);
      // Você pode querer tratar o erro de forma mais elaborada aqui
      throw error;
    }
  }
  async listarProdutosNp(np: number) {
    console.log("*********** listarProdutosNp(AnaliseNpService) *****************");
    let rs;

    await AuditoriaService.registrar(
      "/analise-np",
      `metodo listarProdutosNp`,
      `np: ${np}`,
    );

    try {
      // const response = await api.get(`/dashboard/listar-produtos-np/${np}`);
      const response = await api.get(`/analisenp/listar-produtos-np/${np}`);
      rs = {
        statusCode: 200,
        data: response.data,
      };
    } catch (error) {
      console.error("Error na requisição", error);
      rs = {
        status: 401,
        msg: "Erro na requisição",
      };
    }
    return rs;
  }

  async listarNps(mes: number, ano: number, idLoja: number) {
    console.log("*********** listarNps(AnaliseNpService) *****************");
    let rs;

    await AuditoriaService.registrar(
      "/analise-np",
      `metodo listarNps`,
      `data: ${mes}/${ano} idLoja: ${idLoja} `,
    );

    try {
      const response = await api.get(`/analisenp/listar-nps/${mes}/${ano}/${idLoja}`);
      rs = {
        statusCode: 200,
        data: response.data,
      };
    } catch (error) {
      console.error("Error na requisição", error);
      rs = {
        status: 401,
        msg: "Erro na requisição",
      };
    }
    return rs;
  }

  // --- NOVAS FUNÇÕES ADICIONADAS ---

  /**
   * Busca os dados de uma Nota de Pedido (NP) específica.
   * @param np - O número da NP a ser buscada.
   */
  async buscarNp(np: number) {
    console.log("*********** buscarNp(AnaliseNpService) *****************");
    let rs;

    await AuditoriaService.registrar(
      "/analise-np",
      `metodo buscarNp`,
      `np: ${np}`
    );

    try {
      const response = await api.get(`/analisenp/buscar-np/${np}`);
      rs = {
        statusCode: 200,
        data: response.data,
      };
    } catch (error) {
      console.error("Error na requisição", error);
      rs = {
        status: 401,
        msg: "Erro na requisição",
      };
    }
    return rs;
  }

  /**
   * Cria uma nova Nota de Pedido (NP).
   * @param dadosNp - Um objeto contendo os dados da nova NP.
   */
  async criarNp(dadosNp: object) {
    console.log("*********** criarNp(AnaliseNpService) *****************");
    let rs;

    await AuditoriaService.registrar(
      "/analise-np",
      `metodo criarNp`,
      `dadosNp: ***`
    );

    try {
      // Para criar, usamos o método POST e enviamos os dados no corpo da requisição
      const response = await api.post(`/analisenp/criar-np`, dadosNp);
      rs = {
        statusCode: 201, // 201 Created é o status comum para criação
        data: response.data,
      };
    } catch (error) {
      console.error("Error na requisição", error);
      rs = {
        status: 400, // 400 Bad Request é comum para erros de criação
        msg: "Erro na requisição",
      };
    }
    return rs;
  }

  /**
   * Atualiza uma Nota de Pedido (NP) existente.
   * @param np - O número da NP a ser atualizada.
   * @param dadosAtualizados - Um objeto contendo os campos a serem atualizados.
   */
  async atualizarNp(np: number, dadosAtualizados: object) {
    console.log("*********** atualizarNp(AnaliseNpService) *****************");
    let rs;

    await AuditoriaService.registrar(
      "/analise-np",
      `metodo atualizarNp`,
      `np: ${np} dados: ***`
    );

    try {
      // Para atualizar, usamos o método PUT ou PATCH
      const response = await api.put(`/analisenp/atualizar-np/${np}`, dadosAtualizados);
      rs = {
        statusCode: 200,
        data: response.data,
      };
    } catch (error) {
      console.error("Error na requisição", error);
      rs = {
        status: 400,
        msg: "Erro na requisição",
      };
    }
    return rs;
  }

  /**
   * Exclui uma Nota de Pedido (NP).
   * @param np - O número da NP a ser excluída.
   */
  async excluirNp(np: number) {
    console.log("*********** excluirNp(AnaliseNpService) *****************");
    let rs;

    await AuditoriaService.registrar(
      "/analise-np",
      `metodo excluirNp`,
      `np: ${np}`
    );

    try {
      // Para deletar, usamos o método DELETE
      const response = await api.delete(`/analisenp/excluir-np/${np}`);
      rs = {
        statusCode: 204, // 204 No Content é o status padrão para delete bem-sucedido
        data: response.data, // Geralmente o corpo da resposta é vazio
      };
    } catch (error) {
      console.error("Error na requisição", error);
      rs = {
        status: 400,
        msg: "Erro na requisição",
      };
    }
    return rs;
  }
}

export default AnaliseNpService;