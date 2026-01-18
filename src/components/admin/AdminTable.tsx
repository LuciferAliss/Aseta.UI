import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Checkbox,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export interface ColumnDefinition<T> {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  isNumeric?: boolean;
}

interface AdminTableProps<T extends { id: string }> {
  data: T[];
  columns: ColumnDefinition<T>[];
  selectedItems: string[];
  onSelectItem: (id: string) => void;
  onSelectAll: (areAllSelected: boolean) => void;
  onEditItem?: (item: T) => void;
  onDeleteItem?: (id: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const AdminTable = <T extends { id: string }>({
  data,
  columns,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onEditItem,
  onDeleteItem,
  canEdit = false,
  canDelete = false,
}: AdminTableProps<T>) => {
  const areAllSelected =
    data.length > 0 && selectedItems.length === data.length;
  const { t } = useTranslation("admin");

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: T;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent, item: T) => {
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
            {canEdit && onEditItem && (
              <MenuItem
                icon={<EditIcon />}
                onClick={() => {
                  if (contextMenu) {
                    onEditItem(contextMenu.item);
                  }
                  handleCloseContextMenu();
                }}
              >
                {t("tags.edit")}
              </MenuItem>
            )}
            {canDelete && onDeleteItem && (
              <MenuItem
                icon={<DeleteIcon />}
                color="red.500"
                onClick={() => {
                  if (contextMenu) {
                    onDeleteItem(contextMenu.item.id);
                  }
                  handleCloseContextMenu();
                }}
              >
                {t("tags.delete")}
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      )}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th w="5%">
              <Checkbox
                isChecked={areAllSelected}
                onChange={() => onSelectAll(areAllSelected)}
                aria-label={t("tags.deleteSelected", { count: selectedItems.length })}
              />
            </Th>
            {columns.map((column, index) => (
              <Th key={index} isNumeric={column.isNumeric}>
                {column.header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item) => (
            <Tr key={item.id} onContextMenu={(e) => handleContextMenu(e, item)}>
              <Td w="5%">
                <Checkbox
                  isChecked={selectedItems.includes(item.id)}
                  onChange={() => onSelectItem(item.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </Td>
              {columns.map((column, index) => (
                <Td key={index} isNumeric={column.isNumeric}>
                  {typeof column.accessor === "function" ? (
                    column.accessor(item)
                  ) : (
                    <Tooltip
                      label={String(item[column.accessor])}
                      placement="top"
                      hasArrow
                    >
                      <Text noOfLines={1}>{String(item[column.accessor])}</Text>
                    </Tooltip>
                  )}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default AdminTable;