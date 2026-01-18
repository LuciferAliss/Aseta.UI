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

export const createCategory = async (name: string): Promise<void> => {
  try {
    await apiClient.post("/categories", { name });
  } catch (error) {
    console.error("Create category failed:", error);
    throw error;
  }
};

export const updateCategory = async (id: string, name: string): Promise<void> => {
  try {
    await apiClient.patch(`/categories/${id}`, { name });
  } catch (error) {
    console.error("Update category failed:", error);
    throw error;
  }
};

export const deleteCategories = async (categoryIds: string[]): Promise<void> => {
  try {
    await apiClient.delete("/categories", { data: { categoryIds } });
  } catch (error) {
    console.error("Delete categories failed:", error);
    throw error;
  }
};
