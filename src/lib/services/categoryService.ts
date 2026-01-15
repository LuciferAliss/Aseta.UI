import type { CategoriesResponse } from "../../types/category";
import apiClient from "../axios";

export const GetAllCategory = async (): Promise<CategoriesResponse> => {
  try {
    const response = await apiClient.get<CategoriesResponse>("/categories/all");
    return response.data;
  } catch (error) {
    console.error("Get categories failed:", error);
    throw error;
  }
};
