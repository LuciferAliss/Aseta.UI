import apiClient from "../axios";

export const login = async (params: any) => {
  const response = await apiClient.post("/users", params);
  return response.data;
};
