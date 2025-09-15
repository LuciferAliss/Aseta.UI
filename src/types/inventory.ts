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
  type: string;
}

export interface UpdateCustomFieldsRequest {
  inventoryId: string;
  customFields: CustomFieldDefinition[];
}



export interface UpdateItemRequest {
  name: string;
  tags: string[];
  customFieldValues: CustomFieldValueRequest[];
}

export interface DeleteItemsRequest {
  itemIds: string[];
}

export interface CreateItemRequest {
  inventoryId: string;
  customFields: CustomFieldValueRequest[];
}

export interface CustomFieldValueRequest {
  fieldId: string;
  value: string;
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
  customIdRules : CustomIdRule[]
}

export type CustomIdRule = {
  clientSideId: string;
  type: string;
  order: number;
  [key: string]: any; 
};

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

interface CustomIdRuleBase {
  order: number;
}

// Конкретные типы правил
export interface FixedTextRulePartRequest extends CustomIdRuleBase {
  $type: 'fixed_text';
  text: string;
}

export interface SequenceRulePartRequest extends CustomIdRuleBase {
  $type: 'sequence';
  padding: number;
}

export interface DateRulePartRequest extends CustomIdRuleBase {
  $type: 'date';
  format: string;
}

export interface GuidRulePartRequest extends CustomIdRuleBase {
  $type: 'guid';
  format: string;
}

export interface RandomDigitsRulePartRequest extends CustomIdRuleBase {
  $type: 'random_digits';
  length: number;
}

export interface RandomNumberBitRulePartRequest extends CustomIdRuleBase {
  $type: 'random_bits';
  countBits: number;
  format: string;
}

// Объединение всех возможных типов правил для API
export type CustomIdRuleApiRequest =
  | FixedTextRulePartRequest
  | SequenceRulePartRequest
  | DateRulePartRequest
  | GuidRulePartRequest
  | RandomDigitsRulePartRequest
  | RandomNumberBitRulePartRequest;

// Главный интерфейс запроса
export interface CustomIdRulesRequest {
  customIdRuleParts: CustomIdRuleApiRequest[];
}