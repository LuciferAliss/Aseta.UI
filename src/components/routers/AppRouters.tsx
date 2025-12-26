import { Route, Routes } from "react-router-dom";
import { ROUTES } from "../../lib/routes";
import PrivateRoute from "./PrivateRoute";
import { Flex, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import AuthModal from "../auth/AuthModal";
import LanguageChangeButton from "../layout/LanguageChangeButton";
import ThemeChangeButton from "../layout/ThemeChangeButton";

const DashboardPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [initialView, setInitialView] = useState<"login" | "register">("login");

  const openLogin = () => {
    setInitialView("login");
    onOpen();
  };

  return (
    <div>
      <Flex gap="1">
        <LanguageChangeButton />
        <ThemeChangeButton />
      </Flex>
      <p />
      <button onClick={openLogin}>Open Login Modal</button>
      <p />

      <AuthModal isOpen={isOpen} onClose={onClose} initialView={initialView} />
    </div>
  );
};

const AppRouters = () => {
  return (
    <Routes>
      <Route
        path={ROUTES.dashboard}
        element={
          <PrivateRoute isAuth={true}>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      <Route path={ROUTES.login} element={<DashboardPage />} />
    </Routes>
  );
};

export default AppRouters;
