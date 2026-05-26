import api from './api'; 

class ConfigService {
  async buscarConfigs() {
    console.log("*********** buscarConfigs(ConfigService) *****************");

    try {
      // REMOVIDO o responseType: "blob", pois aqui você quer receber DADOS (JSON), não um arquivo PDF.
      const response = await api.get(`/configuracoes/buscar`);
      return response;
    } catch (error) {
      console.error("Erro na busca de configurações", error);
      throw error;
    }
  }

  async atualizarConfigs(dados: any) {
    console.log("*********** atualizarConfigs(ConfigService) *****************");

    try {
      // Corrigido o erro no final da URL ($) e enviado o corpo 'dados'
      const response = await api.put(`/configuracoes/atualizar`, dados);
      return response;
    } catch (error) {
      console.error("Erro na atualização de configurações", error);
      throw error;
    }
  }
}

export default ConfigService;