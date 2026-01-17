export const CustomFieldType = {
  SingleLineTextType: "SingleLineText",
  MultiLineTextType: "MultiLineText",
  NumberType: "Number",
  DateType: "Date",
  CheckboxType: "Checkbox",
};

export type CustomFieldType =
  (typeof CustomFieldType)[keyof typeof CustomFieldType];

export interface CustomField {
  name: string;
  type: CustomFieldType;
}

export interface CustomFieldCreateData {
  name: string;
  type: CustomFieldType;
}

export interface CustomFieldsCreateRequest {
  customFields: CustomFieldCreateData[];
}

export interface CustomFieldUpdateRequest {
  name: string;
  type: string;
}

export interface CustomFieldData {
  fieldId: string;
  name: string;
  type: CustomFieldType;
}
