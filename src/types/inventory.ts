export interface Tag {
  id: number;
  name: string;
  weight: number;
}

interface UserCreator {
  id: string;
  userName: string;
}

export interface ViewInventory {
  id: string;
  name: string;
  description: string;
  creator: UserCreator;
  isPublic: boolean;
}

export interface ViewPagesRequest {
  pageNumber: number;
  pageSize: number;
}

export interface CustomFieldDefinition {
  id: string;
  name: string;
  type: number;
}

export interface UpdateCustomFieldDefinitionRequest {
  Id: string;
  Name: string;
  Type: number;
}

export interface UpdateCustomFieldsRequest {
  inventoryId: string;
  customFields: UpdateCustomFieldDefinitionRequest[];
}

export interface CustomFieldValueRequest {
  fieldDefinitionId: string;
  value: string | number | boolean | Date | null;
}

export interface CreateItemRequest {
  inventoryId: string;
  name: string;
  tags: string[];
  customFieldValues: CustomFieldValueRequest[];
}

export interface UpdateItemRequest {
  name: string;
  tags: string[];
  customFieldValues: CustomFieldValueRequest[];
}

export interface DeleteItemsRequest {
  itemIds: string[];
}

export interface Inventory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isPublic: boolean;
  userCreator: UserCreator;
  category: Category;
  createdAt: Date;
  tags: Tag[];
  customFieldsDefinition: CustomFieldDefinition[];
}

export interface FieldType
{
  id: number,
  name: string
}

export interface CustomFieldValue
{
  fieldId : string;
  value : string | null; 
}

export interface InventoryItem {
  id: string;
  customId: string;
  customFields: CustomFieldValue[];
  userCreator: UserCreator;
  userUpdate: UserCreator;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface Category {
  id: number;
  name: string;
}

export interface CreateInventoryRequest {
  name: string;
  description: string;
  imageUrl: string;
  isPublic: boolean;
  categoryId: number;
}

export interface CreateInventoryResponse {
  id : string;
}

export interface CollectionResponse<T> {
  collection: T[];
}