import type {
  GetInventoriesCatalogRequest,
  InventoriesCatalogResponse,
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
