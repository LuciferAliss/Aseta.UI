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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { type CustomFieldsDefinition } from "../../types/inventory";
import { useTranslation } from "react-i18next";
import type { Item } from "../../types/item";
import { useState } from "react";

interface ItemTableProps {
  items: Item[];
  customFieldsDefinition: CustomFieldsDefinition[];
  onEditItem: (item: Item) => void;
  onDeleteItem: (itemId: string) => void;
  selectedItems: string[];
  onSelectItem: (itemId: string) => void;
  onSelectAll: (areAllSelected: boolean) => void;
}

const ItemTable = ({
  items,
  customFieldsDefinition,
  onEditItem,
  onDeleteItem,
  selectedItems,
  onSelectItem,
  onSelectAll,
}: ItemTableProps) => {
  const { t } = useTranslation("inventoryPage");
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: Item;
  } | null>(null);

  const areAllSelected =
    items.length > 0 && selectedItems.length === items.length;

  const handleContextMenu = (event: React.MouseEvent, item: Item) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, item });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <TableContainer w="full">
      {contextMenu && (
        <Menu isOpen={true} onClose={handleCloseContextMenu}>
          <MenuButton
            style={{
              position: "fixed",
              top: contextMenu.y,
              left: contextMenu.x,
              transform: "translate(-50%, -50%)",
            }}
          />
          <MenuList>
            <MenuItem
              icon={<EditIcon />}
              onClick={() => {
                onEditItem(contextMenu.item);
                handleCloseContextMenu();
              }}
            >
              {t("editItem")}
            </MenuItem>
            <MenuItem
              icon={<DeleteIcon />}
              color="red.500"
              onClick={() => {
                onDeleteItem(contextMenu.item.id);
                handleCloseContextMenu();
              }}
            >
              {t("deleteItem")}
            </MenuItem>
          </MenuList>
        </Menu>
      )}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>
              <Checkbox
                isChecked={areAllSelected}
                onChange={() => onSelectAll(areAllSelected)}
                aria-label="Select all items"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSelectAll(areAllSelected);
                  }
                }}
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
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item) => (
            <Tr
              key={item.id}
              onClick={() => {
                onSelectItem(item.id);
              }}
              onContextMenu={(e) => handleContextMenu(e, item)}
              style={{ cursor: "pointer" }}
            >
              <Td>
                <Checkbox
                  isChecked={selectedItems.includes(item.id)}
                  onChange={() => onSelectItem(item.id)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onSelectItem(item.id);
                      e.stopPropagation();
                    }
                  }}
                />
              </Td>
              <Td maxWidth="150px">
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
                  <Td key={`${item.id}-${fieldDef.id}`} maxWidth="150px">
                    <Tooltip label={value} placement="top" hasArrow>
                      <Text noOfLines={1}>{value}</Text>
                    </Tooltip>
                  </Td>
                );
              })}
              <Td maxWidth="150px">
                <Tooltip label={item.creatorName} placement="top" hasArrow>
                  <Text noOfLines={1}>{item.creatorName}</Text>
                </Tooltip>
              </Td>
              <Td maxWidth="150px">
                <Tooltip
                  label={item.updaterName || "-"}
                  placement="top"
                  hasArrow
                >
                  <Text noOfLines={1}>{item.updaterName || "-"}</Text>
                </Tooltip>
              </Td>
              <Td maxWidth="200px">
                <Tooltip
                  label={new Date(item.createdAt).toLocaleString()}
                  placement="top"
                  hasArrow
                >
                  <Text noOfLines={1}>
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </Tooltip>
              </Td>
              <Td maxWidth="200px">
                <Tooltip
                  label={
                    item.updatedAt
                      ? new Date(item.updatedAt).toLocaleString()
                      : "-"
                  }
                  placement="top"
                  hasArrow
                >
                  <Text noOfLines={1}>
                    {item.updatedAt
                      ? new Date(item.updatedAt).toLocaleString()
                      : "-"}
                  </Text>
                </Tooltip>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ItemTable;
