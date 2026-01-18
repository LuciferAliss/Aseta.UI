import {
  Box,
  Button,
  useDisclosure,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  DeleteIcon,
  ViewIcon,
  ViewOffIcon,
  AddIcon,
} from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../lib/hooks/useAppToast";
import {
  deleteCategories,
  GetAllCategory,
} from "../../lib/services/categoryService";
import type { CategoryResponse } from "../../types/category";
import CreateCategoryModal from "./CreateCategoryModal";
import AdminTable, { type ColumnDefinition } from "./AdminTable";
import EditCategoryModal from "./EditCategoryModal";
import AdminCardList from "./AdminCardList";

type AdminViewMode = "card" | "table";

const CategoryManagement = () => {
  const { t } = useTranslation("admin");
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onClose: onCreateModalClose,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] =
    useState<CategoryResponse | null>(null);
  const { showSuccess, showError } = useAppToast();
  const [viewMode, setViewMode] = useState<AdminViewMode>(() => {
    return (
      (localStorage.getItem("adminCategoryViewMode") as AdminViewMode) ||
      "table"
    );
  });

  const isMobile = useBreakpointValue({ base: true, md: false });
  const effectiveViewMode = isMobile ? "card" : viewMode;

  const toggleViewMode = () => {
    const newViewMode = viewMode === "table" ? "card" : "table";
    setViewMode(newViewMode);
    localStorage.setItem("adminCategoryViewMode", newViewMode);
  };

  const fetchCategories = async () => {
    try {
      const response = await GetAllCategory();
      setCategories(response.categories);
    } catch (error) {
      showError(t("categories.toasts.fetch_error"));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleSelectAllCategories = (areAllSelected: boolean) => {
    if (areAllSelected) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map((category) => category.id));
    }
  };

  const handleDelete = async (categoryIdToDelete?: string) => {
    const idsToDelete = categoryIdToDelete
      ? [categoryIdToDelete]
      : selectedCategories;
    try {
      await deleteCategories(idsToDelete);
      showSuccess(t("categories.toasts.delete_success"));
      setSelectedCategories([]);
      fetchCategories();
    } catch (error) {
      showError(t("categories.toasts.delete_error"));
    }
  };

  const handleCategoryCreated = () => {
    onCreateModalClose();
    fetchCategories();
  };

  const handleEditCategory = (category: CategoryResponse) => {
    setSelectedCategoryForEdit(category);
    onEditModalOpen();
  };

  const handleCategoryUpdated = () => {
    onEditModalClose();
    fetchCategories();
  };

  const categoryColumns: ColumnDefinition<CategoryResponse>[] = [
    { header: t("categories.name"), accessor: "name" },
  ];

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size={{ base: "md", md: "lg" }}>
          {t("categories.title")}
        </Heading>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {t("categories.actions")}
          </MenuButton>
          <MenuList>
            <MenuItem icon={<AddIcon />} onClick={onCreateModalOpen}>
              {t("categories.create")}
            </MenuItem>
            {!isMobile && (
              <MenuItem
                icon={viewMode === "table" ? <ViewIcon /> : <ViewOffIcon />}
                onClick={toggleViewMode}
              >
                {viewMode === "table"
                  ? t("categories.switchToCard")
                  : t("categories.switchToTable")}
              </MenuItem>
            )}
            <MenuItem
              icon={<DeleteIcon />}
              onClick={() => handleDelete()}
              isDisabled={selectedCategories.length === 0}
              color="red.500"
            >
              {t("categories.deleteSelected", {
                count: selectedCategories.length,
              })}
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      {effectiveViewMode === "table" ? (
        <AdminTable
          data={categories}
          columns={categoryColumns}
          selectedItems={selectedCategories}
          onSelectItem={handleSelectCategory}
          onSelectAll={handleSelectAllCategories}
          onEditItem={handleEditCategory}
          onDeleteItem={handleDelete}
          canEdit={true}
          canDelete={true}
        />
      ) : (
        <AdminCardList
          items={categories}
          selectedItems={selectedCategories}
          onSelectItem={handleSelectCategory}
          onEditItem={handleEditCategory}
          onDeleteItem={handleDelete}
          canEdit={true}
          canDelete={true}
        />
      )}
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
        onCategoryCreated={handleCategoryCreated}
      />
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        onCategoryUpdated={handleCategoryUpdated}
        category={selectedCategoryForEdit}
      />
    </Box>
  );
};

export default CategoryManagement;
