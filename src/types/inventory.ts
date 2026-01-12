export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  itemsCount: number;
  creatorName: string;
  createdAt: string; // ISO 8601 date string
}

export interface InventoriesResponse {
  inventories: {
    cursor: string | null;
    hasNextPage: boolean;
    items: InventoryItem[];
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

export interface GetInventoriesRequest {
  createdAtFrom?: string; // ISO 8601 date string
  createdAtTo?: string; // ISO 8601 date string
  tagIds?: string[];
  categoryIds?: string[];
  minItemsCount?: number;
  maxItemsCount?: number;
  cursor?: string;
  pageSize?: number;
  sortBy?: SortByType;
  sortOrder?: "asc" | "desc";
}
