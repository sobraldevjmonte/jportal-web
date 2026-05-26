import api from "./api";

class ObrasService {
  // Lista todas as obras com filtros de perfil (Vendedor, Gerente ou Admin)
  async listarTodasObrasGeral(filtros: {
    codigoVendedor?: string | number;
    idNivelUsuario?: number;
    idLoja?: number | string;
    codigoLoja?: string;
  }) {
    try {
      return await api.get(`/obras/relatorio-admin-completo`, {
        params: filtros,
      });
    } catch (error) {
      console.error("Erro ao listar obras geral:", error);
      throw error;
    }
  }

  // Busca os dados de uma única obra pelo ID primário para edição isolada
  async buscarObraPorId(id: number) {
    try {
      return await api.get(`/obras/buscar/${id}`);
    } catch (error) {
      console.error("Erro ao buscar obra por ID:", error);
      throw error;
    }
  }

  async downloadRelatorioObrasGestao(filtros: any) {
    // Se o valor for "TODAS" ou "TODOS", removemos para não dar conflito de tipo no banco
    const cleanParams = { ...filtros };
    if (cleanParams.idLoja === "TODAS" || cleanParams.idLoja === "TODOS")
      delete cleanParams.idLoja;
    if (cleanParams.codigoVendedor === "TODOS")
      delete cleanParams.codigoVendedor;
    if (cleanParams.status === "TODOS") delete cleanParams.status;

    return await api.get(`/obras/relatorio-pdf`, {
      params: cleanParams,
      responseType: "blob",
    });
  }

  async downloadRelatorioOportunidades(
    codigoUsuario: string | number,
    etapa?: number | null
  ) {
    return await api.get(`/obras/relatorio-oportunidades`, {
      params: {
        idVendedor: codigoUsuario, // <-- Alterado de codigoUsuario para idVendedor (veja o motivo abaixo)
        etapa: etapa || "",
      },
      responseType: "blob", // OBRIGATÓRIO PARA PDF
    });
  }
}

export default new ObrasService();
