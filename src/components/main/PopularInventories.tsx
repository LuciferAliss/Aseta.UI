import {
  Box, Heading, Table, TableContainer, Text, Tbody, Td, Th, Thead, Tr, useColorModeValue, Spinner, Center,
  SimpleGrid,
  VStack
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { ViewInventory } from '../../types/inventory';
import { useEffect, useState } from 'react';
import { useInventory } from '../../hooks/useInventory';

const PopularInventories = () => {
  const { t } = useTranslation('global');
  const navigate = useNavigate();
  const { getMostPopularInventories } = useInventory();
  
  const [isLoading, setIsLoading] = useState(false);

  const [popularItems, setPopularItems] = useState<ViewInventory[]>([]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      setIsLoading(true);
      try {
        const popularData = await getMostPopularInventories(5);
        setPopularItems(popularData.collection);
      } catch (error) {
        console.error("Failed to fetch sidebar data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSidebarData();
  }, []);

  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (isLoading) {
    return (
      <Box as="section" borderWidth="1px" borderColor={borderColor} borderRadius="lg" p={4}>
        <Heading as="h2" size="md" mb={4}>{t('mainPage.popular.title')}</Heading>
        <Center>
          <Spinner size="xl" color="teal.500" />
        </Center>
      </Box>
    )
  }

  return (
    <Box as="section" borderWidth="1px" borderColor={borderColor} borderRadius="lg" p={4}>
      <Heading as="h2" size="md" mb={4}>{t('mainPage.popular.title')}</Heading>
              
      <TableContainer display={{ base: 'none', lg: 'block' }}>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>{t('mainPage.popular.name')}</Th>
              <Th>{t('mainPage.popular.creatorName')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {popularItems.map((item, index) => (
              <Tr
                key={item.id}
                onClick={() => navigate(`/inventory/${item.id}`)}
                _hover={{ bg: hoverBg, cursor: 'pointer' }}
                transition="background-color 0.2s"
              >
                <Td>{index + 1}</Td>
                <Td fontWeight="medium">{item.name}</Td>
                <Td>{item.creator.userName}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <SimpleGrid 
        columns={{ base: 1, sm: 2, md: 3 }} 
        spacing={5} 
        display={{ base: 'grid', lg: 'none' }}
      >
        {popularItems.map((item) => (
          <Box
            key={item.id}
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
              <Heading as="h3" size="md" noOfLines={1}>{item.name}</Heading>
              <Text fontSize="sm" noOfLines={2}>{item.description}</Text>
              <Text fontSize="sm" fontWeight="medium" color="teal.500">{item.creator.userName}</Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
      
    </Box>
  );
};

export default PopularInventories;