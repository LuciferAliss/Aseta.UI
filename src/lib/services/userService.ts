import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserSearchResponse,
} from "../../types/user";
import apiClient from "../axios";

export const searchUsers = async (
  searchTerm: string
): Promise<{ users: UserSearchResponse[] }> => {
  try {
    const response = await apiClient.get<{ users: UserSearchResponse[] }>(
      `/users/search/${searchTerm}`
    );
    return response.data;
  } catch (error) {
    console.error("Search users failed:", error);
    throw error;
  }
};

export const loginUser = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post("/user-sessions", request);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const registerUser = async (request: RegisterRequest) => {
  try {
    const response = await apiClient.post("/users", request);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const refreshToken = async (): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post("/user-sessions/refresh");
    return response.data;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await apiClient.delete("/user-sessions");
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};
