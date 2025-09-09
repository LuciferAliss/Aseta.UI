import {
  Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Spinner, Center,
  useColorModeValue, Text, Checkbox, Flex, Button, Spacer, Menu, MenuButton,
  MenuList, MenuItem, IconButton, useToast, AlertDialog, AlertDialogBody,
  AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useDisclosure
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState, useRef } from 'react';
import type { CustomFieldDefinition, InventoryItem } from '../../types/inventory';
import { useInView } from 'react-intersection-observer';
import { useInventory } from '../../hooks/useInventory';
import { useNavigate } from 'react-router-dom';

// 1. Определяем интерфейс пропсов с флагом для прав доступа
interface ElementsTabProps {
  inventoryId: string;
  customFields: CustomFieldDefinition[];
  canEdit: boolean;
}

const ElementsTab = ({ inventoryId, customFields, canEdit }: ElementsTabProps) => {
  const { t, i18n } = useTranslation('global');
  const { ref, inView } = useInView({ threshold: 0 });
  
  const { getItems, deleteItems } = useInventory();
  const navigate = useNavigate();
  const toast = useToast();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  
  const [isListLoading, setIsListLoading] = useState(true); 
  const [isActionLoading, setIsActionLoading] = useState(false); 
  
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [itemIdsToDelete, setItemIdsToDelete] = useState<string[]>([]);

  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  const fetchItems = useCallback(async (pageNum: number, refresh = false) => {
    if (isListLoading && !refresh) return;
    setIsListLoading(true);
    try {
      const response = await getItems({ pageNumber: pageNum, pageSize: 20 }, inventoryId);
      setItems(prev => refresh ? response.items : [...prev, ...response.items || []]);
      setPage(pageNum + 1);
      setHasNextPage(response.hasNextPage);
    } catch (error) {
      toast({
        title: t('createPage.toast.errorTitle'),
        description: (error as Error).message,
        status: 'error',
        isClosable: true,
      });
    } finally {
      setIsListLoading(false);
    }
  }, [getItems, inventoryId, isListLoading, t, toast]);
  
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasNextPage(true);
    setSelectedItems([]);
    fetchItems(1, true);
  }, [inventoryId]); 

  useEffect(() => {
    if (inView && !isListLoading && hasNextPage) {
      fetchItems(page);
    }
  }, [inView, isListLoading, hasNextPage, page, fetchItems]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(items.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const confirmDelete = (ids: string[]) => {
    setItemIdsToDelete(ids);
    onOpen();
  };

  const handleDelete = async () => {
    onClose();
    setIsActionLoading(true);
    try {
      await deleteItems({ itemIds: itemIdsToDelete });
      toast({
        title: "Элементы успешно удалены",
        status: "success",
        isClosable: true,
      });
      fetchItems(1, true);
      setSelectedItems([]);
    } catch (error) {
      toast({
        title: t('createPage.toast.errorTitle'),
        description: (error as Error).message,
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsActionLoading(false);
      setItemIdsToDelete([]);
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(i18n.language);

  const isAllSelected = items.length > 0 && selectedItems.length === items.length;
  const isIndeterminate = selectedItems.length > 0 && !isAllSelected;

  return (
    <Box>
      {canEdit && (
        <Flex mb={4} gap={4}>
          <Button 
            leftIcon={<AddIcon />} 
            colorScheme="teal"
            onClick={() => navigate(`/inventory/${inventoryId}/items/new`)}
            isDisabled={isActionLoading}
          >
            {t('inventoryPage.elements.addItem')}
          </Button>
          <Spacer />
          {selectedItems.length > 0 && (
            <Button 
              leftIcon={<DeleteIcon />} 
              colorScheme="red"
              onClick={() => confirmDelete(selectedItems)}
              isLoading={isActionLoading}
            >
              Удалить ({selectedItems.length})
            </Button>
          )}
        </Flex>
      )}

      {items.length === 0 && isListLoading ? <Center p={10}><Spinner size="xl"/></Center> : (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                {canEdit && (
                  <Th width="1%" paddingRight={2}>
                    <Checkbox
                      isChecked={isAllSelected}
                      isIndeterminate={isIndeterminate}
                      onChange={handleSelectAll}
                      isDisabled={isActionLoading || items.length === 0}
                    />
                  </Th>
                )}
                <Th>{t('inventoryPage.elementsTab.customId')}</Th>
                {customFields.map((field) => ( <Th key={field.id}>{field.name}</Th> ))}
                <Th>{t('inventoryPage.elementsTab.createdAt')}</Th>
                <Th>{t('inventoryPage.elementsTab.updatedBy')}</Th>
                {canEdit && <Th>Действия</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {items.map((item) => (
                <Tr 
                  key={item.id}  
                  _hover={{ bg: hoverBg }}
                  bg={selectedItems.includes(item.id) ? 'teal.50' : 'transparent'}
                  opacity={isActionLoading ? 0.6 : 1}
                >
                  {canEdit && (
                    <Td paddingRight={2}>
                      <Checkbox
                        isChecked={selectedItems.includes(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        isDisabled={isActionLoading}
                      />
                    </Td>
                  )}
                  <Td>{item.customId}</Td>
                  {customFields.map((field) => (
                    <Td key={`${item.id}-${field.id}`}>{String(item.customFields.find(cf => cf.fieldId === field.id)?.value ?? '—')}</Td>
                  ))}
                  <Td>{formatDate(item.createdAt.toString())}</Td>
                  <Td>{item.userUpdate.userName}</Td>
                  {canEdit && (
                    <Td>
                      <Menu>
                        <MenuButton as={IconButton} aria-label="Действия" icon={<ChevronDownIcon />} variant="ghost" size="sm" isDisabled={isActionLoading}/>
                        <MenuList>
                          <MenuItem 
                            icon={<EditIcon />}
                            onClick={() => navigate(`/inventory/${inventoryId}/items/${item.id}/edit`)}
                          >
                            Редактировать
                          </MenuItem>
                          <MenuItem 
                            icon={<DeleteIcon />} 
                            color="red.500"
                            onClick={() => confirmDelete([item.id])}
                          >
                            Удалить
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <Center ref={ref} mt={4} h="40px">
        {isListLoading && items.length > 0 && <Spinner color="teal.500" />}
        {!hasNextPage && items.length > 0 && (
          <Text color="gray.500">{t('mainPage.endOfList')}</Text>
        )}
      </Center>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Подтверждение удаления
            </AlertDialogHeader>
            <AlertDialogBody>
              Вы уверены, что хотите удалить {itemIdsToDelete.length} элемент(а)? Это действие необратимо.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} isDisabled={isActionLoading}>
                Отмена
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3} isLoading={isActionLoading}>
                Удалить
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ElementsTab;