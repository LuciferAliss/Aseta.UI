import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { type InventoryItem } from "../../types/inventory";

interface InventoryTableProps {
  inventories: InventoryItem[];
}

const InventoryTable = ({ inventories }: InventoryTableProps) => {
  const handleRowClick = (inventory: InventoryItem) => {
    console.log("Inventory clicked:", inventory);
    // User will change this behavior later
  };

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Items Count</Th>
            <Th>Creator</Th>
            <Th>Created At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {inventories.map((inventory) => (
            <Tr key={inventory.id} onClick={() => handleRowClick(inventory)}>
              <Td>{inventory.name}</Td>
              <Td>{inventory.itemsCount}</Td>
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
