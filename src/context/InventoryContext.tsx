import { createContext, type ReactNode } from 'react';
import type { Category, CollectionResponse, CreateInventoryRequest, CreateInventoryResponse, Inventory, PaginatedResult, Tag, ViewInventory, ViewLatestInventoryRequest } from '../types/inventory';
import { inventoryApi } from '../api/inventory';

interface InventoryContextType {
  createInventory: (data: CreateInventoryRequest) => Promise<CreateInventoryResponse>;
  getMostPopularInventories: (count : number) => Promise<CollectionResponse<ViewInventory>>;  
  getLastInventories: (request: ViewLatestInventoryRequest) => Promise<PaginatedResult<ViewInventory>>;
  getInventory: (id : string) => Promise<Inventory>;
  getCategories: () => Promise<CollectionResponse<Category>>;
  getTagsCloud: () => Promise<CollectionResponse<Tag>>;
}

export const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  
  const createInventory = async (data: CreateInventoryRequest) => {
    return await inventoryApi.createInventory(data);
  };

  const getMostPopularInventories = async (count: number) => {
    return await inventoryApi.getMostPopularInventories(count);
  };

  const getLastInventories = async (request: ViewLatestInventoryRequest) => {
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
    <InventoryContext.Provider value={{ createInventory, getCategories, getMostPopularInventories, getLastInventories, getInventory, getTagsCloud }}>
      {children}
    </InventoryContext.Provider>
  );
};