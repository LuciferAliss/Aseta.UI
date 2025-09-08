import apiClient from '../api/axios';
import type { Category, CollectionResponse, CreateInventoryRequest, CreateInventoryResponse, Inventory, InventoryItem, PaginatedResult, Tag, ViewInventory, ViewPagesRequest } from '../types/inventory';

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
  }
};