import api from './api';

class TIService {
  
  async importarPendenciasVendas() {
    const response = await api.post(`/ti/importar-pendencias`);
    return response;
  }

}

export default new TIService();