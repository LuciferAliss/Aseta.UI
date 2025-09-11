import { useMemo, useState } from 'react';
import type { CustomFieldDefinition, UpdateCustomFieldsRequest } from '../../types/inventory';
import {
  Box,
  Text,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Select,
  Spacer,
  VStack,
  Center,
  Spinner,
  Tooltip,
  Icon,
  useToast
} from '@chakra-ui/react';
import { DeleteIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { useInventory } from '../../hooks/useInventory';

interface FieldsTabProps {
  customFields: CustomFieldDefinition[];
  inventoryId: string;
  onFieldsUpdate: () => void; 
}

const FieldsTab = ({ customFields, inventoryId, onFieldsUpdate }: FieldsTabProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const { t } =   useTranslation('global');
  const toast = useToast();

  const { updateCustomFields } = useInventory();

  const [newFieldType, setNewFieldType] = useState('0');
  const [newFieldName, setNewFieldName] = useState('');

  const FIELD_TYPES = useMemo(() => [
    { value: '0', label: t('inventoryPage.fields.text'), description: t('inventoryPage.fields.textDescription') },
    { value: '1', label: t('inventoryPage.fields.textarea'), description: t('inventoryPage.fields.textareaDescription') },
    { value: '2', label: t('inventoryPage.fields.number'), description: t('inventoryPage.fields.numberDescription') },
    { value: '3', label: t('inventoryPage.fields.checkbox'), description: t('inventoryPage.fields.checkboxDescription') },
    { value: '4', label: t('inventoryPage.fields.date'), description: t('inventoryPage.fields.dateDescription') },
  ], [t]);

  const selectedFieldTypeInfo = useMemo(() =>
    FIELD_TYPES.find(type => type.value === newFieldType), [newFieldType, FIELD_TYPES]);

  const handleAddField = async () => {
    if (!newFieldName.trim()) {
      toast({
        title: t('createPage.toast.validationErrorTitle'),
        description: t('inventoryPage.fieldsTab.nameRequired'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const existingFieldsForRequest = customFields.map(field => ({
      id: field.id,
      name: field.name,
      type: field.type, 
    }));

    const newFieldForRequest: CustomFieldDefinition = {
      id: '',
      name: newFieldName.trim(),
      type: newFieldType,
    };

    const payload: UpdateCustomFieldsRequest = {
      inventoryId: inventoryId,
      customFields: [...existingFieldsForRequest, newFieldForRequest],
    };

    setIsSaving(true);
    try {
      await updateCustomFields(payload);

      toast({
        title: t('inventoryPage.fieldsTab.toast.successTitle'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setNewFieldName('');
      setNewFieldType('0');
      onFieldsUpdate(); 
      
    } catch (error) {
      toast({
        title: t('createPage.toast.errorTitle'),
        description: (error as Error).message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteField = async (fieldIdToDelete: string) => {
    const remainingFields = customFields.filter(field => field.id !== fieldIdToDelete);

    const fieldsForRequest = remainingFields.map(field => ({
      id: field.id,
      name: field.name,
      type: field.type,
    }));

    const payload: UpdateCustomFieldsRequest = {
      inventoryId: inventoryId,
      customFields: fieldsForRequest,
    };

    setIsSaving(true);
    try {
      await updateCustomFields(payload);
      
      toast({
        title: t('inventoryPage.fieldsTab.toast.successDeleteTitle'),
        status: 'info',
        duration: 3000,
        isClosable: true,
      });

      onFieldsUpdate();
    } catch (error) {
        toast({
        title: t('createPage.toast.errorTitle'),
        description: (error as Error).message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!customFields) {
      return <Center w='100%'><Spinner size="xl" /></Center>;
  }

  return (
    <Box p={{ base: 3, md: 6 }}>
      <VStack spacing={8} align="stretch">
        <Box p={{ base: 4, md: 6 }} borderWidth="1px" borderRadius="lg" boxShadow="sm">
          <Heading as="h3" size="md" mb={6}>
            {t('inventoryPage.fieldsTab.heading')}
          </Heading>
          <fieldset disabled={isSaving}>
            <Flex direction={{ base: 'column', md: 'row' }} gap={4} align={{ base: 'stretch', md: 'flex-end' }}>
              <FormControl isRequired flex="1">
                <FormLabel>{t('inventoryPage.fieldsTab.fieldName')}</FormLabel>
                <Input
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder={t('inventoryPage.fieldsTab.fieldNamePlaceholder')}
                />
              </FormControl>

              <FormControl w={{ base: '100%', md: '250px' }}>
                <Flex align="center">
                  <FormLabel mb="0">{t('inventoryPage.fieldsTab.fieldType')}</FormLabel>
                  {selectedFieldTypeInfo?.description && (
                    <Tooltip label={selectedFieldTypeInfo.description} placement="top" fontSize="md">
                      <Icon as={InfoOutlineIcon} color="gray.400" ml={2} cursor="pointer" />
                    </Tooltip>
                  )}
                </Flex>
                <Select value={newFieldType} onChange={(e) => setNewFieldType(e.target.value)}>
                  {FIELD_TYPES.map(fieldType => (
                    <option key={fieldType.value} value={fieldType.value}>
                      {fieldType.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              
              <Button
                onClick={handleAddField}
                isLoading={isSaving}
                loadingText={t('settings.statusSaving')} 
                colorScheme="blue"
                minW="120px"
              >
                {t('inventoryPage.fieldsTab.addField')}
              </Button>
            </Flex>
          </fieldset>
        </Box>

        <Box>
          <Heading as="h3" size="md" mb={6}>
            {t('inventoryPage.fieldsTab.createdFields')}
          </Heading>
          {customFields.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {customFields.map(field => (
                <Flex key={field.id} p={4} borderWidth="1px" borderRadius="lg" align="center" opacity={isSaving ? 0.6 : 1}>
                  <Box>
                    <Text fontWeight="bold">{field.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {FIELD_TYPES.find(ft => ft.value === String(field.type))?.label || 'Unknown Type'}
                    </Text>
                  </Box>
                  <Spacer />
                  <IconButton
                    aria-label={t('inventoryPage.fieldsTab.deleteAriaLabel', { fieldName: field.name })} 
                    icon={<DeleteIcon />}
                    variant="ghost"
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDeleteField(field.id)}
                    isDisabled={isSaving}
                  />
                </Flex>
              ))}
            </VStack>
          ) : (
            <Text color="gray.500">
              {t('inventoryPage.fieldsTab.noFields')}
            </Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default FieldsTab;