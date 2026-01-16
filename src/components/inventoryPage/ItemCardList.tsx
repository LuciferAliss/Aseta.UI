import { SimpleGrid } from "@chakra-ui/react";
import type { Item } from "../../types/item";
import type { CustomFieldsDefinition } from "../../types/inventory";
import ItemCard from "./ItemCard";

interface ItemCardListProps {
  items: Item[];
  customFieldsDefinition: CustomFieldsDefinition[];
  onEditItem: (item: Item) => void;
  onDeleteItem: (itemId: string) => void;
}

const ItemCardList = ({
  items,
  customFieldsDefinition,
  onEditItem,
  onDeleteItem,
}: ItemCardListProps) => {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
      spacing={4}
      pt={4}
    >
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          customFieldsDefinition={customFieldsDefinition}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
        />
      ))}
    </SimpleGrid>
  );
};

export default ItemCardList;
