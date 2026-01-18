import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../lib/hooks/useAppToast";
import { updateCategory } from "../../lib/services/categoryService";
import type { CategoryResponse } from "../../types/category";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryUpdated: () => void;
  category: CategoryResponse | null;
}

const EditCategoryModal = ({
  isOpen,
  onClose,
  onCategoryUpdated,
  category,
}: EditCategoryModalProps) => {
  const { t } = useTranslation("admin");
  const [categoryName, setCategoryName] = useState(category?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useAppToast();

  useEffect(() => {
    setCategoryName(category?.name || "");
  }, [category]);

  const handleSubmit = async () => {
    if (!category || !categoryName.trim()) return;

    setIsSubmitting(true);
    try {
      await updateCategory(category.id, categoryName);
      showSuccess(t("categories.toasts.update_success"));
      onCategoryUpdated();
    } catch (error) {
      showError(t("categories.toasts.update_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("categories.editModalTitle")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>{t("categories.categoryNameLabel")}</FormLabel>
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder={t("categories.categoryNamePlaceholder")}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            {t("categories.cancelButton")}
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!categoryName.trim() || categoryName === category?.name}
          >
            {t("categories.updateButton")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCategoryModal;
