import { Route, Routes } from "react-router-dom";
import { ROUTES } from "../../lib/routes";
import MainPage from "../../pages/MainPage";
import InventoryCatalogPage from "../../pages/InventoryCatalogPage";
import InventoryPage from "../../pages/InventoryPage";
import AdminPanelPage from "../../pages/AdminPanelPage";
import PrivateRoute from "./PrivateRoute";

const AppRouters = () => {
  return (
    <Routes>
      <Route path={ROUTES.main} element={<MainPage />} />
      <Route path={ROUTES.inventories} element={<InventoryCatalogPage />} />
      <Route path={ROUTES.inventory} element={<InventoryPage />} />
      <Route
        path={ROUTES.admin}
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <AdminPanelPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<>404</>} />
    </Routes>
  );
};

export default AppRouters;
