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
  IconButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon, DeleteIcon } from "@chakra-ui/icons";
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
import ItemTable from "../components/inventoryPage/ItemTable";
import type { Item } from "../types/item";

type ItemViewMode = "card" | "table";

const InventoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("inventoryPage");
  const { showError, showSuccess } = useAppToast();

  const [inventory, setInventory] = useState<InventoryResponse | null>(null);
  const [isLoadingInventory, setLoadingInventory] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const { ref, inView } = useInView({
    rootMargin: "300px",
  });

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

  const [selectedItemForEdit, setSelectedItemForEdit] = useState<Item | null>(
    null
  );

  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const [itemViewMode, setItemViewMode] = useState<ItemViewMode>(() => {
    return (localStorage.getItem("itemViewMode") as ItemViewMode) || "card";
  });

  const toggleItemViewMode = () => {
    const newViewMode = itemViewMode === "card" ? "table" : "card";
    setItemViewMode(newViewMode);
    localStorage.setItem("itemViewMode", newViewMode);
  };

  const effectiveItemViewMode = isDesktop ? itemViewMode : "card";

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const response = await getInventoryById(id || "");
        setInventory(response);
      } catch (error) {
        showError(
          t("errors.not_found.title"),
          t("errors.not_found.description")
        );
        navigate(ROUTES.inventories);
      } finally {
        setLoadingInventory(false);
      }
    };

    loadInventory();
  }, [id, showError, t, navigate]);

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
    [isLoadingInventory, id]
  );

  const list = useAsyncList({ load: loadItems });

  useEffect(() => {
    if (!isLoadingInventory) {
      list.reload();
    }
  }, [isLoadingInventory]);

  useEffect(() => {
    if (inView && !list.isLoading && hasNextPage) {
      list.loadMore();
    }
  }, [inView, list, hasNextPage]);

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
        : [...prev, itemId]
    );
  };

  const handleSelectAll = (areAllSelected: boolean) => {
    if (areAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(list.items.map((item) => item.id));
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
      list.reload();
    } catch (error) {
      showError(t("deleteItems.error"));
    } finally {
      setIsDeleting(false);
      onDeleteConfirmClose();
    }
  };

  if (isLoadingInventory) {
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

  const toggleItemViewModeButton = (
    <IconButton
      aria-label="Toggle item view"
      icon={itemViewMode === "card" ? <ViewOffIcon /> : <ViewIcon />}
      onClick={toggleItemViewMode}
    />
  );

  return (
    <Box mx="auto" p={{ base: 4, md: 8 }}>
      <Grid
        templateColumns={{ base: "1fr", md: "250px 1fr" }}
        gap={{ base: 6, md: 10 }}
      >
        <GridItem>
          <Container variant="card" p={0} overflow="hidden">
            <Image
              src={inventory.imageUrl}
              alt={inventory.name}
              w="100%"
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

      <VStack as="main" flex="1" spacing={4} align="stretch" w="100%" mt={10}>
        <HStack justifyContent="space-between">
          <Heading size="lg">{t("items")}</Heading>
          <HStack>
            {selectedItems.length > 0 && (
              <Button
                leftIcon={<DeleteIcon />}
                colorScheme="red"
                onClick={handleDeleteRequest}
              >
                {t("deleteItems.button", { count: selectedItems.length })}
              </Button>
            )}
            <ItemCreateModal
              inventoryId={id || ""}
              customFieldsDefinition={inventory.customFieldsDefinition}
              onItemCreated={list.reload}
            />
            {isDesktop && toggleItemViewModeButton}
          </HStack>
        </HStack>
        {list.isLoading && list.items.length === 0 ? (
          <Center h="200px">
            <Spinner size="xl" />
          </Center>
        ) : effectiveItemViewMode === "card" ? (
          <ItemCardList
            items={list.items}
            customFieldsDefinition={inventory.customFieldsDefinition}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteSingleItem}
          />
        ) : (
          <ItemTable
            items={list.items}
            customFieldsDefinition={inventory.customFieldsDefinition}
            onEditItem={handleEditItem}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
          />
        )}

        {!isLoadingInventory && (
          <Center ref={ref} h="100px">
            {list.isLoading && hasNextPage && <Spinner size="xl" />}
            {!list.isLoading && !hasNextPage && list.items.length > 0 && (
              <Text>{t("noMoreItems")}</Text>
            )}
          </Center>
        )}
      </VStack>

      <ItemUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={onUpdateModalClose}
        inventoryId={id || ""}
        item={selectedItemForEdit}
        customFieldsDefinition={inventory.customFieldsDefinition}
        onItemUpdated={() => {
          onUpdateModalClose();
          list.reload();
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
    </Box>
  );
};

export default InventoryPage;
