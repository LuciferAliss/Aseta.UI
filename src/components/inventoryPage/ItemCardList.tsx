import { SimpleGrid } from "@chakra-ui/react";
import type { Item } from "../../types/item";
import type { CustomFieldData } from "../../types/customField";
import ItemCard from "./ItemCard";

interface ItemCardListProps {
  items: Item[];
  customFieldsDefinition: CustomFieldData[];
  onEditItem: (item: Item) => void;
  onDeleteItem: (itemId: string) => void;
  canEditItems?: boolean;
}

const ItemCardList = ({
  items,
  customFieldsDefinition,
  onEditItem,
  onDeleteItem,
  canEditItems,
}: ItemCardListProps) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={4} pt={4}>
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          customFieldsDefinition={customFieldsDefinition}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
          canEditItems={canEditItems}
        />
      ))}
    </SimpleGrid>
  );
};

export default ItemCardList;
