import {
  Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Spinner, Center,
  useColorModeValue, Text, Checkbox, Flex, Button, Spacer, Menu, MenuButton,
  MenuList, MenuItem, IconButton, useToast, AlertDialog, AlertDialogBody,
  AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useDisclosure,
  SkeletonText,
  VStack,
  Icon,
  Heading,
  Tooltip
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState, useRef } from 'react';
import type { CustomFieldDefinition, InventoryItem } from '../../types/inventory';
import { useInView } from 'react-intersection-observer';
import { useInventory } from '../../hooks/useInventory';
import { useNavigate } from 'react-router-dom';
import { FiInbox } from 'react-icons/fi';

interface ElementsTabProps {
  inventoryId: string;
  customFields: CustomFieldDefinition[];
  canEdit: boolean;
}

const TableSkeleton = () => (
  <TableContainer>
    <Table variant="simple">
      <Thead>
        <Tr>
          {[...Array(5)].map((_, i) => <Th key={i}><SkeletonText noOfLines={1} skeletonHeight="20px" /></Th>)}
        </Tr>
      </Thead>
      <Tbody>
        {[...Array(3)].map((_, i) => (
          <Tr key={i}>
            {[...Array(5)].map((_, j) => <Td key={j}><SkeletonText noOfLines={1} /></Td>)}
          </Tr>
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);

const EmptyState = ({ onAddItem }: { onAddItem: () => void }) => {
  const { t } = useTranslation('global');
  return (
    <Center p={10} borderWidth="2px" borderStyle="dashed" borderRadius="md" bg={useColorModeValue('gray.50', 'gray.700')}>
      <VStack spacing={4}>
        <Icon as={FiInbox} boxSize={12} color="gray.400" />
        <Heading as="h3" size="md">{t('inventoryPage.elementsTab.empty.title')}</Heading>
        <Text color="gray.500">{t('inventoryPage.elementsTab.empty.description')}</Text>
        <Button 
          leftIcon={<AddIcon />} 
          colorScheme="teal"
          onClick={onAddItem}
        >
          {t('inventoryPage.elementsTab.actions.addFirstItem')}
        </Button>
      </VStack>
    </Center>
  );
};

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
  const selectedBg = useColorModeValue('teal.50', 'teal.900');

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
        title: t('inventoryPage.createPage.toast.errorTitle'),
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
      await deleteItems({ itemIds: itemIdsToDelete }, inventoryId);
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

  const handleAddItemClick = () => navigate(`/inventory/${inventoryId}/items/new`);

  if (isListLoading && items.length === 0) {
    return <TableSkeleton />;
  }
  
  if (!isListLoading && items.length === 0 && canEdit) {
    return <EmptyState onAddItem={handleAddItemClick} />;
  }

  return (
    <Box>
      
      {canEdit && (
        <Flex mb={4} gap={4} wrap="wrap">
          <Button 
              leftIcon={<AddIcon />} 
              colorScheme="teal"
              onClick={handleAddItemClick}
              isDisabled={isActionLoading}
            >
              {t('inventoryPage.elementsTab.actions.addItem')}
            </Button>
          <Spacer />
          {selectedItems.length > 0 && (
            <Button 
              leftIcon={<DeleteIcon />} 
              colorScheme="red"
              onClick={() => confirmDelete(selectedItems)}
              isLoading={isActionLoading}
            >
              {t('inventoryPage.elementsTab.actions.deleteSelected', { count: selectedItems.length })}
            </Button>
          )}
        </Flex>
      )}

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              {canEdit && (
                <Th width="1%" paddingRight={2}>
                  <Checkbox
                    colorScheme="teal"
                    isChecked={isAllSelected}
                    isIndeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                    isDisabled={isActionLoading || items.length === 0}
                  />
                </Th>
              )}
              <Th>{t('inventoryPage.elementsTab.table.header.customId')}</Th>
              {customFields.map((field) => ( <Th key={field.id}>{field.name}</Th> ))}
              <Th>{t('inventoryPage.elementsTab.table.header.createdAt')}</Th>
              <Th>{t('inventoryPage.elementsTab.table.header.updatedBy')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item) => (
              <Tr 
                cursor='pointer'
                key={item.id}  
                _hover={{ bg: hoverBg }}
                bg={selectedItems.includes(item.id) ? selectedBg : 'transparent'}
                opacity={isActionLoading ? 0.6 : 1}
                transition="background-color 0.2s, opacity 0.2s"
              >
                {canEdit && (
                  <Td paddingRight={2}>
                    <Checkbox
                      colorScheme="teal"
                      isChecked={selectedItems.includes(item.id)}
                      onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                      isDisabled={isActionLoading}
                    />
                  </Td>
                )}
                <Td>
                  <Tooltip label={item.customId} placement="top" >
                    <Text noOfLines={1} maxW='130px'>
                      {item.customId}
                    </Text>
                  </Tooltip>
                </Td>
                {customFields.map((field) => {
                  const cellValue = String(item.customFields.find(cf => cf.fieldId === field.id)?.value ?? '—');
                  
                  return (
                    <Td key={`${item.id}-${field.id}`} maxW="180px">
                      <Text noOfLines={1} >
                        {cellValue}
                      </Text>
                    </Td>
                  );
                })}
                <Td>{formatDate(item.createdAt.toString())}</Td>
                <Td maxW="150px">
                  <Tooltip label={item.userUpdate.userName} placement="top" >
                    <Text noOfLines={1}>
                      {item.userUpdate.userName}
                    </Text>
                  </Tooltip>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Center ref={ref} mt={4} h="40px">
        {isListLoading && items.length > 0 && <Spinner color="teal.500" />}
        {!hasNextPage && items.length > 0 && (
          <Text color="gray.500">{t('inventoryPage.elementsTab.endOfList')}</Text>
        )}
      </Center>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('inventoryPage.elementsTab.deleteDialog.title')}
            </AlertDialogHeader>
            <AlertDialogBody>
              {t('inventoryPage.elementsTab.deleteDialog.body', { count: itemIdsToDelete.length })}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} isDisabled={isActionLoading}>
                {t('inventoryPage.elementsTab.deleteDialog.cancel')}
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3} isLoading={isActionLoading}>
                {t('inventoryPage.elementsTab.deleteDialog.confirm')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ElementsTab;