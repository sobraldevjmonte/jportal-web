import AuditoriaService from "./AuditoriaService";

import api from './api';

class RtService {
  async listarIndicadores(mes: number, ano: number, loja: string) {
    console.log(mes + '/' + ano)
    console.log('loja: ' + loja)

    let page = 1
    console.log("*********** listarIndicadores *****************");
    let rs;
    try {
      const response = await api.get(`/indicadores/${mes}/${ano}/${loja}`);

      await AuditoriaService.registrar(
        "/rt-service",
        "metodo listarIndicadores",
        `Período: ${mes}/${ano}`
      );

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
  async listaPreVendas(indicador: string, mes: number, ano: number, loja: string) {
    console.log("*********** listaPreVendas *****************");
    let rs;
    
    await AuditoriaService.registrar(
      "/rt-service",
      "metodo listaPreVendas",
      `Período: ${mes}/${ano}`
    );

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
  async listaPreVendasDoCliente(idCliente: number) {
    console.log("*********** listaPreVendas *****************");
    let rs;

    await AuditoriaService.registrar(
      "/rt-service",
      "metodometodo listaPreVendasDoCliente",
      `Cliente: ${idCliente}`
    );

    try {
      const response = await api.get(`prevendas-do-cliente/${idCliente}`, {
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

    await AuditoriaService.registrar(
      "/rt-service",
      "metodo listaProdutos",
      `prevenda: ${prevenda}`
    );

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

    await AuditoriaService.registrar(
      "/rt-service",
      "metodo buscarPreVendas",
      `codigoIndicador: ${codigoIndicador}`
    );

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
  async listarLojas() {
    console.log("*********** listarLojas *****************");
    let rs;

    await AuditoriaService.registrar(
      "/rt-service",
      "metodo listarLojas",
      ``
    );
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
