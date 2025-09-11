import { Box, Button, Flex, Tooltip, Container, FormControl, Heading, Skeleton, useToast, VStack, useColorModeValue } from "@chakra-ui/react"
import Headers from "../Header"
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { type CreateItemRequest, type CustomFieldValueRequest, type Inventory } from "../../types/inventory";
import { useInventory } from "../../hooks/useInventory";
import InputCustomField from "./InputCustomFieldProps";

const FormSkeleton = () => (
  <VStack spacing={6} align="stretch">
    {[...Array(3)].map((_, i) => (
      <FormControl key={i}>
        <Skeleton height="20px" width="120px" mb={2} borderRadius="md" />
        <Skeleton height="40px" borderRadius="md" />
      </FormControl>
    ))}
  </VStack>
);

const CreateItem = () => {
  const { t } = useTranslation('global');
  const { getInventory, createItem } = useInventory();  
  const navigator = useNavigate();
  const toast = useToast();

  const { id: inventoryId } = useParams<{ id: string }>();

  const [inventory, setInventory] = useState<Inventory>();
  const [customFieldValues, setCustomFieldValues] = useState<{ [key: string]: any }>({});
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const cardBg = useColorModeValue('white', 'gray.700');

  const fetchInventory = useCallback(async () => {
    if (!inventoryId) return;
    try {
      const data = await getInventory(inventoryId);
      setInventory(data);
    } catch (err) {
      toast({
        title: t('createPage.toast.errorTitle'),
        description: (err as Error).message,
        status: 'error',
        isClosable: true,
      });
      navigator(`/inventory/${inventoryId}`);
    }
  }, [inventoryId, getInventory, navigator, t, toast]);

  useEffect(() => {
    setIsLoading(true);
    fetchInventory().finally(() => setIsLoading(false));
  }, [fetchInventory]);

  const handleCustomFieldChange = useCallback((fieldId: string, value: any) => {
    setCustomFieldValues(prevValues => ({
      ...prevValues,
      [fieldId]: value,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryId) return;

    setIsSubmitting(true);

    const customFieldsPayload: CustomFieldValueRequest[] = Object.entries(customFieldValues)
      .map(([fieldId, value]) => ({
        fieldId: fieldId, 
        value: String(value ?? ''),
      }));

    const requestPayload: CreateItemRequest = {
      inventoryId: inventoryId,
      customFields: customFieldsPayload,
    };

    try {
      await createItem(requestPayload);
      toast({
        title: t('inventoryPage.elementsTab.createItem.toast.successTitle'),
        status: "success",
        isClosable: true,
      });
      navigator(`/inventory/${inventoryId}`);
    } catch (error) {
      toast({
        title: t('createPage.toast.errorTitle'),
        description: (error as Error).message,
        status: 'error',
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box w={'100%'} overflowX="hidden">
      <Headers /> 
      <Container maxW="container.md" py={{ base: 4, md: 8 }}>
        <Box
          bg={cardBg}
          borderWidth="1px"
          borderRadius="lg"
          p={{ base: 4, sm: 6, md: 8 }}
          boxShadow="lg"
        >
          <VStack as="form" onSubmit={handleSubmit} spacing={6} align="stretch">
            <Heading as="h1" size="lg" textAlign="center" mb={4}>
              {t('inventoryPage.elementsTab.createItem.title', { inventoryName: inventory?.name || '...' })}
            </Heading>

            {isLoading ? (
              <FormSkeleton />
            ) : (
              inventory?.customFieldsDefinition.map((field) => (
                <InputCustomField
                  key={field.id}
                  field={field}
                  value={customFieldValues[field.id]}
                  onChange={handleCustomFieldChange}
                />
              ))
            )}
            
            <Flex direction={{ base: 'column-reverse', sm: 'row' }} gap={3} justifyContent="flex-end" pt={4}>
              <Tooltip label={t('inventoryPage.elementsTab.createItem.tooltips.cancel')} hasArrow>
                <Button
                  variant="ghost"
                  onClick={() => navigator(`/inventory/${inventoryId}`)}
                  isDisabled={isSubmitting}
                >
                  {t('inventoryPage.elementsTab.createItem.actions.cancel')}
                </Button>
              </Tooltip>
              <Tooltip label={t('inventoryPage.elementsTab.createItem.tooltips.create')} hasArrow>
                <Button
                  type="submit"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  loadingText={t('inventoryPage.elementsTab.createItem.actions.submitting')}
                  isDisabled={isLoading || isSubmitting}
                >
                  {t('inventoryPage.elementsTab.createItem.actions.create')}
                </Button>
              </Tooltip>
            </Flex>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default CreateItem;