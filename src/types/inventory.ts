export interface InventoryCatalogItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  itemsCount: number;
  creatorName: string;
  createdAt: string;
}

export interface InventoriesCatalogResponse {
  inventories: {
    cursor: string | null;
    hasNextPage: boolean;
    items: InventoryCatalogItem[];
  };
}

export type SortByType = "Date" | "Name" | "Creator" | "NumberOfItems";

export const sortByOptions: SortByType[] = [
  "Date",
  "Name",
  "Creator",
  "NumberOfItems",
];

export type SortOrderType = "asc" | "desc";

export const sortOrderOptions: SortOrderType[] = ["asc", "desc"];

export interface GetInventoriesCatalogRequest {
  createdAtFrom?: string;
  createdAtTo?: string;
  tagIds?: string[];
  categoryIds?: string[];
  minItemsCount?: number;
  maxItemsCount?: number;
  cursor?: string;
  pageSize?: number;
  sortBy?: SortByType;
  sortOrder?: "asc" | "desc";
}

export interface InventoryCreateRequest {
  name: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  isPublic: boolean;
}
