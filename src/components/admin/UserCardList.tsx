import { SimpleGrid } from "@chakra-ui/react";
import type { UserResponse } from "../../types/user";
import UserCard from "./UserCard";

interface UserCardListProps {
  users: UserResponse[];
  selectedItems: string[];
  onSelectItem: (id: string) => void;
  onBlockUser?: (id: string) => void;
  onUnblockUser?: (id: string) => void;
  onDeleteItem?: (id: string) => void;
  canDelete?: boolean;
}

const UserCardList = ({
  users,
  onBlockUser,
  onUnblockUser,
}: UserCardListProps) => {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onBlockUser={onBlockUser}
          onUnblockUser={onUnblockUser}
        />
      ))}
    </SimpleGrid>
  );
};

export default UserCardList;
