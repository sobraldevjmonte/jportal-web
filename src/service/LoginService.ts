import AuditoriaService from "./AuditoriaService";


import api from './api'; 
class LoginService {
  async login(usuario: string, senha: string) {
    console.log("*********** login do usuario(Service) *****************");
    let rs;
    let user = {
      usuario,
      senha
    }
    try {
      const response = await api.post(`/usuarios/login`, user, {
        headers: { "Content-Type": "application/json" },
      });

      await AuditoriaService.registrar(
        "/login",
        "Login Sucesso",
        `Usuário: ${response.data.nomeusuario}`,
        response.data.codigousuario // Passa o código que acabou de chegar
      );

      rs = {
        statusCode: 200,
        data: response.data
      };
      return rs;
    } catch (error) {
      
      await AuditoriaService.registrar(
        "/login",
        "Login Falha",
        `Usuário: ${usuario}`,
        '9999999'// Passa o código que acabou de chegar
      );

      rs = {
        data: null,
        status: 401,
        msg: "Erro na requisição",
      };
    }
    return rs;
  }

  async atualizarSenhaOld(idusuario: number, idLoja: number, novaSenha: string) {
    await AuditoriaService.registrar(
      "/usuarios",
      "metodo atualizar-senha",
      ``
    );
    try {
      return await api.put(`/usuarios/atualizar-senha`, { idusuario, idLoja, novaSenha });
    } catch (error) {
      return null;
    }
  }

  async atualizarSenha(idusuario: number, idLoja: number, novaSenha: string) {
    await AuditoriaService.registrar(
      "/usuarios",
      "metodo atualizar-senha",
      `ID Usuario: ${idusuario}`
    );
    
    // Deixamos a requisição sem o try/catch local para que o Axios passe o erro 400 adiante
    const response = await api.put(`/usuarios/atualizar-senha`, { idusuario, idLoja, novaSenha });
    return response;
  }

  async listarUsuarios() {
    try {
      const response = await api.get(`/usuarios/admin/listar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return [];
    }
  }

  async adminAlterarUsuario(dados: { idUsuario: number, idLoja: number, acao: 'RESET_SENHA' | 'ALTERAR_STATUS', novoStatus?: string, novaSenha?: string }) {
    try {
      const response = await api.post(`/usuarios/admin/alterar`, dados);

      await AuditoriaService.registrar(
        "/admin/usuarios",
        `Ação: ${dados.acao}`,
        `ID: ${dados.idUsuario}`,
        ""
      );

      return response.data;
    } catch (error) {
      console.error("Erro na ação administrativa:", error);
      return null;
    }
  }
}


export default LoginService;