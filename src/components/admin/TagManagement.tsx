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
import { deleteTags, getAllTags } from "../../lib/services/tagService";
import type { TagResponse } from "../../types/tag";
import CreateTagModal from "./CreateTagModal";
import EditTagModal from "./EditTagModal";
import AdminTable, { type ColumnDefinition } from "./AdminTable";
import AdminCardList from "./AdminCardList";

type AdminViewMode = "card" | "table";

const TagManagement = () => {
  const { t } = useTranslation("admin");
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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
  const [selectedTagForEdit, setSelectedTagForEdit] =
    useState<TagResponse | null>(null);
  const { showSuccess, showError } = useAppToast();
  const [viewMode, setViewMode] = useState<AdminViewMode>(() => {
    return (
      (localStorage.getItem("adminTagViewMode") as AdminViewMode) || "table"
    );
  });

  const isMobile = useBreakpointValue({ base: true, md: false });
  const effectiveViewMode = isMobile ? "card" : viewMode;

  const toggleViewMode = () => {
    const newViewMode = viewMode === "table" ? "card" : "table";
    setViewMode(newViewMode);
    localStorage.setItem("adminTagViewMode", newViewMode);
  };

  const fetchTags = async () => {
    try {
      const response = await getAllTags();
      setTags(response.tags);
    } catch (error) {
      showError(t("tags.toasts.fetch_error"));
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSelectTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleSelectAllTags = (areAllSelected: boolean) => {
    if (areAllSelected) {
      setSelectedTags([]);
    } else {
      setSelectedTags(tags.map((tag) => tag.id));
    }
  };

  const handleDelete = async (tagIdToDelete?: string) => {
    const idsToDelete = tagIdToDelete ? [tagIdToDelete] : selectedTags;
    try {
      await deleteTags(idsToDelete);
      showSuccess(t("tags.toasts.delete_success"));
      setSelectedTags([]);
      fetchTags();
    } catch (error) {
      showError(t("tags.toasts.delete_error"));
    }
  };

  const handleTagCreated = () => {
    onCreateModalClose();
    fetchTags();
  };

  const handleEditTag = (tag: TagResponse) => {
    setSelectedTagForEdit(tag);
    onEditModalOpen();
  };

  const handleTagUpdated = () => {
    onEditModalClose();
    fetchTags();
  };

  const tagColumns: ColumnDefinition<TagResponse>[] = [
    { header: t("tags.name"), accessor: "name" },
  ];

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="lg">{t("tags.title")}</Heading>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {t("tags.actions")}
          </MenuButton>
          <MenuList>
            <MenuItem icon={<AddIcon />} onClick={onCreateModalOpen}>
              {t("tags.create")}
            </MenuItem>
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
            <MenuItem
              icon={<DeleteIcon />}
              onClick={() => handleDelete()}
              isDisabled={selectedTags.length === 0}
              color="red.500"
            >
              {t("tags.deleteSelected", { count: selectedTags.length })}
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      {effectiveViewMode === "table" ? (
        <AdminTable
          data={tags}
          columns={tagColumns}
          selectedItems={selectedTags}
          onSelectItem={handleSelectTag}
          onSelectAll={handleSelectAllTags}
          onEditItem={handleEditTag}
          onDeleteItem={handleDelete}
          canEdit={true}
          canDelete={true}
        />
      ) : (
        <AdminCardList
          items={tags}
          selectedItems={selectedTags}
          onSelectItem={handleSelectTag}
          onEditItem={handleEditTag}
          onDeleteItem={handleDelete}
          canEdit={true}
          canDelete={true}
        />
      )}
      <CreateTagModal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
        onTagCreated={handleTagCreated}
      />
      <EditTagModal
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        onTagUpdated={handleTagUpdated}
        tag={selectedTagForEdit}
      />
    </Box>
  );
};

export default TagManagement;
