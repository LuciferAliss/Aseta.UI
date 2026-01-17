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
  canManageInventory?: boolean;
}

const ManageCustomFieldsModal = ({
  isOpen,
  onClose,
  customFields,
  onEdit,
  onDelete,
  canManageInventory,
}: ManageCustomFieldsModalProps) => {
  const { t } = useTranslation("inventoryPage");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("manageCustomFieldsModal.title")}</ModalHeader>
        <ModalCloseButton
          _focusVisible={{
            ring: "2px",
            ringColor: "btn-focus-ring",
            ringOffset: "2px",
            ringOffsetColor: "app-bg",
          }}
        />
        <ModalBody>
          <VStack spacing={4}>
            {customFields.map((field, index) => (
              <HStack
                key={field.id || index}
                w="full"
                justifyContent="space-between"
              >
                <Text>{field.name}</Text>
                {canManageInventory && (
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
                )}
              </HStack>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ManageCustomFieldsModal;
