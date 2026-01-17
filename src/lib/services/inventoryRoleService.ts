import type {
  AddRequest,
  UpdateRequest,
  UsersResponse,
} from "../../types/inventoryRole";
import axiosInstance from "../axios";

export const getInventoryUsers = async (
  inventoryId: string
): Promise<UsersResponse> => {
  try {
    const response = await axiosInstance.get<UsersResponse>(
      `/inventories/${inventoryId}/roles/users`
    );
    return response.data;
  } catch (error) {
    console.error("Get users failed:", error);
    throw error;
  }
};

export const addInventoryUser = async (request: AddRequest): Promise<void> => {
  try {
    await axiosInstance.post(
      `/inventories/${request.inventoryId}/roles`,
      request
    );
  } catch (error) {
    console.error("Add user role failed:", error);
    throw error;
  }
};

export const updateInventoryUserRole = async (
  inventoryId: string,
  userId: string,
  request: UpdateRequest
): Promise<void> => {
  try {
    await axiosInstance.patch(
      `/inventories/${inventoryId}/roles/${userId}`,
      request
    );
  } catch (error) {
    console.error("Update user role failed:", error);
    throw error;
  }
};

export const removeInventoryUser = async (
  inventoryId: string,
  userId: string
): Promise<void> => {
  try {
    await axiosInstance.delete(`/inventories/${inventoryId}/roles/${userId}`);
  } catch (error) {
    console.error("Delete users failed:", error);
    throw error;
  }
};
