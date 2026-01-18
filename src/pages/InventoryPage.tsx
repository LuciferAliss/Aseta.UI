import {
  Box,
  Image,
  Text,
  Spinner,
  Center,
  VStack,
  Heading,
  HStack,
  Tag,
  Divider,
  Grid,
  GridItem,
  Container,
  useBreakpointValue,
  useDisclosure,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import {
  ViewIcon,
  ViewOffIcon,
  DeleteIcon,
  ChevronDownIcon,
  AddIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import { FaUsers } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getInventoryById } from "../lib/services/inventoryService";
import type { InventoryResponse } from "../types/inventory";
import { useTranslation } from "react-i18next";
import { useAsyncList } from "react-stately";
import { useInView } from "react-intersection-observer";
import ItemCardList from "../components/inventoryPage/ItemCardList";
import ItemCreateModal from "../components/inventoryPage/ItemCreateModal";
import ItemUpdateModal from "../components/inventoryPage/ItemUpdateModal";
import DeleteConfirmationModal from "../components/layout/DeleteConfirmationModal";
import { ROUTES } from "../lib/routes";
import { useAppToast } from "../lib/hooks/useAppToast";
import { getItems, bulkDeleteItems } from "../lib/services/itemService";
import { getComments, deleteComment } from "../lib/services/commentService";
import ItemTable from "../components/inventoryPage/ItemTable";
import type { Item } from "../types/item";
import type { Comment } from "../types/comment";
import CustomFieldCreateModal from "../components/inventoryPage/CustomFieldCreateModal";
import ManageCustomFieldsModal from "../components/inventoryPage/ManageCustomFieldsModal";
import CustomFieldEditModal from "../components/inventoryPage/CustomFieldEditModal";
import { deleteCustomField } from "../lib/services/customFieldService";
import type { CustomFieldData } from "../types/customField";
import { useAuth } from "../lib/contexts/AuthContext";
import ManageInventoryUsersModal from "../components/inventoryPage/ManageInventoryUsersModal";
import CommentsSection from "../components/comments/CommentsSection";

type ItemViewMode = "card" | "table";

const InventoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("inventoryPage");
  const { showError, showSuccess } = useAppToast();
  const { user, isLoading: isLoadingAuth } = useAuth();

  const [inventory, setInventory] = useState<InventoryResponse | null>(null);
  const [isLoadingInventory, setLoadingInventory] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // --- Items state and handlers ---
  const [hasNextPage, setHasNextPage] = useState(true);
  const { ref: itemsRef, inView: itemsInView } = useInView({
    rootMargin: "300px",
  });

  // --- Comments state and handlers ---
  const [hasNextPageComments, setHasNextPageComments] = useState(true);
  const { ref: commentsRef, inView: commentsInView } = useInView({
    rootMargin: "300px",
  });

  const isAdmin = !isLoadingAuth && user?.role === "Admin";
  const isOwner = !isLoadingInventory && inventory?.userRole === "Owner";
  const canManageInventory = isAdmin || isOwner;
  const isEditor = !isLoadingInventory && inventory?.userRole === "Editor";
  const canEditItems = canManageInventory || isEditor;

  const {
    isOpen: isUpdateModalOpen,
    onOpen: onUpdateModalOpen,
    onClose: onUpdateModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteConfirmOpen,
    onOpen: onDeleteConfirmOpen,
    onClose: onDeleteConfirmClose,
  } = useDisclosure();
  const {
    isOpen: isManageFieldsOpen,
    onOpen: onManageFieldsOpen,
    onClose: onManageFieldsClose,
  } = useDisclosure();
  const {
    isOpen: isEditCustomFieldOpen,
    onOpen: onEditCustomFieldOpen,
    onClose: onEditCustomFieldClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteCustomFieldConfirmOpen,
    onOpen: onDeleteCustomFieldConfirmOpen,
    onClose: onDeleteCustomFieldConfirmClose,
  } = useDisclosure();
  const {
    isOpen: isManageUsersOpen,
    onOpen: onManageUsersOpen,
    onClose: onManageUsersClose,
  } = useDisclosure();
  const {
    isOpen: isItemCreateModalOpen,
    onOpen: onItemCreateModalOpen,
    onClose: onItemCreateModalClose,
  } = useDisclosure();
  const {
    isOpen: isCustomFieldCreateOpen,
    onOpen: onCustomFieldCreateOpen,
    onClose: onCustomFieldCreateClose,
  } = useDisclosure();

  const [selectedItemForEdit, setSelectedItemForEdit] = useState<Item | null>(
    null,
  );
  const [selectedCustomField, setSelectedCustomField] =
    useState<CustomFieldData | null>(null);
  const [customFieldToDelete, setCustomFieldToDelete] =
    useState<CustomFieldData | null>(null);

  const [activeTab, setActiveTab] = useState<"items" | "comments">("items");

  const isDesktop = useBreakpointValue({ base: false, xl: true });

  useEffect(() => {
    if (!isDesktop) {
      setSelectedItems([]);
    }
  }, [isDesktop]);

  const [itemViewMode, setItemViewMode] = useState<ItemViewMode>(() => {
    return (localStorage.getItem("itemViewMode") as ItemViewMode) || "card";
  });

  const toggleItemViewMode = () => {
    setSelectedItems([]);
    const newViewMode = itemViewMode === "card" ? "table" : "card";
    setItemViewMode(newViewMode);
    localStorage.setItem("itemViewMode", newViewMode);
  };

  const effectiveItemViewMode = isDesktop ? itemViewMode : "card";

  const loadInventory = useCallback(async () => {
    try {
      const response = await getInventoryById(id || "");
      setInventory(response);
    } catch (error) {
      showError(t("errors.not_found.title"), t("errors.not_found.description"));
      navigate(ROUTES.inventories);
    } finally {
      setLoadingInventory(false);
    }
  }, [id, showError, t, navigate]);

  useEffect(() => {
    if (!isLoadingAuth) {
      loadInventory();
    }
  }, [loadInventory, isLoadingAuth]);

  const loadItems = useCallback(
    async ({ cursor }: { cursor?: string }) => {
      if (isLoadingInventory || !id) {
        return { items: [], cursor: undefined };
      }
      const request = { inventoryId: id, pageSize: 10, cursor };
      const response = await getItems(request);
      setHasNextPage(response.items.hasNextPage);
      return {
        items: response.items.items,
        cursor: response.items.cursor ?? undefined,
      };
    },
    [isLoadingInventory, id],
  );

  const itemsList = useAsyncList({ load: loadItems });

  useEffect(() => {
    if (itemsInView && !itemsList.isLoading && hasNextPage) {
      itemsList.loadMore();
    }
  }, [itemsInView, itemsList, hasNextPage]);

  const loadComments = useCallback(
    async ({ cursor }: { cursor?: string }) => {
      if (isLoadingInventory || !id) {
        return { items: [], cursor: undefined };
      }
      const request = { inventoryId: id, pageSize: 10, cursor };
      const response = await getComments(request);
      setHasNextPageComments(response.comments.hasNextPage);
      return {
        items: response.comments.items,
        cursor: response.comments.cursor ?? undefined,
      };
    },
    [isLoadingInventory, id],
  );

  const commentsList = useAsyncList<Comment>({ load: loadComments });

  useEffect(() => {
    if (commentsInView && !commentsList.isLoading && hasNextPageComments) {
      commentsList.loadMore();
    }
  }, [commentsInView, commentsList, hasNextPageComments]);

  useEffect(() => {
    if (!isLoadingInventory) {
      itemsList.reload();
      commentsList.reload();
    }
  }, [isLoadingInventory]);

  const handleEditItem = (item: Item) => {
    setSelectedItemForEdit(item);
    onUpdateModalOpen();
  };

  const handleDeleteSingleItem = (itemId: string) => {
    setSelectedItems([itemId]);
    onDeleteConfirmOpen();
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleSelectAll = (areAllSelected: boolean) => {
    if (areAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(itemsList.items.map((item) => item.id));
    }
  };

  const handleDeleteRequest = () => {
    if (selectedItems.length > 0) {
      onDeleteConfirmOpen();
    }
  };

  const handleConfirmDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await bulkDeleteItems(id, { itemIds: selectedItems });
      showSuccess(t("deleteItems.success"));
      setSelectedItems([]);
      itemsList.reload();
    } catch (error) {
      showError(t("deleteItems.error"));
    } finally {
      setIsDeleting(false);
      onDeleteConfirmClose();
    }
  };

  const handleEditCustomField = (field: CustomFieldData) => {
    setSelectedCustomField(field);
    onEditCustomFieldOpen();
  };

  const handleDeleteCustomField = (field: CustomFieldData) => {
    setCustomFieldToDelete(field);
    onDeleteCustomFieldConfirmOpen();
  };

  const handleConfirmDeleteCustomField = async () => {
    if (!id || !customFieldToDelete) return;
    try {
      await deleteCustomField(id, customFieldToDelete.id);
      showSuccess(t("manageCustomFieldsModal.deleteSuccess"));
      loadInventory();
    } catch (error) {
      showError(t("manageCustomFieldsModal.deleteError"));
    } finally {
      onDeleteCustomFieldConfirmClose();
      setCustomFieldToDelete(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      showSuccess(t("comments.deleteSuccess"));
      commentsList.reload();
    } catch (error) {
      showError(t("comments.deleteError"));
    }
  };

  if (isLoadingInventory || isLoadingAuth) {
    return (
      <Center minH="calc(100vh - 80px)">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!inventory) {
    return (
      <Center minH="calc(100vh - 80px)">
        <Text>{t("inventoryNotFound")}</Text>
      </Center>
    );
  }

  return (
    <Box mx="auto" p={{ base: 4, md: 8 }} w="full">
      <Grid
        templateColumns={{ base: "1fr", md: "250px 1fr" }}
        gap={{ base: 6, md: 10 }}
      >
        <GridItem>
          <Container variant="card" p={0} overflow="hidden">
            <Image
              src={inventory.imageUrl}
              alt={inventory.name}
              w="full"
              h="auto"
              objectFit="cover"
            />
          </Container>
        </GridItem>
        <GridItem>
          <VStack spacing={4} align="start">
            <Heading>{inventory.name}</Heading>
            <Text fontSize="lg" color="text-secondary">
              {inventory.description}
            </Text>
            <Divider />
            <VStack align="start" spacing={2}>
              <Text>
                <strong>{t("creator", { ns: "inventoryPage" })}:</strong>{" "}
                {inventory.creator}
              </Text>
              <Text>
                <strong>{t("category", { ns: "inventoryPage" })}:</strong>{" "}
                {inventory.category.name}
              </Text>
              <Text>
                <strong>{t("createdAt", { ns: "inventoryPage" })}:</strong>{" "}
                {new Date(inventory.createdAt).toLocaleString()}
              </Text>
            </VStack>
            <HStack spacing={2} wrap="wrap">
              <Text>
                <strong>{t("tags", { ns: "inventoryPage" })}:</strong>
              </Text>
              {inventory.tags.map((tag) => (
                <Tag key={tag.id} size="md" variant="solid" m={1}>
                  {tag.name}
                </Tag>
              ))}
            </HStack>
          </VStack>
        </GridItem>
      </Grid>

      <HStack spacing={4} mt={10}>
        <Button
          onClick={() => setActiveTab("items")}
          colorScheme={activeTab === "items" ? "blue" : "gray"}
        >
          {t("items")}
        </Button>
        <Button
          onClick={() => setActiveTab("comments")}
          colorScheme={activeTab === "comments" ? "blue" : "gray"}
        >
          {t("comments.sectionTitle")}
        </Button>
      </HStack>

      {activeTab === "items" && (
        <VStack as="main" flex="1" spacing={4} align="stretch" w="full" mt={10}>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={4}
          >
            <Heading size="lg">{t("items")}</Heading>
            {(canEditItems || canManageInventory || isDesktop) && (
              <Flex
                gap={2}
                flexWrap="wrap"
                justifyContent={{ base: "flex-start", md: "flex-end" }}
              >
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    {t("actions")}
                  </MenuButton>
                  <MenuList>
                    {canEditItems && selectedItems.length > 0 && (
                      <>
                        <MenuItem
                          icon={<DeleteIcon />}
                          onClick={handleDeleteRequest}
                          color="red.500"
                        >
                          {t("deleteItems.button", {
                            count: selectedItems.length,
                          })}
                        </MenuItem>
                        <MenuDivider />
                      </>
                    )}
                    {canEditItems && (
                      <MenuItem
                        icon={<AddIcon />}
                        onClick={onItemCreateModalOpen}
                      >
                        {t("createItemModal.createButton")}
                      </MenuItem>
                    )}
                    {canManageInventory && (
                      <>
                        <MenuItem
                          icon={<AddIcon />}
                          onClick={onCustomFieldCreateOpen}
                        >
                          {t("customFieldCreateModal.createButton")}
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem
                          icon={<SettingsIcon />}
                          onClick={onManageFieldsOpen}
                        >
                          {t("manageCustomFieldsModal.manageMenuItem")}
                        </MenuItem>
                        <MenuItem
                          icon={<FaUsers />}
                          onClick={onManageUsersOpen}
                        >
                          {t("manageUsersModal.manageMenuItem")}
                        </MenuItem>
                      </>
                    )}
                    {isDesktop && (
                      <>
                        <MenuDivider />
                        <MenuItem
                          icon={
                            itemViewMode === "card" ? (
                              <ViewOffIcon />
                            ) : (
                              <ViewIcon />
                            )
                          }
                          onClick={toggleItemViewMode}
                        >
                          {t(
                            itemViewMode === "card"
                              ? "switchToTableView"
                              : "switchToCardView",
                          )}
                        </MenuItem>
                      </>
                    )}
                  </MenuList>
                </Menu>
              </Flex>
            )}
          </Flex>
          {effectiveItemViewMode === "card" ? (
            <ItemCardList
              items={itemsList.items}
              customFieldsDefinition={inventory.customFieldsDefinition}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteSingleItem}
              canEditItems={canEditItems}
            />
          ) : (
            <ItemTable
              items={itemsList.items}
              customFieldsDefinition={inventory.customFieldsDefinition}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteSingleItem}
              selectedItems={selectedItems}
              onSelectItem={handleSelectItem}
              onSelectAll={handleSelectAll}
              canEditItems={canEditItems}
            />
          )}

          {!isLoadingInventory && (
            <Center ref={itemsRef} h="100px">
              {itemsList.isLoading && hasNextPage && <Spinner size="xl" />}
              {!itemsList.isLoading && !hasNextPage && (
                <Text>{t("noMoreItems")}</Text>
              )}
            </Center>
          )}
        </VStack>
      )}

      {activeTab === "comments" && (
        <VStack as="section" spacing={6} align="stretch" w="full" mt={10}>
          <CommentsSection
            inventoryId={id || ""}
            comments={commentsList.items}
            onCommentAdded={commentsList.reload}
            onDeleteComment={handleDeleteComment}
          />
          <Box ref={commentsRef} h="1px" mt={4}>
            {commentsList.isLoading && (
              <Center>
                <Spinner />
              </Center>
            )}
          </Box>
        </VStack>
      )}

      <ItemUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={onUpdateModalClose}
        inventoryId={id || ""}
        item={selectedItemForEdit}
        customFieldsDefinition={inventory.customFieldsDefinition}
        onItemUpdated={() => {
          onUpdateModalClose();
          itemsList.reload();
        }}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={onDeleteConfirmClose}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={t("deleteItems.title")}
        bodyText={t("deleteItems.body", { count: selectedItems.length })}
      />
      <ManageCustomFieldsModal
        isOpen={isManageFieldsOpen}
        onClose={onManageFieldsClose}
        customFields={inventory.customFieldsDefinition}
        onEdit={handleEditCustomField}
        onDelete={handleDeleteCustomField}
        canManageInventory={canManageInventory}
      />
      <CustomFieldEditModal
        isOpen={isEditCustomFieldOpen}
        onClose={onEditCustomFieldClose}
        onCustomFieldUpdated={loadInventory}
        customField={selectedCustomField}
        inventoryId={id || ""}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteCustomFieldConfirmOpen}
        onClose={onDeleteCustomFieldConfirmClose}
        onConfirm={handleConfirmDeleteCustomField}
        isLoading={false}
        title={t("manageCustomFieldsModal.deleteAriaLabel")}
        bodyText={t("deleteItems.body", { count: 1 })}
      />
      <ManageInventoryUsersModal
        isOpen={isManageUsersOpen}
        onClose={onManageUsersClose}
        inventoryId={id || ""}
      />
      <ItemCreateModal
        isOpen={isItemCreateModalOpen}
        onClose={onItemCreateModalClose}
        inventoryId={id || ""}
        customFieldsDefinition={inventory.customFieldsDefinition}
        onItemCreated={itemsList.reload}
      />
      <CustomFieldCreateModal
        onClose={onCustomFieldCreateClose}
        isOpen={isCustomFieldCreateOpen}
        inventoryId={id || ""}
        onCustomFieldCreated={loadInventory}
      />
    </Box>
  );
};

export default InventoryPage;
