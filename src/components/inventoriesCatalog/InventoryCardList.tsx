import { SimpleGrid } from "@chakra-ui/react";
import { type InventoryCatalogItem } from "../../types/inventory";
import CardInventory from "./CardInventory";

interface InventoryCardListProps {
  inventories: InventoryCatalogItem[];
}

const InventoryCardList = ({ inventories }: InventoryCardListProps) => {
  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} spacing={4}>
      {inventories.map((inventory) => (
        <CardInventory key={inventory.id} {...inventory} />
      ))}
    </SimpleGrid>
  );
};

export default InventoryCardList;
