import http from "./api";

class TrackerService {
  static listarStatusVendedores(idLoja: any) {
    throw new Error("Method not implemented.");
  }
  /**
   * Busca as configurações globais do sistema
   */
  async buscarConfiguracoes() {
    try {
      return await http.get(`/configuracoes/buscar`);
    } catch (error) {
      console.error("Erro ao buscar configurações globais:", error);
      throw error;
    }
  }

  /**
   * Busca logs de auditoria de um vendedor específico
   */
  async buscarLogsVendedor(codigoVendedor: string) {
    try {
      return await http.get(`/usuarios/logs/${codigoVendedor}`);
    } catch (error) {
      console.error("Erro ao buscar logs de auditoria:", error);
      throw error;
    }
  }

  /**
   * Atualiza o endereço reverso (Geocoding) de um log existente
   */
  async atualizarEnderecoLog(id: number, endereco: string) {
    try {
      return await http.post(`/usuarios/atualizar-endereco-log`, {
        id,
        endereco,
      });
    } catch (error) {
      console.error("Erro ao atualizar endereço do log:", error);
      throw error;
    }
  }

  /**
   * Registra a presença/localização (GPS) do usuário
   */
  async registrarHeartbeat(
    codigoUsuario: any,
    idLoja: any,
    lat: any,
    lng: any
  ) {
    try {
      // Usando a instância 'http' para garantir os headers de segurança
      return await http.post(`/usuarios/heartbeat`, {
        codigoUsuario,
        idLoja,
        latitude: lat,
        longitude: lng,
      });
    } catch (error) {
      console.error("Erro ao registrar heartbeat:", error);
      throw error;
    }
  }

  /**
   * Busca a lista de vendedores da loja com status de online/offline
   */
  async listarStatusVendedores(idLoja: number) {
    try {
      return await http.get(`/usuarios/status-presenca-loja/${idLoja}`);
    } catch (error) {
      console.error("Erro ao listar presença dos vendedores:", error);
      throw error;
    }
  }

  async alterarStatusUsuario(
    idUsuario: number,
    idLoja: number,
    novoStatus: "S" | "N"
  ) {
    try {
      // Utilizamos a rota de admin já mapeada no seu usuarios_router.js
      return await http.post(`/usuarios/admin/alterar`, {
        idUsuario,
        idLoja,
        acao: "ALTERAR_STATUS",
        novoStatus,
      });
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      throw error;
    }
  }
}

export default TrackerService;
