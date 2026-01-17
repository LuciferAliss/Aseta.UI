import {
  Container,
  VStack,
  Text,
  Divider,
  HStack,
  Tooltip,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import type { Item, CustomFieldValue } from "../../types/item";
import type { CustomFieldData } from "../../types/customField";
import { useTranslation } from "react-i18next";

interface ItemCardProps {
  item: Item;
  customFieldsDefinition: CustomFieldData[];
  onEditItem: (item: Item) => void;
  onDeleteItem: (itemId: string) => void;
  canEditItems?: boolean;
}

const findAndRenderCustomFieldValue = (
  customFieldValues: CustomFieldValue[],
  fieldDef: CustomFieldData
) => {
  const field = customFieldValues.find((f) => f.fieldId === fieldDef.id);
  if (field === undefined) return "N/A";
  const { value } = field;
  return value;
};

const ItemCard = ({
  item,
  customFieldsDefinition,
  onEditItem,
  onDeleteItem,
  canEditItems,
}: ItemCardProps) => {
  const { t } = useTranslation("inventoryPage");
  return (
    <Container variant="card" p={4} flexDirection="column" w="100%">
      <VStack spacing={3} align="start" flex="1" w="100%">
        <HStack justifyContent="space-between" w="100%">
          <Text fontSize="sm" color="text-secondary" fontWeight="bold">
            {t("customId")}:
          </Text>
          <Tooltip label={item.customId} placement="top" hasArrow>
            <Text fontSize="sm" noOfLines={1}>
              {item.customId}
            </Text>
          </Tooltip>
        </HStack>

        <Divider />
        <VStack spacing={1} align="start" w="100%">
          {customFieldsDefinition.map((fieldDef) => {
            const value = findAndRenderCustomFieldValue(
              item.customFieldValues,
              fieldDef
            );
            return (
              <HStack
                key={fieldDef.id}
                justifyContent="space-between"
                w="100%"
                spacing={4} // Добавляем небольшой отступ для надежности
              >
                <Text
                  fontSize="sm"
                  color="text-secondary"
                  fontWeight="bold"
                  whiteSpace="nowrap"
                >
                  {fieldDef.name}:
                </Text>
                <Tooltip label={value.toString()} placement="top" hasArrow>
                  {/* Вот ключевое исправление: */}
                  <Box flexShrink={1} minWidth={0}>
                    <Text fontSize="sm" noOfLines={1} textAlign="right">
                      {value.toString()}
                    </Text>
                  </Box>
                </Tooltip>
              </HStack>
            );
          })}
        </VStack>
        <Divider />
        <VStack spacing={1} align="start" w="100%">
          <HStack justifyContent="space-between" w="100%">
            <Text fontSize="sm" color="text-secondary" fontWeight="bold">
              {t("creatorName")}:
            </Text>
            <Tooltip label={item.creatorName} placement="top" hasArrow>
              <Text fontSize="sm" noOfLines={1}>
                {item.creatorName}
              </Text>
            </Tooltip>
          </HStack>
          <HStack justifyContent="space-between" w="100%">
            <Text fontSize="sm" color="text-secondary" fontWeight="bold">
              {t("updaterName")}:
            </Text>
            <Tooltip label={item.updaterName || "-"} placement="top" hasArrow>
              <Text fontSize="sm" noOfLines={1}>
                {item.updaterName || "-"}
              </Text>
            </Tooltip>
          </HStack>
          <HStack justifyContent="space-between" w="100%">
            <Text fontSize="sm" color="text-secondary" fontWeight="bold">
              {t("createdAt")}:
            </Text>
            <Text fontSize="sm">
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </HStack>
          <HStack justifyContent="space-between" w="100%">
            <Text fontSize="sm" color="text-secondary" fontWeight="bold">
              {t("updatedAt")}:
            </Text>
            <Text fontSize="sm">
              {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-"}
            </Text>
          </HStack>
        </VStack>
        {canEditItems && (
          <>
            <Divider />
            <HStack w="100%" justifyContent="flex-end">
              <IconButton
                aria-label="Edit item"
                icon={<EditIcon />}
                onClick={() => onEditItem(item)}
                variant="ghost"
              />
              <IconButton
                aria-label="Delete item"
                icon={<DeleteIcon />}
                variant="ghost"
                colorScheme="red"
                onClick={() => onDeleteItem(item.id)}
              />
            </HStack>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default ItemCard;
