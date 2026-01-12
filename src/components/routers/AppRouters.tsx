import { Route, Routes } from "react-router-dom";
import { ROUTES } from "../../lib/routes";
import MainPage from "../../pages/MainPage";
import InventoryCatalogPage from "../../pages/InventoryCatalogPage";

const AppRouters = () => {
  return (
    <Routes>
      <Route path={ROUTES.main} element={<MainPage />} />
      <Route path={ROUTES.inventories} element={<InventoryCatalogPage />} />
      <Route path="*" element={<>404</>} />
    </Routes>
  );
};

export default AppRouters;
