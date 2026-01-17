export type InventoryUserRole = "Owner" | "Editor";

export interface UserResponse {
  userId: string;
  userName: string;
  role: InventoryUserRole;
}

export interface UsersResponse {
  users: UserResponse[];
}

export interface AddRequest {
  inventoryId: string;
  userId: string;
  role: InventoryUserRole;
}

export interface UpdateRequest {
  role: InventoryUserRole;
}
