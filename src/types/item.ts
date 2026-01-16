export interface GetItemsRequest {
  inventoryId: string;
  cursor?: string;
  pageSize?: number;
}

export interface CreateItemRequest {
  customFieldValueRequests: CustomFieldValue[];
}

export interface UpdateItemRequest {
  customFieldValueRequests: CustomFieldValue[];
}

export interface BulkDeleteItemsRequest {
  itemIds: string[];
}

export interface ItemsResponse {
  items: {
    cursor: string | null;
    hasNextPage: boolean;
    items: Item[];
  };
}

export interface Item {
  id: string;
  customId: string;
  customFieldValues: CustomFieldValue[];
  creatorName: string;
  updaterName: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CustomFieldValue {
  fieldId: string;
  value: string;
}
