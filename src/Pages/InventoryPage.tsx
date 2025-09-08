import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useInventory } from "../hooks/useInventory";
import type { Inventory } from "../types/inventory";
import { useAuth } from "../hooks/useAuth";
import { Box, Center, Text, Container, Heading, Spinner, Image, Tab, TabList, Flex, TabPanels, Tabs, VStack, Avatar, Divider, Wrap, HStack, Icon, useColorModeValue, Tag, TabPanel } from "@chakra-ui/react";
import Headers from "../components/Header";
import { FiTag, FiClock, FiGrid } from 'react-icons/fi';
import ElementsTab from "../components/inventory/ElementsTab";
import SettingsTab from "../components/inventory/SettingsTab";
import FieldsTab from "../components/inventory/FieldsTab";

const InventoryPage = () => {
  const { t, i18n } = useTranslation('global');
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getInventory, getUserRoleInventory } = useInventory();
  const navigator = useNavigate();
  
  const [userRole, setUserRole] = useState<string>('');
  const [inventory, setInventory] = useState<Inventory>();
  const [isLoading, setIsLoading] = useState(true);

  const [tabIndex, setTabIndex] = useState(0);

  const canEdit = user?.role === 'Admin' || userRole === 'Owner' || userRole === 'Editor';

  const fetchInventory = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getInventory(id);
      setInventory(data);
      if (user) {
        const userRole = await getUserRoleInventory(id);
        setUserRole(userRole);
      }
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
      navigator('/');
    }
  }, [id, getInventory, navigator]);


  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      await fetchInventory();
      setIsLoading(false);
    }
    initialFetch();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language, {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <>
        <Headers />
        <Center w='100%'><Spinner size="xl" /></Center>
      </>
    );
  }

  if (!inventory) {
    return (
      <>
        <Headers />
        <Center h="80vh">
          <Heading>{t('inventoryPage.errors.generic')}</Heading>
        </Center>
      </>
    );
  }

  return (
    <Box w="100%">
      <Headers />
      <Container maxW="container.xl" py={8}>
        
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'center', md: 'flex-start' }}
          gap={6}
          mb={8}
        >
          <Box flexShrink={0}>
            <Image
              src={inventory.imageUrl}
              alt={inventory.name}
              boxSize={{ base: '150px', md: '200px' }}
              objectFit="cover"
              borderRadius="lg"
              boxShadow="lg"
            />
          </Box>

          <VStack align="stretch" spacing={4} w="100%">
            <Heading as="h1" size="2xl">
              {inventory.name}
            </Heading>
            <Text fontSize="lg" color="gray.500">
              {inventory.description}
            </Text>
            
            <Divider borderColor={useColorModeValue('gray.300', 'gray.600')} borderWidth="1px" />

            <Wrap spacingX={6} spacingY={2} color="gray.500" fontSize="sm">
              <HStack>
                <Avatar size="xs" name={inventory.userCreator.userName} />
                <Text>
                  {t('inventoryPage.info.createdBy')}{' '}
                  <Text as="b" color={useColorModeValue('teal.600', 'teal.300')}>
                    {inventory.userCreator.userName}
                  </Text>
                </Text>
              </HStack>
              <HStack>
                <Icon as={FiClock} />
                <Text>{formatDate(inventory.createdAt.toString())}</Text>
              </HStack>
              {inventory.category && (
                <HStack>
                  <Icon as={FiGrid} />
                  <Text>{inventory.category.name}</Text>
                </HStack>
              )}
            </Wrap>

            {inventory.tags && inventory.tags.length > 0 && (
               <HStack spacing={2}>
                 <Icon as={FiTag} color="gray.500"/>
                 {inventory.tags.map(tag => (
                   <Tag key={tag.id} size="md" colorScheme="blue" variant="solid">
                     {tag.name}
                   </Tag>
                 ))}
               </HStack>
            )}
          </VStack>
        </Flex>

        <Tabs colorScheme="teal" isLazy onChange={(index) => setTabIndex(index)} index={tabIndex}>
          <TabList>
            <Tab>{t('inventoryPage.tabs.elements')}</Tab>
            <Tab>{t('inventoryPage.tabs.fields')}</Tab>
            <Tab>{t('inventoryPage.tabs.settings')}</Tab>
            <Tab>{t('inventoryPage.tabs.customId')}</Tab>
            <Tab>{t('inventoryPage.tabs.access')}</Tab>
            <Tab>{t('inventoryPage.tabs.statistics')}</Tab>
          </TabList>            

            
          <TabPanels> 
            <TabPanel>
              {inventory && (
                <ElementsTab 
                  inventoryId={inventory.id} 
                  customFields={inventory.customFieldsDefinition}
                  canEdit={canEdit}
                />
              )}
            </TabPanel>
            <TabPanel>
              {inventory && (
                <FieldsTab customFields={inventory.customFieldsDefinition} 
                  inventoryId={inventory.id}
                  onFieldsUpdate={fetchInventory}  />
              )}
            </TabPanel>
            <TabPanel>
                <SettingsTab inventory={inventory} />
            </TabPanel>
            {/* {isOwner && (
              <TabPanel>
                <CustomIdTab />
              </TabPanel>
            )}
            {isOwner && (
              <TabPanel>
                <AccessTab />
              </TabPanel>
            )}
            
            <TabPanel>
              <StatisticsTab inventory={inventory} />
            </TabPanel> */}
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
};

export default InventoryPage;