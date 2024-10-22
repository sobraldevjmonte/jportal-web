import React, { createContext, useState } from "react";

export const UsuarioContext = createContext();

export const UserProvider = ({ children }) => {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [nivelUsuario, setNivelUsuario] = useState("");
  const [codigoUsuario, setCodigoUsuario] = useState("");
  const [idUsuario, setIdUsuario] = useState(0);
  const [loja, setLoja] = useState(0);
  const [idNivelUsuario, setIdNivelUsuario] = useState(999);
  const [subNivel1, setSubNivel1] = useState(999);
  const [idLoja, setIdLoja] = useState(9999)
  const [icomp, setIcomp] = useState('9999')

  const [logado, setLogado] = useState(false);

  return (
    <UsuarioContext.Provider
      value={{
        nomeUsuario,
        setNomeUsuario,
        nivelUsuario,
        setNivelUsuario,
        subNivel1,
        setSubNivel1,
        logado,
        setLogado,
        codigoUsuario,
        setCodigoUsuario,
        loja,
        setLoja,
        idUsuario,
        setIdUsuario,
        idNivelUsuario,
        setIdNivelUsuario,
        idLoja,
        setIdLoja,
        icomp,
        setIcomp
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
};
