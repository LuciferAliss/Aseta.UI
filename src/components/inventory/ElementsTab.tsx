import {
  Box, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Spinner, Center, useColorModeValue
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import type { CustomFieldDefinition, InventoryItem, CustomFieldValue } from '../../types/inventory';
import { useInView } from 'react-intersection-observer';
import { useInventory } from '../../hooks/useInventory';

interface ElementsTabProps {
  inventoryId: string;
  customFields: CustomFieldDefinition[];
}

const ElementsTab = ({ inventoryId, customFields }: ElementsTabProps) => {
  const { t, i18n } = useTranslation('global');
  const navigate = useNavigate();
  const { ref, inView } = useInView({ threshold: 0, triggerOnce: false });
  const { getItems } = useInventory();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  const fetchItems = useCallback(async (pageNum: number) => {
    if (isLoading || !hasNextPage) return;
    setIsLoading(true);
    try {
      const response = await getItems({ pageNumber: pageNum, pageSize: 12 }, inventoryId);
      setItems(prev => [...prev, ...response.items]);
      setPage(prev => prev + 1);
      setHasNextPage(response.hasNextPage);
    } catch (error) {
      console.error("Failed to fetch latest inventories:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasNextPage, getItems, items]);

  useEffect(() => {
    if (inView && !isLoading) {
      fetchItems(page);
    }
  }, [inView, isLoading, page, fetchItems]);

  // useEffect(() => {
    
  //   fat


    
  // }, [inventoryId]);
  
  const getCustomFieldValue = (item: InventoryItem, fieldId: string) : string | number | boolean | null => {
    const fieldValue = item.customFields.find(cfv => cfv.fieldId === fieldId);
    return fieldValue ? fieldValue.value : null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language, {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };


  return (
    <Box>
      <Button leftIcon={<AddIcon />} colorScheme="teal" mb={4}>
        {t('inventoryPage.elements.addItem')}
      </Button>
      {isLoading ? <Center><Spinner /></Center> : (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>{t('inventoryPage.elements.tableName')}</Th>
                {customFields.map((field) => (
                  <Th key={field.id}>{field.name}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {items.map((item) => (
                <Tr 
                  key={item.id}  
                  cursor="pointer" 
                  _hover={{ bg: hoverBg }}
                >
                  {customFields.map((field) => {
                    const value = getCustomFieldValue(item, field.id);
                    return (
                      <Td key={`${item.id}-${field.id}`}>
                        {value !== null ? String(value) : '—'}
                      </Td>
                    );
                  })}
                  <Td fontWeight="medium">{formatDate(item.createdAt.toString())}</Td>
                  <Td fontWeight="medium">{formatDate(item.updatedAt.toString())}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ElementsTab;