import { SimpleGrid } from "@chakra-ui/react";
import AdminCard from "./AdminCard";

interface AdminCardListProps<T extends { id: string; name: string }> {
  items: T[];
  selectedItems: string[];
  onSelectItem: (id: string) => void;
  onEditItem?: (item: T) => void;
  onDeleteItem?: (id: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const AdminCardList = <T extends { id: string; name: string }>({
  items,
  selectedItems,
  onSelectItem,
  onEditItem,
  onDeleteItem,
  canEdit,
  canDelete,
}: AdminCardListProps<T>) => {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
      {items.map((item) => (
        <AdminCard
          key={item.id}
          item={item}
          isSelected={selectedItems.includes(item.id)}
          onSelectItem={onSelectItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      ))}
    </SimpleGrid>
  );
};

export default AdminCardList;