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
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../lib/hooks/useAppToast";
import { createCategory } from "../../lib/services/categoryService";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: () => void;
}

const CreateCategoryModal = ({
  isOpen,
  onClose,
  onCategoryCreated,
}: CreateCategoryModalProps) => {
  const { t } = useTranslation("admin");
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useAppToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createCategory(categoryName);
      showSuccess(t("categories.toasts.create_success"));
      setCategoryName("");
      onCategoryCreated();
    } catch (error) {
      showError(t("categories.toasts.create_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("categories.createModalTitle")}</ModalHeader>
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
            isDisabled={!categoryName.trim()}
          >
            {t("categories.createButton")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateCategoryModal;
