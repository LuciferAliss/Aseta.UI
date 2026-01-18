import {
  Box,
  Checkbox,
  Flex,
  IconButton,
  Text,
  Spacer,
  Tooltip,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";

interface AdminCardProps<T extends { id: string; name: string }> {
  item: T;
  isSelected: boolean;
  onSelectItem: (id: string) => void;
  onEditItem?: (item: T) => void;
  onDeleteItem?: (id: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const AdminCard = <T extends { id: string; name: string }>({
  item,
  isSelected,
  onSelectItem,
  onEditItem,
  onDeleteItem,
  canEdit = false,
  canDelete = false,
}: AdminCardProps<T>) => {
  const { t } = useTranslation("admin");

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      w="full"
      position="relative"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Checkbox
          isChecked={isSelected}
          onChange={() => onSelectItem(item.id)}
          mr={2}
          flexShrink={1} // Allow checkbox to shrink
        >
          <Tooltip label={item.name} placement="top" hasArrow>
            <Text fontWeight="bold" noOfLines={1} minW={0}>{item.name}</Text> {/* Allow text to shrink */}
          </Tooltip>
        </Checkbox>
        <Spacer />
        {canEdit && onEditItem && (
          <IconButton
            aria-label={t("tags.edit")}
            icon={<EditIcon />}
            size="sm"
            variant="ghost"
            mr={1}
            onClick={() => onEditItem(item)}
          />
        )}
        {canDelete && onDeleteItem && (
          <IconButton
            aria-label={t("tags.delete")}
            icon={<DeleteIcon />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={() => onDeleteItem(item.id)}
          />
        )}
      </Flex>
    </Box>
  );
};

export default AdminCard;