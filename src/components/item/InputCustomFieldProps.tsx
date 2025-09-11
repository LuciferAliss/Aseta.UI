import {
  Checkbox, FormControl, FormLabel, Input, Textarea
} from "@chakra-ui/react";
import type { CustomFieldDefinition } from "../../types/inventory";

export interface InputCustomFieldProps {
  field: CustomFieldDefinition;
  value: any;
  onChange: (fieldId: string, value: any) => void;
}

const InputCustomField = ({ field, value, onChange }: InputCustomFieldProps) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(field.id, e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field.id, e.target.checked);
  };

  const renderField = () => {
    switch (field.type) {
      case '0': 
        return <Input type="text" value={value || ''} onChange={handleInputChange} />;
      case '1': // Textarea
        return <Textarea value={value || ''} onChange={handleInputChange} />;
      case '2': // Number
        return <Input type="number" value={value || ''} onChange={handleInputChange} />;
      case '3': // Boolean
        return <Checkbox isChecked={!!value} onChange={handleCheckboxChange} />;
      case '4': // Date
        return <Input type="date" value={value || ''} onChange={handleInputChange} />;
      default:
        return <Input type="text" value={value || ''} onChange={handleInputChange} />;
    }
  };

  return (
    <FormControl id={field.id}>
      <FormLabel>{field.name}</FormLabel>
      {renderField()}
    </FormControl>
  );
};

export default InputCustomField;