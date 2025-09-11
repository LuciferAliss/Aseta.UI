import { createContext, type ReactNode } from 'react';
import type { Category, CollectionResponse, UpdateCustomFieldsRequest, CreateInventoryRequest, CreateInventoryResponse, Inventory, InventoryItem, PaginatedResult, Tag, ViewInventory, ViewPagesRequest, CreateItemRequest, UpdateItemRequest, DeleteItemsRequest } from '../types/inventory';
import { inventoryApi } from '../api/inventory';

interface InventoryContextType {
  createInventory: (data: CreateInventoryRequest) => Promise<CreateInventoryResponse>;
  getMostPopularInventories: (count : number) => Promise<CollectionResponse<ViewInventory>>;  
  getItems: (request: ViewPagesRequest, id : string) => Promise<PaginatedResult<InventoryItem>>;
  getLastInventories: (request: ViewPagesRequest) => Promise<PaginatedResult<ViewInventory>>;
  getInventory: (id : string) => Promise<Inventory>;
  getCategories: () => Promise<CollectionResponse<Category>>;
  getTagsCloud: () => Promise<CollectionResponse<Tag>>;
  updateCustomFields: (request : UpdateCustomFieldsRequest) => Promise<void>;
  getUserRoleInventory: (id: string) => Promise<string>;
  createItem: (data: CreateItemRequest) => Promise<InventoryItem>;
  updateItem: (itemId: string, data: UpdateItemRequest) => Promise<void>;
  deleteItems: (data: DeleteItemsRequest, id : string) => Promise<void>;
}

export const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {

  const createItem = async (data: CreateItemRequest) => {
    return await inventoryApi.createItem(data);
  };

  const updateItem = async (itemId: string, data: UpdateItemRequest) => {
    await inventoryApi.updateItem(itemId, data);
  };

  const deleteItems = async (data: DeleteItemsRequest, id : string) => {
    await inventoryApi.deleteItems(data, id);
  };

  const getUserRoleInventory = async (id: string) => {
    return await inventoryApi.getUserRoleInventory(id);
  };

  const updateCustomFields = async (request : UpdateCustomFieldsRequest) => {
    await inventoryApi.updateCustomFields(request);
  };
  
  const createInventory = async (data: CreateInventoryRequest) => {
    return await inventoryApi.createInventory(data);
  };

  const getItems = async (request: ViewPagesRequest, id : string) => {
    return await inventoryApi.getItems(request, id);
  }

  const getMostPopularInventories = async (count: number) => {
    const response = await inventoryApi.getMostPopularInventories(count);
    return response;
  };

  const getLastInventories = async (request: ViewPagesRequest) => {
    return await inventoryApi.getLastInventories(request);
  };

  const getCategories = async () : Promise<CollectionResponse<Category>> => {
    return await inventoryApi.getCategories();; 
  };

  const getInventory = async (id : string) : Promise<Inventory> => {
    return await inventoryApi.getInventoryById(id); 
  };

  const getTagsCloud = async () : Promise<CollectionResponse<Tag>> => {
    return await inventoryApi.getTagsCloud(); 
  }
  
  return (
    <InventoryContext.Provider value={{ createItem, updateItem, deleteItems,getUserRoleInventory, updateCustomFields, createInventory, getCategories, getMostPopularInventories, getLastInventories, getInventory, getTagsCloud, getItems }}>
      {children}
    </InventoryContext.Provider>
  );
};