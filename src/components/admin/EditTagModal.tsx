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
import { updateTag } from "../../lib/services/tagService";
import type { TagResponse } from "../../types/tag";

interface EditTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTagUpdated: () => void;
  tag: TagResponse | null;
}

const EditTagModal = ({
  isOpen,
  onClose,
  onTagUpdated,
  tag,
}: EditTagModalProps) => {
  const { t } = useTranslation("admin");
  const [tagName, setTagName] = useState(tag?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useAppToast();

  useEffect(() => {
    setTagName(tag?.name || "");
  }, [tag]);

  const handleSubmit = async () => {
    if (!tag || !tagName.trim()) return;

    setIsSubmitting(true);
    try {
      await updateTag(tag.id, tagName);
      showSuccess(t("tags.toasts.update_success"));
      onTagUpdated();
    } catch (error) {
      showError(t("tags.toasts.update_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("tags.editModalTitle")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>{t("tags.tagNameLabel")}</FormLabel>
            <Input
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder={t("tags.tagNamePlaceholder")}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            {t("tags.cancelButton")}
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!tagName.trim() || tagName === tag?.name}
          >
            {t("tags.updateButton")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTagModal;
