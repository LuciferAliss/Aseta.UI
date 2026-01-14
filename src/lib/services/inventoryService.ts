import type {
  GetInventoriesCatalogRequest,
  InventoriesCatalogResponse,
  InventoryCreateRequest,
  InventoryCatalogItem,
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
