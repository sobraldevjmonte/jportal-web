import AuditoriaService from "./AuditoriaService";

import api from "./api";

class EtapasService {
  //********************** PENDENCIAS ADMIN LOJAS  *****************/
  async gerarPdfObrasLoja(idLoja: number) {
    await AuditoriaService.registrar(
      "/etapas-service",
      "metodo gerarPdfObrasLoja",
      `codigoLoja: ${idLoja} `
    );

    const response = await api.get(
      `/etapas/gerar-pdf-obras-da-loja/${idLoja}`,
      {
        responseType: "blob",
      }
    );
    return response;
  }
  async gerarPdfObras(idLoja: number, idVendedor: string = "0") {
    // Usamos query params (?idVendedor=) para manter a compatibilidade com a rota GET

    await AuditoriaService.registrar(
      "/etapas-service",
      "metodo gerarPdfObras",
      `codigoLoja: ${idLoja} idVendedor: ${idVendedor}`
    );

    const response = await api.get(
      `/etapas/gerar-pdf-obras/GERAL/${idLoja}/0/0?idVendedor=${idVendedor}`,
      {
        responseType: "blob",
      }
    );
    return response;
  }

  async listaPendenciasVendasAdmin(idUsuario: number) {
    let rs;

    await AuditoriaService.registrar(
      "/etapas-service",
      "metodo listaPendenciasVendasAdmin",
      `idUsuario: ${idUsuario}`
    );

    try {
      const response = await api.get(
        `/etapas/lista-admin-pendencias-por-loja/${idUsuario}`
      );
      var q = response.data.quantidade;
      let totalgx = 80.0;
      for (var i = 0; i < q; i++) {
        let xx = parseFloat(response.data.pendenciasAdminVendas[i].totalvendas);
        if (xx > 0) {
          totalgx += xx;
        }
        response.data.totalgeral = totalgx;
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
    let rs;

    await AuditoriaService.registrar(
      "/etapas-service",
      "metodo listaPendenciasVendasGerentes",
      `idLoja: ${idLoja} ordem: ${ordem}`
    );

    try {
      const response = await api.get(
        `/etapas/lista-vendedores-por-loja/${idLoja}/${ordem}`
      );
      let size = response.data.quantidade;
      let vendedores = response.data.vendedores;

      for (let i = 0; i < size; i++) {
        let idvendedor = vendedores[i].codigoVendedor;
        let rsVendasDoVendedor = await this.listaSomaEtapasPorVendedor(
          idvendedor
        );

        const arrayx = rsVendasDoVendedor.data.somaEtapasPeloVendedor;
        vendedores[i].pendenciasVendas = arrayx;

        for (let j = 0; j < arrayx.length; j++) {
          let x1 = arrayx[j];
          // Campos Pendentes (Linha Preta)
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

          // --- NOVO: Campos Faturados (Linha Verde) ---
          vendedores[i].etapafat1 = x1.etapafat1;
          vendedores[i].etapafat2 = x1.etapafat2;
          vendedores[i].etapafat3 = x1.etapafat3;
          vendedores[i].etapafat4 = x1.etapafat4;
          vendedores[i].etapafat5 = x1.etapafat5;
          vendedores[i].etapafat6 = x1.etapafat6;
          vendedores[i].etapafat7 = x1.etapafat7;
          vendedores[i].etapafat8 = x1.etapafat8;
          vendedores[i].etapafat9 = x1.etapafat9;
          vendedores[i].etapafat10 = x1.etapafat10;
          vendedores[i].total_reais_faturadas = x1.total_reais_faturadas;
        }
      }

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
  //********************** SOMA ADMIN LOJAS  *****************/
  async listaAdminSomaEtapasPorLoja(idLoja: number) {
    let rs;

    await AuditoriaService.registrar(
      "/etapas-service",
      "metodo listaAdminSomaEtapasPorLoja",
      `idLoja: ${idLoja}`
    );

    try {
      const response = await api.get(
        `/etapas/lista-admin-soma-pendencias-por-loja/${idLoja}`
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
  async listaSomaEtapasPorLoja(idLoja: number) {
    let rs;

    await AuditoriaService.registrar(
      "/etapas-service",
      "metodo listaSomaEtapasPorLoja",
      `idLoja: ${idLoja}`
    );

    try {
      const response = await api.get(
        `/etapas/lista-soma-etapas-por-loja/${idLoja}`
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
  async clienteObra(idCliente: number) {
    let rs;

    await AuditoriaService.registrar(
      "/etapas-service",
      "metodo clienteObra",
      `idCliente: ${idCliente}`
    );

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

  // Localize a linha 195 e deixe assim:
  async listaPendenciasVendas(
    idVendedor: number | string,
    ordem: string,
    mostrarFaturado: boolean = false
  ) {
    try {
      const response = await api.get(
        `/etapas/lista-pendencias-vendas/${idVendedor}/${ordem}`,
        {
          params: { mostrarFaturado },
        }
      );
      return {
        statusCode: 200,
        data: response.data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        msg: "Erro na requisição",
      };
    }
  }

  async listaPendenciasVendasdoCliente(idCliente: number) {
    let rs;

    await AuditoriaService.registrar(
      "/etapas-service",
      "metodo listaPendenciasVendasdoCliente",
      `idCliente: ${idCliente}`
    );

    try {
      const response = await api.get(
        `/etapas/lista-pendencias-vendas-cliente/${idCliente}`
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
  async listaSomaEtapasPorVendedor(idVendedor: number) {
    let rs;

    await AuditoriaService.registrar(
      "/etapas-service",
      "metodo listaSomaEtapasPorVendedor",
      `idVendedor: ${idVendedor}`
    );

    try {
      const response = await api.get(
        `/etapas/lista-soma-etapas-por-vendedor/${idVendedor}`
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
  async listaContatosFeitos(idCliente: number) {
    let rs;

    await AuditoriaService.registrar(
      "/etapas-service",
      "metodo listaContatosFeitos",
      `idCliente: ${idCliente}`
    );

    try {
      const response = await api.get(
        `/etapas/lista-contatos-feitos/${idCliente}`
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

  async listarLojas() {
    let rs;

    await AuditoriaService.registrar(
      "/etapas-service",
      "metodo listarLojas",
      ``
    );

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
    let rs;

    await AuditoriaService.registrar(
      "/etapas-service",
      "metodo listaVendedores",
      `idLoja: ${idLoja}`
    );

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

  async listarVendedoresGeral() {
    await AuditoriaService.registrar(
      "/etapas-service",
      "metodo listarVendedoresGeral",
      ``
    );

    try {
      const response = await api.get(`/etapas/lista-vendedores`);
      return { statusCode: 200, data: response.data };
    } catch (error) {
      return { status: 401, msg: "Erro ao listar vendedores" };
    }
  }

  /**
   * Busca vendedores filtrados por loja (útil para cascatear o filtro)
   */
  async filtrarVendedoresPorLoja(idLoja: number) {
    await AuditoriaService.registrar(
      "/etapas-service",
      "metodo filtrarVendedoresPorLoja",
      `idLoja: ${idLoja}`
    );

    try {
      const response = await api.get(`/etapas/filtrar-vendedores/${idLoja}`);
      return { statusCode: 200, data: response.data };
    } catch (error) {
      return { status: 401, msg: "Erro ao filtrar vendedores" };
    }
  }

  async fitlrarVendedores(idLoja: number) {
    let rs;
    await AuditoriaService.registrar(
      "/etapas-service",
      "metodo fitlrarVendedores",
      `idLoja: ${idLoja}`
    );

    try {
      const response = await api.get(`/etapas/filtrar-vendedores/${idLoja}`);
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
  async salvarObservacao(
    idCliente: number,
    idVendedor: number,
    observacao: string
  ) {
    let rs;
    await AuditoriaService.registrar(
      "/etapas-service",
      "metodo salvarObservacao",
      `idCliente: ${idCliente} idVendedor: ${idVendedor} obs: '***'`
    );

    let contato = {
      idCliente,
      idVendedor,
      observacao,
    };
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

  async listarObrasPorCliente(idCliente: string) {
    try {
      const response = await api.get(`/etapas/obras/${idCliente}`);
      return response;
    } catch (error) {
      console.error("Erro ao listar obras do cliente:", error);
      throw error;
    }
  }

  async salvarObraEtapa(dadosObra: any) {
    try {
      const response = await api.post(`/etapas/obras`, dadosObra);
      return response;
    } catch (error) {
      console.error("Erro ao salvar obra:", error);
      throw error;
    }
  }

  async excluirObraEtapa(idObra: number) {
    try {
      const response = await api.delete(`/etapas/obras/${idObra}`);
      return response;
    } catch (error) {
      console.error("Erro ao excluir obra:", error);
      throw error;
    }
  }

  async editarObraEtapa(id: number, dados: any) {
    return await api.put(`/etapas/obras/${id}`, dados);
  }

  async finalizarObra(idObra: number) {
    return await api.put(`/etapas/obras/finalizar/${idObra}`);
  }

  async downloadRelatorioObras(idLoja: number, codigos: string[]) {
    const ids = codigos.join(",");
    return await api.get(`/etapas/relatorio-obras/${idLoja}/${ids}`, {
      responseType: "blob",
    });
  }

  async gerarPdfObrasAdminCompleto(idLoja: number, codigoVendedor: string) {
    return await api.get(`/etapas/relatorio-admin-completo`, {
      params: { idLoja, codigoVendedor },
      responseType: "blob",
    });
  }
  async listarPendenciasDaPendencia(idCliente: number | string, idVendedor: number | string) {
    try {
      const response = await api.get(
        `/etapas/pendencias-da-pendencia/${idCliente}/${idVendedor}`
      );
      return { statusCode: 200, data: response.data };
    } catch (error) {
      return { statusCode: 500, msg: "Erro ao listar pendências da pendência" };
    }
  }

  async listarPendenciasDaPendenciaPorVendedor(idVendedor: number | string) {
    try {
      const response = await api.get(
        `/etapas/pendencias-da-pendencia-vendedor/${idVendedor}`
      );
      return { statusCode: 200, data: response.data };
    } catch (error) {
      return { statusCode: 500, msg: "Erro ao listar por vendedor" };
    }
  }

  async salvarPendenciaDaPendencia(dados: any) {
    try {
      const response = await api.post(`/etapas/pendencias-da-pendencia`, dados);
      return { statusCode: 201, data: response.data };
    } catch (error) {
      return { statusCode: 500, msg: "Erro ao salvar" };
    }
  }

  async editarPendenciaDaPendencia(id: number, dados: any) {
    try {
      const response = await api.put(`/etapas/pendencias-da-pendencia/${id}`, dados);
      return { statusCode: 200, data: response.data };
    } catch (error) {
      return { statusCode: 500, msg: "Erro ao editar" };
    }
  }

  async excluirPendenciaDaPendencia(id: number) {
    try {
      const response = await api.delete(`/etapas/pendencias-da-pendencia/${id}`);
      return { statusCode: 200, data: response.data };
    } catch (error) {
      return { statusCode: 500, msg: "Erro ao excluir" };
    }
  }

  async finalizarPendenciaDaPendencia(id: number) {
    try {
      const response = await api.put(`/etapas/pendencias-da-pendencia/finalizar/${id}`);
      return { statusCode: 200, data: response.data };
    } catch (error) {
      return { statusCode: 500, msg: "Erro ao finalizar" };
    }
  }
}

export default EtapasService;
