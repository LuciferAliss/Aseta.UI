import type {
  CreateItemRequest,
  GetItemsRequest,
  Item,
  ItemsResponse,
  UpdateItemRequest,
  BulkDeleteItemsRequest,
} from "../../types/item";
import apiClient from "../axios";

export const getItems = async (
  request: GetItemsRequest
): Promise<ItemsResponse> => {
  try {
    const response = await apiClient.get<ItemsResponse>(
      `/inventories/${request.inventoryId}/items`,
      {
        params: {
          cursor: request.cursor,
          pageSize: request.pageSize,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Get inventories failed:", error);
    throw error;
  }
};

export const createItem = async (
  inventoryId: string,
  requestBody: CreateItemRequest
): Promise<Item> => {
  try {
    console.log(requestBody);
    const response = await apiClient.post<Item>(
      `/inventories/${inventoryId}/items`,
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("Create item failed:", error);
    throw error;
  }
};

export const updateItem = async (
  inventoryId: string,
  itemId: string,
  requestBody: UpdateItemRequest
): Promise<Item> => {
  try {
    const response = await apiClient.patch<Item>(
      `/inventories/${inventoryId}/items/${itemId}`,
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("Update item failed:", error);
    throw error;
  }
};

export const bulkDeleteItems = async (
  inventoryId: string,
  requestBody: BulkDeleteItemsRequest
): Promise<void> => {
  try {
    await apiClient.delete(`/inventories/${inventoryId}/items`, {
      data: requestBody,
    });
  } catch (error) {
    console.error("Bulk delete items failed:", error);
    throw error;
  }
};
