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
import { createTag } from "../../lib/services/tagService";

interface CreateTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTagCreated: () => void;
}

const CreateTagModal = ({
  isOpen,
  onClose,
  onTagCreated,
}: CreateTagModalProps) => {
  const { t } = useTranslation("admin");
  const [tagName, setTagName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useAppToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createTag(tagName);
      showSuccess(t("tags.toasts.create_success"));
      setTagName("");
      onTagCreated();
    } catch (error) {
      showError(t("tags.toasts.create_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("tags.createModalTitle")}</ModalHeader>
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
            isDisabled={!tagName.trim()}
          >
            {t("tags.createButton")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateTagModal;
