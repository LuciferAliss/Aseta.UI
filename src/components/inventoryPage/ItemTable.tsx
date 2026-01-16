import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tooltip,
  Text,
  Checkbox,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { type CustomFieldsDefinition } from "../../types/inventory";
import { useTranslation } from "react-i18next";
import type { Item } from "../../types/item";

interface ItemTableProps {
  items: Item[];
  customFieldsDefinition: CustomFieldsDefinition[];
  onEditItem: (item: Item) => void;
  selectedItems: string[];
  onSelectItem: (itemId: string) => void;
  onSelectAll: (areAllSelected: boolean) => void;
}

const ItemTable = ({
  items,
  customFieldsDefinition,
  onEditItem,
  selectedItems,
  onSelectItem,
  onSelectAll,
}: ItemTableProps) => {
  const { t } = useTranslation("inventoryPage");
  const areAllSelected =
    items.length > 0 && selectedItems.length === items.length;

  return (
    <TableContainer w="full">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>
              <Checkbox
                isChecked={areAllSelected}
                onChange={() => onSelectAll(areAllSelected)}
                aria-label="Select all items"
              />
            </Th>
            <Th>{t("customId")}</Th>
            {customFieldsDefinition.map((field) => (
              <Th key={field.id}>{field.name}</Th>
            ))}
            <Th>{t("creatorName")}</Th>
            <Th>{t("updaterName")}</Th>
            <Th>{t("createdAt")}</Th>
            <Th>{t("updatedAt")}</Th>
            <Th>{t("actions")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item) => (
            <Tr key={item.id}>
              <Td>
                <Checkbox
                  isChecked={selectedItems.includes(item.id)}
                  onChange={() => onSelectItem(item.id)}
                />
              </Td>
              <Td>
                <Tooltip label={item.customId} placement="top" hasArrow>
                  <Text noOfLines={1}>{item.customId}</Text>
                </Tooltip>
              </Td>
              {customFieldsDefinition.map((fieldDef) => {
                const customFieldValue = item.customFieldValues.find(
                  (cf) => cf.fieldId === fieldDef.id
                );
                const value = customFieldValue ? customFieldValue.value : "N/A";
                return (
                  <Td key={`${item.id}-${fieldDef.id}`}>
                    <Tooltip label={value} placement="top" hasArrow>
                      <Text noOfLines={1}>{value}</Text>
                    </Tooltip>
                  </Td>
                );
              })}
              <Td>
                <Tooltip label={item.creatorName} placement="top" hasArrow>
                  <Text noOfLines={1}>{item.creatorName}</Text>
                </Tooltip>
              </Td>
              <Td>
                <Tooltip
                  label={item.updaterName || "-"}
                  placement="top"
                  hasArrow
                >
                  <Text noOfLines={1}>{item.updaterName || "-"}</Text>
                </Tooltip>
              </Td>
              <Td>{new Date(item.createdAt).toLocaleString()}</Td>
              <Td>
                {item.updatedAt
                  ? new Date(item.updatedAt).toLocaleString()
                  : "-"}
              </Td>
              <Td>
                <HStack>
                  <IconButton
                    aria-label="Edit item"
                    icon={<EditIcon />}
                    onClick={() => onEditItem(item)}
                    variant="ghost"
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ItemTable;
