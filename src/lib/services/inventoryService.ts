import type {
  GetInventoriesCatalogRequest,
  InventoriesCatalogResponse,
  InventoryCreateRequest,
  InventoryCatalogItem,
  InventoryResponse,
  InventoryUpdateRequest,
} from "../../types/inventory";
import apiClient from "../axios";

export const getInventories = async (
  request: GetInventoriesCatalogRequest
): Promise<InventoriesCatalogResponse> => {
  try {
    const response = await apiClient.get<InventoriesCatalogResponse>(
      "/inventories",
      {
        params: request,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Get inventories failed:", error);
    throw error;
  }
};

export const createInventory = async (
  request: InventoryCreateRequest
): Promise<InventoryCatalogItem> => {
  try {
    const response = await apiClient.post<InventoryCatalogItem>(
      "/inventories",
      request
    );
    return response.data;
  } catch (error) {
    console.error("Create inventory failed:", error);
    throw error;
  }
};

export const getInventoryById = async (
  id: string
): Promise<InventoryResponse> => {
  try {
    const response = await apiClient.get<InventoryResponse>(`/inventories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get inventory by id failed:", error);
    throw error;
  }
};

export const updateInventory = async (
  id: string,
  data: InventoryUpdateRequest
) => {
  try {
    const response = await apiClient.patch(`/inventories/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Update inventory failed:", error);
    throw error;
  }
};
