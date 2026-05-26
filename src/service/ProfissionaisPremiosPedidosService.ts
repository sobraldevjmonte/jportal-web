import AuditoriaService from "./AuditoriaService";

import api from './api'; 

class ProfissionaisPremiosPedidosService {
  async listaPedidos() {
    await AuditoriaService.registrar(
      "/adm-prof-premios-pedidos-service",
      "metodo listaPedidos",
      ``
    );

    let rs;
    try {
      const response = await api.get(`/profissionais-pedidos/listar-pedidos`);

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
  async liberarPedido(idPedido: number, idPremio: number) {
    let rs;

    await AuditoriaService.registrar(
      "/adm-prof-premios-pedidos-service",
      "metodo liberarPedido",
      `idPedido: ${idPedido} idPremio: ${idPremio} `
    );

    try {
      const response = await api.post(
        `/profissionais-pedidos/liberar-pedido/${idPedido}/${idPremio}`
      );

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
  async aprovarPedido(idPedido: number, idAutorizador: number) {
    let rs;

    await AuditoriaService.registrar(
      "/adm-prof-premios-pedidos-service",
      "metodo aprovarPedido",
      `idPedido: ${idPedido} idAutorizador: ${idAutorizador} `
    );

    try {
      const response = await api.post(
        `/profissionais-pedidos/aprovar-pedido/${idPedido}/${idAutorizador}`
      );

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
  async rejeitarPedido(idPedido: number, idParceiro: number) {
    let rs;

    await AuditoriaService.registrar(
      "/adm-prof-premios-pedidos-service",
      "metodo rejeitarPedido",
      `idPedido: ${idPedido} idParceiro: ${idParceiro} `
    );

    try {
      const response = await api.post(
        `/profissionais-pedidos/rejeitar-pedido/${idPedido}/${idParceiro}`
      );

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
  async entregarPedido(idPedido: number, idPremio: number, idParceiro: number) {
    let rs;

    await AuditoriaService.registrar(
      "/adm-prof-premios-pedidos-service",
      "metodo entregarPedido",
      `idPedido: ${idPedido} idParceiro: ${idParceiro} `
    );

    try {
      const response = await api.post(
        `/profissionais-pedidos/entregar-pedido/${idPedido}/${idPremio}/${idParceiro}`
      );

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

export default ProfissionaisPremiosPedidosService;
