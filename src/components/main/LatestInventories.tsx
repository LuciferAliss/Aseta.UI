import {
  Box,
  Center,
  Heading,
  SimpleGrid,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { ViewInventory } from '../../types/inventory';
import { useInventory } from '../../hooks/useInventory';

const LatestInventories = () => {
  const { t } = useTranslation('global');
  const navigate = useNavigate();
  const { ref, inView } = useInView({ threshold: 0, triggerOnce: false });
  const { getLastInventories } = useInventory();

  const [items, setItems] = useState<ViewInventory[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const fetchInventories = useCallback(async (pageNum: number) => {
    if (isLoading || !hasNextPage) return;
    setIsLoading(true);
    try {
      const response = await getLastInventories({ pageNumber: pageNum, pageSize: 12 });
      setItems(prev => [...prev, ...response.items || []]);
      setPage(prev => prev + 1);
      setHasNextPage(response.hasNextPage);
    } catch (error) {
      console.error("Failed to fetch latest inventories:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasNextPage, getLastInventories, items]);

  useEffect(() => {
    if (inView && !isLoading) {
      fetchInventories(page);
    }
  }, [inView, isLoading, page, fetchInventories]);

  return (
     <Box as="section" borderWidth="1px" borderColor={borderColor} borderRadius="lg" p={4}>
      <Heading as="h2" size="lg" mb={4}>{t('mainPage.latest.title')}</Heading>
      
      <SimpleGrid 
        columns={{ base: 1, sm: 2, md: 3 }} 
        spacing={5} 
        display={{ base: 'grid', lg: 'none' }}
      >
        {items.map((item) => (
          <Box
            key={item.id}
            bg={cardBg}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="md"
            overflow="hidden"
            onClick={() => navigate(`/inventory/${item.id}`)}
            _hover={{ 
              cursor: 'pointer',
              transform: 'translateY(-4px)',
              boxShadow: 'xl',
            }}
            transition="all 0.2s ease-in-out"
          >
            <VStack p={5} align="stretch" spacing={3}>
              <Heading as="h3" size="md" noOfLines={1}>{t('mainPage.table.name')}: {item.name}</Heading>
              <Text fontSize="sm" noOfLines={2}>{t('mainPage.table.description')}: {item.description}</Text>
              <Text fontSize="sm" fontWeight="medium" color="teal.500"> {t('mainPage.table.creatorName')}: {item.creator?.userName}</Text>
              <Text fontSize="sm"> {t('mainPage.table.isPublic')}: {item.isPublic ? t('mainPage.table.yes') : t('mainPage.table.no')}</Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      <TableContainer display={{ base: 'none', lg: 'block' }}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{t('mainPage.table.name')}</Th>
              <Th>{t('mainPage.table.description')}</Th>
              <Th>{t('mainPage.table.creatorName')}</Th>
              <Th>{t('mainPage.table.isPublic')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item) => (
              <Tr
                key={item.id}
                onClick={() => navigate(`/inventory/${item.id}`)}
                _hover={{ bg: hoverBg, cursor: 'pointer' }}
                transition="background-color 0.2s"
              >
                <Td fontWeight="medium">{item.name}</Td>
                <Td>{item.description}</Td>
                <Td>{item.creator?.userName}</Td>
                <Td>{item.isPublic ? t('mainPage.table.yes') : t('mainPage.table.no')}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Center ref={ref} mt={4}>
        {isLoading && <Spinner size="xl" color="teal.500" />}
        {!isLoading && !hasNextPage && items.length > 0 && (
          <Text color="gray.500">{t('mainPage.endOfList')}</Text>
        )}
      </Center>
      
    </Box>
  );
};

export default LatestInventories;