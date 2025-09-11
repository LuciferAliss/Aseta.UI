import {
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormHelperText,
  useColorModeValue,
  Text,
  Tooltip
} from "@chakra-ui/react";
import type { CustomFieldDefinition } from "../../types/inventory";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export interface InputCustomFieldProps {
  field: CustomFieldDefinition;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  isInvalid?: boolean;
}

const InputCustomField = ({ field, value, onChange, isInvalid }: InputCustomFieldProps) => {
  const { t } = useTranslation('global');

  const inputBgColor = useColorModeValue('gray.100', 'gray.600');
  const focusBorderColor = 'teal.500';

  const fieldTypeInfo = useMemo(() => {
    const types = {
      '0': { label: t('inventoryPage.fields.text'), description: t('inventoryPage.fields.textDescription') },
      '1': { label: t('inventoryPage.fields.textarea'), description: t('inventoryPage.fields.textareaDescription') },
      '2': { label: t('inventoryPage.fields.number'), description: t('inventoryPage.fields.numberDescription') },
      '3': { label: t('inventoryPage.fields.checkbox'), description: t('inventoryPage.fields.checkboxDescription') },
      '4': { label: t('inventoryPage.fields.date'), description: t('inventoryPage.fields.dateDescription') },
    };
    return types[field.type as keyof typeof types] || types['0'];
  }, [field.type, t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(field.id, e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field.id, e.target.checked);
  };

  const formattedDateValue = useMemo(() => {
    if (field.type === '4' && value) {
      try {
        const date = new Date(value);
        return date.toISOString().split('T')[0];
      } catch {
        return '';
      }
    }
    return value || '';
  }, [field.type, value]);

  const renderField = () => {
    const commonInputProps = {
      value: field.type === '4' ? formattedDateValue : (value || ''),
      onChange: handleInputChange,
      focusBorderColor: focusBorderColor,
      bg: inputBgColor,
      variant: "filled",
      size: "md",
    };

    switch (field.type) {
      case '1':
        return <Textarea {...commonInputProps} placeholder={fieldTypeInfo.label} />;
      case '2':
        return <Input type="number" {...commonInputProps} placeholder="0" />;
      case '4':
        return <Input type="date" {...commonInputProps} />;
      case '0':
      default:
        return <Input type="text" {...commonInputProps} placeholder={fieldTypeInfo.label} />;
    }
  };

  if (field.type === '3') {
    return (
      <FormControl id={field.id} display="flex" alignItems="center" py={2} isInvalid={isInvalid}>
        <Checkbox
          isChecked={!!value}
          onChange={handleCheckboxChange}
          colorScheme="teal"
          size="lg"
        >
          <Text ml={2} fontWeight="medium">{field.name}</Text>
        </Checkbox>
        <FormHelperText ml="auto" mt={0}>
          {fieldTypeInfo.description}
        </FormHelperText>
      </FormControl>
    );
  }

  return (
    <FormControl id={field.id} isInvalid={isInvalid} >
      <Tooltip label={fieldTypeInfo.label} placement="top-start" hasArrow>
        <FormLabel htmlFor={field.id} fontWeight="bold">{field.name}</FormLabel>
      </Tooltip>
      {renderField()}
      <FormHelperText>{fieldTypeInfo.description}</FormHelperText>
    </FormControl>
  );
};

export default InputCustomField;