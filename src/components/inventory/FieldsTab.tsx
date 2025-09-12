import { useMemo, useRef, useState } from 'react';
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
  useToast,
  useColorModeValue,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  useDisclosure,
  AlertDialogFooter
} from '@chakra-ui/react';
import { DeleteIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { useInventory } from '../../hooks/useInventory';
import { FiPlusSquare } from 'react-icons/fi';

interface FieldsTabProps {
  customFields: CustomFieldDefinition[];
  inventoryId: string;
  onFieldsUpdate: () => void;
  canEdit: boolean;
}

const EmptyFieldsState = () => {
  const { t } = useTranslation('global');
  return (
    <Center p={10} borderWidth="2px" borderStyle="dashed" borderRadius="lg" bg={useColorModeValue('gray.50', 'gray.800')}>
      <VStack spacing={4}>
        <Icon as={FiPlusSquare} boxSize={12} color="gray.400" />
        <Heading as="h4" size="md" textAlign="center">{t('inventoryPage.fieldsTab.empty.title')}</Heading>
        <Text color="gray.500" textAlign="center">{t('inventoryPage.fieldsTab.empty.description')}</Text>
      </VStack>
    </Center>
  );
};

const FieldsTab = ({ customFields, inventoryId, onFieldsUpdate, canEdit }: FieldsTabProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslation('global');
  const toast = useToast();

  const { updateCustomFields } = useInventory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  
  const [fieldIdToDelete, setFieldIdToDelete] = useState<string | null>(null);
  const [newFieldType, setNewFieldType] = useState('0');
  const [newFieldName, setNewFieldName] = useState('');

  const inputBgColor = useColorModeValue('gray.100', 'gray.600');
  const focusBorderColor = 'teal.500';
  const cardBg = useColorModeValue('white', 'gray.700');
  const listBg = useColorModeValue('gray.50', 'gray.800');

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

  const openDeleteConfirmation = (fieldId: string) => {
    setFieldIdToDelete(fieldId);
    onOpen();
  };

  const handleDeleteField = async () => {
    if (!fieldIdToDelete) return;

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
      onClose();
      setFieldIdToDelete(null);
    }
  };

  if (!customFields) {
    return <Center w='100%'><Spinner size="xl" /></Center>;
  }

  return (
    <Box p={{ base: 2, md: 6 }}>
      <VStack spacing={8} align="stretch">

        {canEdit && (
          <Box p={{ base: 4, md: 6 }} borderWidth="1px" borderRadius="lg" boxShadow="md" bg={cardBg}>
            <Heading as="h3" size="md" mb={6}>
              {t('inventoryPage.fieldsTab.heading')}
            </Heading>
            <fieldset disabled={isSaving}>
              <Flex direction={{ base: 'column', md: 'row' }} gap={4} align={{ base: 'stretch', md: 'flex-end' }}>
                <FormControl isRequired flex="1">
                  <FormLabel>{t('inventoryPage.fieldsTab.fieldName')}</FormLabel>
                  <Input
                    bg={inputBgColor}
                    focusBorderColor={focusBorderColor}
                    value={newFieldName}
                    variant="filled"
                    size="md"
                    onChange={(e) => setNewFieldName(e.target.value)}
                    placeholder={t('inventoryPage.fieldsTab.fieldNamePlaceholder')}
                  />
                </FormControl>

                <FormControl w={{ base: '100%', md: '250px' }}>
                  <Flex align="center">
                    <FormLabel mb="0">{t('inventoryPage.fieldsTab.fieldType')}</FormLabel>
                    {selectedFieldTypeInfo?.description && (
                      <Tooltip label={selectedFieldTypeInfo.description} placement="top" fontSize="md" hasArrow>
                        <Icon as={InfoOutlineIcon} color="gray.400" ml={2} cursor="pointer" />
                      </Tooltip>
                    )}
                  </Flex>
                  <Select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value)}
                    bg={inputBgColor}
                    focusBorderColor={focusBorderColor}
                    variant="filled"
                    size="md"
                  >
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
                  loadingText={t('inventoryPage.fieldsTab.actions.saving')}
                  colorScheme="teal"
                  minW={{ base: "auto", md: "120px" }}
                >
                  {t('inventoryPage.fieldsTab.addField')}
                </Button>
              </Flex>
            </fieldset>
          </Box>
        )}

        <Box>
          <Heading as="h3" size="md" mb={canEdit ? 6 : 0}>
            {t('inventoryPage.fieldsTab.createdFields')}
          </Heading>
          {customFields.length > 0 ? (
            <VStack
              spacing={4}
              align="stretch"
              p={{ base: 4, md: 0 }}
              bg={{ base: listBg, md: 'transparent' }}
              borderRadius={{ base: 'lg', md: 'none' }}
            >
              {customFields.map(field => (
                <Flex
                  key={field.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  align="center"
                  bg={{ base: cardBg, md: 'transparent' }}
                  boxShadow={{ base: 'sm', md: 'none' }}
                  opacity={isSaving ? 0.6 : 1}
                  transition="opacity 0.2s"
                >
                  <Box>
                    <Text fontWeight="bold">{field.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {FIELD_TYPES.find(ft => ft.value === String(field.type))?.label || 'Unknown Type'}
                    </Text>
                  </Box>
                  <Spacer />
                  {canEdit && (
                    <IconButton
                      aria-label={t('inventoryPage.fieldsTab.deleteAriaLabel', { fieldName: field.name })}
                      icon={<DeleteIcon />}
                      variant="ghost"
                      colorScheme="red"
                      size="sm"
                      onClick={() => openDeleteConfirmation(field.id)}
                      isDisabled={isSaving}
                    />
                  )}
                </Flex>
              ))}
            </VStack>
          ) : (
            <EmptyFieldsState />
          )}
        </Box>
      </VStack>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('inventoryPage.fieldsTab.deleteDialog.title')}
            </AlertDialogHeader>
            <AlertDialogBody>
              {t('inventoryPage.fieldsTab.deleteDialog.body')}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} isDisabled={isSaving}>
                {t('inventoryPage.fieldsTab.deleteDialog.cancel')}
              </Button>
              <Button colorScheme="red" onClick={handleDeleteField} ml={3} isLoading={isSaving}>
                {t('inventoryPage.fieldsTab.deleteDialog.confirm')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

    </Box>
  );
};

export default FieldsTab;