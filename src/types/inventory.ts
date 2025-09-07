export interface Tag {
  id: number;
  name: string;
  weight: number;
}

interface UserCreator {
  id: string;
  userName: string;
}

export interface ViewInventory {
  id: string;
  name: string;
  description: string;
  creator: UserCreator;
}

export interface ViewLatestInventoryRequest {
  pageNumber: number;
  pageSize: number;
}

export interface Inventory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isPublic: boolean;
  userCreator: UserCreator;
  category: Category;
  createdAt: Date;
  tags: Tag[];
}

export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface Category {
  id: number;
  name: string;
}

export interface CreateInventoryRequest {
  name: string;
  description: string;
  imageUrl: string;
  isPublic: boolean;
  categoryId: number;
}

export interface CreateInventoryResponse {
  id : string;
}

export interface CollectionResponse<T> {
  collection: T[];
}