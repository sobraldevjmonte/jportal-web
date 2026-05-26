import AuditoriaService from "./AuditoriaService";

import api from "./api";

class GrupoSubGrupoService {
  async listarVendasGruposPorLojaAnoAnterior(
    grupo: string,
    loja: string,
    mes: string
  ) {
    let rs;

    await AuditoriaService.registrar(
      "/grupo-subgrupo-service",
      "metodo listarVendasGruposPorLojaAnoAnterior",
      `grupo: ${grupo} loja: ${loja} mes: ${mes}`
    );

    try {
      const response = await api.get(
        `/grupos-subgrupos/listar-vendas-por-loja-ano-anterior/${grupo}/${loja}/${mes}`
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
  async listarVendasGruposPorLoja(grupo: string, loja: string, mes: string) {
    let rs;
    await AuditoriaService.registrar(
      "/grupo-subgrupo-service",
      "metodo listarVendasGruposPorLoja",
      `grupo: ${grupo} loja: ${loja} mes: ${mes}`
    );

    try {
      const response = await api.get(
        `/grupos-subgrupos/listar-vendas-por-loja/${grupo}/${loja}/${mes}`
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
  async listarCodigosGrupos(grupo: string) {
    let rs;

    await AuditoriaService.registrar(
      "/grupo-subgrupo-service",
      "metodo listarCodigosGrupos",
      `grupo: ${grupo}`
    );

    try {
      const response = await api.get(
        `/grupos-subgrupos/listar-codigos-grupos/${grupo}`
      );

      rs = {
        statusCode: 200,
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
  async listarGrupos(loja: string, mes: string) {
    let rs;
    await AuditoriaService.registrar(
      "/grupo-subgrupo-service",
      "metodo listarGrupos",
      `loja: ${loja} mes: ${mes} `
    );

    console.log("********* listarGrupos **************");
    console.log(loja, mes);
    try {
      const response = await api.get(
        `/grupos-subgrupos/listar-grupos/${loja}/${mes}`
      );
      rs = {
        statusCode: 200,
        data: response.data,
      };
    } catch (error) {
      // console.error("Error na requisição xxx");
      console.log(error);
      rs = {
        status: 401,
        msg: error,
      };
    }
    return rs;
  }
  async listarGruposAnoAnterior(loja: string, mes: string) {
    let rs;

    await AuditoriaService.registrar(
      "/grupo-subgrupo-service",
      "metodo listarGruposAnoAnterior",
      `loja: ${loja} mes: ${mes} `
    );

    try {
      const response = await api.get(
        `/grupos-subgrupos/listar-grupos-ano-anterior/${loja}/${mes}`
      );
      rs = {
        statusCode: 200,
        data: response.data,
      };
    } catch (error) {
      // console.error("Error na requisição xxx");
      console.log(error);
      rs = {
        status: 401,
        msg: error,
      };
    }
    return rs;
  }
}

export default GrupoSubGrupoService;
