import MenuComponent from "./MenuComponent";
import TrackerComponent from "./TrackerComponent";

export default function PrivateLayout() {
  return (
    <>
      {/* Roda silencioso em todas as rotas privadas */}
      <TrackerComponent />
      
      {/* O MenuComponent já contém o <Outlet /> internamente */}
      <MenuComponent />
    </>
  );
}