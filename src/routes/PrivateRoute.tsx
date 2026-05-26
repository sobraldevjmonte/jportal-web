import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UsuarioContext } from "../context/useContext";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { logado } = useContext(UsuarioContext);

  if (!logado) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}