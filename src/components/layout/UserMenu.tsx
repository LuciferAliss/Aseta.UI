import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../lib/contexts/AuthContext";
import { useAppToast } from "../../lib/hooks/useAppToast";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../lib/routes";

const UserMenu = () => {
  const { t } = useTranslation("common");
  const { user, logout, isLoading, isAuth } = useAuth();
  const { showSuccess, showError } = useAppToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess(t("header.user_menu.logout_success_title"));
    } catch (error) {
      showError(
        t("backend_error.server_error.title"),
        t("backend_error.server_error.description"),
      );
    }
  };

  return (
    <Menu>
      <MenuButton>
        <Avatar name={user?.name} size="sm" />
      </MenuButton>
      <MenuList>
        <MenuItem>
          <Text fontWeight="bold">{t("header.user_menu.profile")}</Text>
        </MenuItem>
        {isAuth && user?.role === "Admin" && (
          <MenuItem onClick={() => navigate(ROUTES.admin)}>
            {t("header.admin_panel")}
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout} isDisabled={isLoading}>
          {t("header.user_menu.logout")}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
