import type { TagsResponse } from "../../types/tag";
import apiClient from "../axios";

export const getAllTags = async (): Promise<TagsResponse> => {
  try {
    const response = await apiClient.get<TagsResponse>("/tags/all");
    return response.data;
  } catch (error) {
    console.error("Get tags failed:", error);
    throw error;
  }
};

export const createTag = async (name: string): Promise<void> => {
  try {
    await apiClient.post("/tags", { name });
  } catch (error) {
    console.error("Create tag failed:", error);
    throw error;
  }
};

export const updateTag = async (id: string, name: string): Promise<void> => {
  try {
    await apiClient.patch(`/tags/${id}`, { name });
  } catch (error) {
    console.error("Update tag failed:", error);
    throw error;
  }
};

export const deleteTags = async (tagIds: string[]): Promise<void> => {
  try {
    await apiClient.delete("/tags", { data: { tagIds } });
  } catch (error) {
    console.error("Delete tags failed:", error);
    throw error;
  }
};
