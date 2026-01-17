import type {
  CustomFieldsCreateRequest,
  CustomFieldUpdateRequest,
} from "../../types/customField";
import apiClient from "../axios";

export const createCustomFields = async (
  inventoryId: string,
  request: CustomFieldsCreateRequest
): Promise<void> => {
  try {
    await apiClient.post(`/inventories/${inventoryId}/custom-fields`, request);
  } catch (error) {
    console.error("Create custom fields failed:", error);
    throw error;
  }
};

export const updateCustomField = async (
  inventoryId: string,
  fieldId: string,
  request: CustomFieldUpdateRequest
): Promise<void> => {
  try {
    await apiClient.patch(
      `/inventories/${inventoryId}/custom-fields/${fieldId}`,
      request
    );
  } catch (error) {
    console.error("Update custom field failed:", error);
    throw error;
  }
};

export const deleteCustomField = async (
  inventoryId: string,
  fieldId: string
): Promise<void> => {
  try {
    await apiClient.delete(
      `/inventories/${inventoryId}/custom-fields/${fieldId}`
    );
  } catch (error) {
    console.error("Delete custom field failed:", error);
    throw error;
  }
};
