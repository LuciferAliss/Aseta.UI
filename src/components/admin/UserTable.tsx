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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { LockIcon, UnlockIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { UserResponse } from "../../types/user";

export interface ColumnDefinition<T> {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  isNumeric?: boolean;
}

interface UserTableProps {
  data: UserResponse[];
  columns: ColumnDefinition<UserResponse>[];
  onBlockUser?: (id: string) => void;
  onUnblockUser?: (id: string) => void;
}

const UserTable = ({
  data,
  columns,
  onBlockUser,
  onUnblockUser,
}: UserTableProps) => {
  const { t } = useTranslation("admin");

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: UserResponse;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent, item: UserResponse) => {
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
            {onBlockUser && !contextMenu.item.isLocked && (
              <MenuItem
                icon={<LockIcon />}
                onClick={() => {
                  onBlockUser(contextMenu.item.id);
                  handleCloseContextMenu();
                }}
              >
                {t("users.block")}
              </MenuItem>
            )}
            {onUnblockUser && contextMenu.item.isLocked && (
              <MenuItem
                icon={<UnlockIcon />}
                onClick={() => {
                  onUnblockUser(contextMenu.item.id);
                  handleCloseContextMenu();
                }}
              >
                {t("users.unlock")}
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      )}
      <Table variant="simple">
        <Thead>
          <Tr>
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

export default UserTable;
