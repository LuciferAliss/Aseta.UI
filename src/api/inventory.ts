import apiClient from '../api/axios';
import type { Category, CollectionResponse, CreateInventoryRequest, CreateInventoryResponse, CreateItemRequest, DeleteItemsRequest, FieldType, Inventory, InventoryItem, PaginatedResult, Tag, UpdateCustomFieldsRequest, UpdateItemRequest, ViewInventory, ViewPagesRequest } from '../types/inventory';

export const inventoryApi = {
    createInventory: async (data: CreateInventoryRequest): Promise<CreateInventoryResponse> => {
      return (await apiClient.post('/inventory/create-inventory', data)).data;
    },

    getCategories: async (): Promise<CollectionResponse<Category>> => {
      return (await apiClient.get('/inventory/get-categories')).data;
    },

    getMostPopularInventories: async (count : number): Promise<CollectionResponse<ViewInventory>> => {
      return (await apiClient.get(`/inventory/get-most-popular-inventory/${count}`)).data;
    },

    getLastInventories: async (request: ViewPagesRequest): Promise<PaginatedResult<ViewInventory>> => {
    return (await apiClient.get('/inventory/get-last-inventories', {
        params: request 
      })).data;
    },

    getItems: async (request: ViewPagesRequest, id : string): Promise<PaginatedResult<InventoryItem>> => {
      return (await apiClient.get(`/inventory/get-items/${id}`, {
        params: request 
      })).data;
    },

    getInventoryById: async (id: string): Promise<Inventory> => {
      return (await apiClient.get(`/inventory/get-inventory/${id}`)).data;
    },

    getTagsCloud: async (): Promise<CollectionResponse<Tag>> => {
      return (await apiClient.get('/inventory/get-tags-cloud')).data;
    },

    updateCustomFields: async (request : UpdateCustomFieldsRequest ): Promise<CollectionResponse<FieldType>> => {
      return await apiClient.put('/inventory/update-custom-fields', request);
    },

    getUserRoleInventory: async (id: string): Promise<string> => {
      return (await apiClient.get(`/inventory/get-user-role-inventory/${id}`)).data;
    },

    createItem: async (data: CreateItemRequest): Promise<InventoryItem> => {
      return (await apiClient.post('/inventory/create-item', data)).data;
    },

    updateItem: async (itemId: string, data: UpdateItemRequest): Promise<void> => {
      await apiClient.put(`/inventory/items/${itemId}`, data);
    },

    deleteItems: async (data: DeleteItemsRequest, inventoryId : string): Promise<void> => {
      await apiClient.delete(`/inventory/remove-item/${inventoryId}`, {data});
  }
};
