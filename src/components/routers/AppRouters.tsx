import { Route, Routes } from "react-router-dom";
import { ROUTES } from "../../lib/routes";
import MainPage from "../../pages/MainPage";

const AppRouters = () => {
  return (
    <Routes>
      <Route path={ROUTES.main} element={<MainPage />} />
    </Routes>
  );
};

export default AppRouters;
