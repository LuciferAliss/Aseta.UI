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
