import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { type InventoryCatalogItem } from "../../types/inventory";
import { useTranslation } from "react-i18next";

interface InventoryTableProps {
  inventories: InventoryCatalogItem[];
}

const InventoryTable = ({ inventories }: InventoryTableProps) => {
  const { t } = useTranslation("inventoryCatalog");

  const handleRowClick = (inventory: InventoryCatalogItem) => {
    console.log("Inventory clicked:", inventory);
  };

  return (
    <TableContainer hidden={!inventories.length}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>{t("table_header.name")}</Th>
            <Th>{t("table_header.items_count")}</Th>
            <Th>{t("table_header.category")}</Th>
            <Th>{t("table_header.creator")}</Th>
            <Th>{t("table_header.created_at")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {inventories.map((inventory) => (
            <Tr key={inventory.id} onClick={() => handleRowClick(inventory)}>
              <Td>{inventory.name}</Td>
              <Td>{inventory.itemsCount}</Td>
              <Td>{inventory.category.name}</Td>
              <Td>{inventory.creatorName}</Td>
              <Td>{new Date(inventory.createdAt).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default InventoryTable;
