import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  HStack,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import type { CustomFieldData } from "../../types/customField";

interface ManageCustomFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customFields: CustomFieldData[];
  onEdit: (field: CustomFieldData) => void;
  onDelete: (field: CustomFieldData) => void;
}

const ManageCustomFieldsModal = ({
  isOpen,
  onClose,
  customFields,
  onEdit,
  onDelete,
}: ManageCustomFieldsModalProps) => {
  const { t } = useTranslation("inventoryPage");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("manageCustomFieldsModal.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {customFields.map((field) => (
              <HStack
                key={field.fieldId}
                w="full"
                justifyContent="space-between"
              >
                <Text>{field.name}</Text>
                <HStack>
                  <IconButton
                    aria-label={t("manageCustomFieldsModal.editAriaLabel")}
                    icon={<EditIcon />}
                    onClick={() => onEdit(field)}
                  />
                  <IconButton
                    aria-label={t("manageCustomFieldsModal.deleteAriaLabel")}
                    icon={<DeleteIcon />}
                    onClick={() => onDelete(field)}
                    colorScheme="red"
                  />
                </HStack>
              </HStack>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ManageCustomFieldsModal;
