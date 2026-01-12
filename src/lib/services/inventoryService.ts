import type {
  GetInventoriesRequest,
  InventoriesResponse,
} from "../../types/inventory";
import apiClient from "../axios";

export const getInventories = async (
  request: GetInventoriesRequest
): Promise<InventoriesResponse> => {
  try {
    const response = await apiClient.get<InventoriesResponse>("/inventories", {
      params: request,
    });
    return response.data;
  } catch (error) {
    console.error("Get inventories failed:", error);
    throw error;
  }
};
