import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Center,
  Heading,
  MenuDivider,
} from "@chakra-ui/react";
import { ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  addInventoryUser,
  getInventoryUsers,
  removeInventoryUser,
  updateInventoryUserRole,
} from "../../lib/services/inventoryRoleService";
import { searchUsers } from "../../lib/services/userService";
import type {
  InventoryUserRole,
  UserResponse,
} from "../../types/inventoryRole";
import type { UserSearchResponse } from "../../types/user";
import { useAppToast } from "../../lib/hooks/useAppToast";
import { useAuth } from "../../lib/contexts/AuthContext";

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

interface ManageInventoryUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryId: string;
}

const ManageInventoryUsersModal = ({
  isOpen,
  onClose,
  inventoryId,
}: ManageInventoryUsersModalProps) => {
  const { t } = useTranslation(["inventoryPage", "common"]);
  const { user: currentUser } = useAuth();
  const { showSuccess, showError } = useAppToast();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [foundUsers, setFoundUsers] = useState<UserSearchResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getInventoryUsers(inventoryId);
      setUsers(response.users);
    } catch (error) {
      showError(t("manageUsersModal.errors.fetchError"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    } else {
      setSearchTerm("");
      setFoundUsers([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const search = async () => {
      if (debouncedSearchTerm.trim()) {
        setIsSearching(true);
        setFoundUsers([]);
        try {
          const result = await searchUsers(debouncedSearchTerm);
          console.log(result);
          setFoundUsers(result.users);
        } catch (error) {
          showError(t("manageUsersModal.errors.searchError"));
          setFoundUsers([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setFoundUsers([]);
      }
    };
    search();
  }, [debouncedSearchTerm, showError, t]);

  const handleAddUser = async (userToAdd: UserSearchResponse) => {
    try {
      await addInventoryUser({
        inventoryId,
        userId: userToAdd.id,
        role: "Editor",
      });
      showSuccess(t("manageUsersModal.addSuccess"));
      setSearchTerm("");
      setFoundUsers([]);
      fetchUsers();
    } catch (error) {
      showError(t("manageUsersModal.errors.addError"));
    }
  };

  const handleUpdateRole = async (userId: string, role: InventoryUserRole) => {
    try {
      await updateInventoryUserRole(inventoryId, userId, { role });
      showSuccess(t("manageUsersModal.updateSuccess"));
      fetchUsers();
    } catch (error) {
      showError(t("manageUsersModal.errors.updateError"));
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      await removeInventoryUser(inventoryId, userId);
      showSuccess(t("manageUsersModal.removeSuccess"));
      fetchUsers();
    } catch (error) {
      showError(t("manageUsersModal.errors.removeError"));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("manageUsersModal.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch" pb={4}>
            <FormControl>
              <FormLabel htmlFor="user-search">
                {t("manageUsersModal.addUserLabel")}
              </FormLabel>
              <Input
                id="user-search"
                type="text"
                placeholder={t("manageUsersModal.emailPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </FormControl>

            {isSearching && (
              <Center p={2}>
                <Spinner size="sm" />
              </Center>
            )}

            {foundUsers.length > 0 && (
              <VStack
                spacing={2}
                align="stretch"
                mt={2}
                p={2}
                borderWidth={1}
                borderRadius="md"
                maxH="200px"
                overflowY="auto"
              >
                {foundUsers.map((user) => (
                  <HStack
                    key={user.id}
                    justifyContent="space-between"
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: "whiteAlpha.100" }}
                  >
                    <VStack align="start" spacing={0}>
                      <Text>{user.userName}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {user.email}
                      </Text>
                    </VStack>
                    <Button
                      size="sm"
                      onClick={() => handleAddUser(user)}
                      isDisabled={users.some((u) => u.userId === user.id)}
                    >
                      {users.some((u) => u.userId === user.id)
                        ? t("manageUsersModal.alreadyAdded")
                        : t("manageUsersModal.addButton")}
                    </Button>
                  </HStack>
                ))}
              </VStack>
            )}

            <VStack spacing={2} align="stretch">
              <Heading size="sm" mt={4}>
                {t("manageUsersModal.currentUsers")}
              </Heading>
              {isLoading ? (
                <Center p={4}>
                  <Spinner />
                </Center>
              ) : (
                <VStack spacing={2} align="stretch">
                  {users.map((user) => (
                    <HStack
                      key={user.userId}
                      justifyContent="space-between"
                      p={2}
                      borderRadius="md"
                      _hover={{ bg: "whiteAlpha.100" }}
                    >
                      <Text fontWeight="bold">{user.userName}</Text>
                      <HStack>
                        <Text color="text-secondary">{user.role}</Text>
                        {user.userId !== currentUser?.id && (
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<ChevronDownIcon />}
                              variant="ghost"
                            />
                            <MenuList>
                              <MenuItem
                                isDisabled={user.role === "Editor"}
                                onClick={() =>
                                  handleUpdateRole(user.userId, "Editor")
                                }
                              >
                                {t("manageUsersModal.setEditor")}
                              </MenuItem>
                              <MenuItem
                                isDisabled={user.role === "Owner"}
                                onClick={() =>
                                  handleUpdateRole(user.userId, "Owner")
                                }
                              >
                                {t("manageUsersModal.setOwner")}
                              </MenuItem>
                              <MenuDivider />
                              <MenuItem
                                icon={<DeleteIcon />}
                                color="red.500"
                                onClick={() => handleRemoveUser(user.userId)}
                              >
                                {t("manageUsersModal.removeUser")}
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        )}
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              )}
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ManageInventoryUsersModal;
