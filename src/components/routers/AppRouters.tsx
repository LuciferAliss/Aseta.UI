import { Route, Routes } from "react-router-dom";
import { ROUTES } from "../../lib/routes";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../../pages/LoginPage";

const DashboardPage = () => <div>DashboardPage</div>;

const AppRouters = () => {
  return (
    <Routes>
      <Route
        path={ROUTES.dashboard}
        element={
          <PrivateRoute isAuth={false}>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      <Route path={ROUTES.login} element={<LoginPage />} />
    </Routes>
  );
};

export default AppRouters;
