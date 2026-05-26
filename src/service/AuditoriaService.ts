import api from "./api";
class AuditoriaService {
  async registrar(
    link: string,
    operacao: string,
    outros: string = "",
    usuarioManual?: string,
    lat?: number,
    lng?: number
  ) {
    try {
      const codigoVendedor = localStorage.getItem("codigoUsuario");
      const idInterno = localStorage.getItem("IdUsuario");

      let identificadorFinal = usuarioManual;
      if (!identificadorFinal) {
        const codigoInvalido =
          !codigoVendedor ||
          codigoVendedor === "null" ||
          codigoVendedor === "0" ||
          codigoVendedor === "";
        identificadorFinal = codigoInvalido ? idInterno || "0" : codigoVendedor;
      }

      const idLojaRaw = localStorage.getItem("loja");
      const lojaFormatada = idLojaRaw
        ? idLojaRaw.toString().padStart(2, "0")
        : "00";

      // Enviamos latitude e longitude para o backend
      await api.post("/auditoria/registrar", {
        codigo_usuario: String(identificadorFinal),
        link_menu: link,
        operacao,
        outros: outros,
        loja: lojaFormatada,
        latitude: lat, // Envia se existir
        longitude: lng, // Envia se existir
      });
    } catch (error) {
      console.error("Erro na auditoria:", error);
    }
  }

  async registrarxxx(
    link: string,
    operacao: string,
    outros: string = "",
    usuarioManual?: string
  ) {
    try {
      // Captura os valores do storage
      const codigoVendedor = localStorage.getItem("codigoUsuario");
      const idInterno = localStorage.getItem("IdUsuario");

      // LÓGICA DE PRIORIDADE:
      // 1. Usa o manual se existir
      // 2. Se o código vendedor for 'null', string vazia ou nulo real, usa o ID interno
      let identificadorFinal = usuarioManual;

      if (!identificadorFinal) {
        const codigoInvalido =
          !codigoVendedor ||
          codigoVendedor === "null" ||
          codigoVendedor === "0" ||
          codigoVendedor === "";

        identificadorFinal = codigoInvalido ? idInterno || "0" : codigoVendedor;
      }

      // Formatação da Loja (2 dígitos)
      const idLojaRaw = localStorage.getItem("loja");
      const lojaFormatada = idLojaRaw
        ? idLojaRaw.toString().padStart(2, "0")
        : "00";

      await api.post("/auditoria/registrar", {
        codigo_usuario: String(identificadorFinal), // Forçamos string para evitar erros
        link_menu: link,
        operacao,
        outros: outros,
        loja: lojaFormatada,
      });
    } catch (error) {
      console.error("Erro na auditoria:", error);
    }
  }

  async listarAuditoria(dataInicio?: string, dataFim?: string) {
    try {
      const response = await api.get(`/auditoria/listar`, {
        params: { dataInicio, dataFim },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      return [];
    }
  }
}

export default new AuditoriaService();
