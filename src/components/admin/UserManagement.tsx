import {
  Box,
  Flex,
  Heading,
  useBreakpointValue,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  VStack,
} from "@chakra-ui/react";
import {
  SearchIcon,
  ChevronDownIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../lib/hooks/useAppToast";
import {
  getAllUsers,
  lockUser,
  unlockUser,
} from "../../lib/services/userService";
import type { UserResponse } from "../../types/user";
import { type ColumnDefinition } from "./AdminTable";
import UserCardList from "./UserCardList";
import UserTable from "./UserTable";

type AdminViewMode = "card" | "table";

const UserManagement = () => {
  const { t } = useTranslation("admin");
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { showSuccess, showError } = useAppToast();
  const [viewMode, setViewMode] = useState<AdminViewMode>(() => {
    return (
      (localStorage.getItem("adminUserViewMode") as AdminViewMode) || "table"
    );
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const effectiveViewMode = isMobile ? "card" : viewMode;

  const toggleViewMode = () => {
    const newViewMode = viewMode === "table" ? "card" : "table";
    setViewMode(newViewMode);
    localStorage.setItem("adminUserViewMode", newViewMode);
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.users);
    } catch (error) {
      showError(t("users.toasts.fetch_error"));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleLock = async (userIdToLock: string) => {
    try {
      await lockUser(userIdToLock);
      showSuccess(t("users.toasts.lock_success"));
      fetchUsers();
    } catch (error) {
      showError(t("users.toasts.lock_error"));
    }
  };

  const handleUnlock = async (userIdToUnlock: string) => {
    try {
      await unlockUser(userIdToUnlock);
      showSuccess(t("users.toasts.unlock_success"));
      fetchUsers();
    } catch (error) {
      showError(t("users.toasts.unlock_error"));
    }
  };

  const filteredUsers = useMemo(() => {
    if (!debouncedSearchTerm) return users;
    return users.filter(
      (user) =>
        user.userName
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    );
  }, [users, debouncedSearchTerm]);

  const userColumns: ColumnDefinition<UserResponse>[] = [
    { header: t("users.name"), accessor: "userName" },
    { header: t("users.email"), accessor: "email" },
    { header: t("users.role"), accessor: "role" },
    {
      header: t("users.status"),
      accessor: (user) => (
        <Badge colorScheme={user.isLocked ? "red" : "green"}>
          {user.isLocked ? "Locked" : "Active"}
        </Badge>
      ),
    },
  ];

  return (
    <Box>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        flexWrap="wrap"
        gap={2}
      >
        <Heading size={{ base: "md", md: "lg" }}>{t("users.title")}</Heading>
        <VStack gap={2} alignItems="stretch">
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {t("tags.actions")}
            </MenuButton>
            <MenuList>
              {!isMobile && (
                <MenuItem
                  icon={viewMode === "table" ? <ViewIcon /> : <ViewOffIcon />}
                  onClick={toggleViewMode}
                >
                  {viewMode === "table"
                    ? t("tags.switchToCard")
                    : t("tags.switchToTable")}
                </MenuItem>
              )}
            </MenuList>
          </Menu>
          <InputGroup maxW={{ base: "100%", md: "300px" }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder={t("users.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </VStack>
      </Flex>
      {effectiveViewMode === "table" ? (
        <UserTable
          data={filteredUsers}
          columns={userColumns}
          onBlockUser={handleLock}
          onUnblockUser={handleUnlock}
        />
      ) : (
        <UserCardList
          users={filteredUsers}
          selectedItems={selectedUsers}
          onSelectItem={handleSelectUser}
          onBlockUser={handleLock}
          onUnblockUser={handleUnlock}
        />
      )}
    </Box>
  );
};

export default UserManagement;
