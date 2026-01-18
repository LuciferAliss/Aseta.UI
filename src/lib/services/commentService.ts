import apiClient from "../axios";
import type {
  CommentsResponse,
  GetCommentsCatalogRequest,
} from "../../types/comment";

export const getComments = async (
  request: GetCommentsCatalogRequest,
): Promise<CommentsResponse> => {
  try {
    console.log(request);
    const response = await apiClient.get<CommentsResponse>(
      `/inventories/${request.inventoryId}/comments`,
      { params: request },
    );
    return response.data;
  } catch (error) {
    console.error("Get comments failed:", error);
    throw error;
  }
};

export const addComment = async (
  inventoryId: string,
  content: string,
): Promise<void> => {
  try {
    await apiClient.post(`/inventories/${inventoryId}/comments`, { content });
  } catch (error) {
    console.error("Add comment failed:", error);
    throw error;
  }
};

export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    await apiClient.delete(`/comments/${commentId}`);
  } catch (error) {
    console.error("Delete comment failed:", error);
    throw error;
  }
};
