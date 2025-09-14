import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useInventory } from "../hooks/useInventory";
import type { Inventory } from "../types/inventory";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  Center,
  Text,
  Container,
  Heading,
  Spinner,
  Image,
  Tab,
  TabList,
  Flex,
  TabPanels,
  Tabs,
  VStack,
  Avatar,
  Divider,
  Wrap,
  HStack,
  Icon,
  useColorModeValue,
  Tag,
  TabPanel,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons';
import Headers from "../components/Header";
import { FiTag, FiClock, FiGrid } from 'react-icons/fi';
import ElementsTab from "../components/inventory/ElementsTab";
import SettingsTab from "../components/inventory/SettingsTab";
import FieldsTab from "../components/inventory/FieldsTab";
import CustomIdTab from "../components/inventory/CustomIdTab";

const InventoryPage = () => {
  const { t, i18n } = useTranslation('global');
  const { id } = useParams < { id: string } > ();
  const { isAuthenticated, user } = useAuth();
  const { getInventory, getUserRoleInventory } = useInventory();
  const navigator = useNavigate();

  const [inventory, setInventory] = useState<Inventory>();
  const [isLoading, setIsLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [hasEditorAccess, setHasEditorAccess] = useState(false);
  const [hasOwnerAccess, setHasOwnerAccess] = useState(false);

  const dividerBorderColor = useColorModeValue('gray.300', 'gray.600');
  const createdByColor = useColorModeValue('teal.600', 'teal.300');

  const isMobile = useBreakpointValue( { base: true, md: false } );

  const fetchInventory = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getInventory(id);
      setInventory(data);
      if (isAuthenticated) {
        const newRole = await getUserRoleInventory(id);
        setHasEditorAccess(newRole === 'Owner' || user?.role === 'Admin' || newRole === 'Editor');
        setHasOwnerAccess(newRole === 'Owner' || user?.role === 'Admin');
      }
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
      navigator('/');
    }
  }, [id, getInventory, navigator, getUserRoleInventory, isAuthenticated]);

  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      await fetchInventory();
      setIsLoading(false);
    }
    initialFetch();
  }, [id, fetchInventory]);

  const allTabs = [
    {
      key: 'elements',
      label: t('inventoryPage.tabs.elements'),
      hasAccess: true,
      component: inventory && (
        <ElementsTab
          inventoryId={inventory.id}
          customFields={inventory.customFieldsDefinition}
          canEdit={hasEditorAccess}
        />
      ),
    },
    {
      key: 'fields',
      label: t('inventoryPage.tabs.fields'),
      hasAccess: hasOwnerAccess, 
      component: inventory && hasOwnerAccess && (
        <FieldsTab
          customFields={inventory.customFieldsDefinition}
          inventoryId={inventory.id}
          onFieldsUpdate={fetchInventory}
          canEdit={hasOwnerAccess} 
        />
      ),
    },
    {
      key: 'customId',
      label: t('inventoryPage.tabs.customId'),
      hasAccess: hasOwnerAccess,
      component: inventory && hasOwnerAccess && (
        <CustomIdTab 
          inventoryId={inventory.id} 
          initialRules={inventory?.customIdRules} 
          onUpdate={fetchInventory} 
        />
      ),
    },
    {
      key: 'settings',
      label: t('inventoryPage.tabs.settings'),
      hasAccess: true,
      component: inventory && <SettingsTab inventory={inventory}/>,
    },
    {
      key: 'access',
      label: t('inventoryPage.tabs.access'),
      hasAccess: hasOwnerAccess, 
      component: <Text>Access Tab (в разработке)</Text>, 
    },
    {
      key: 'statistics',
      label: t('inventoryPage.tabs.statistics'),
      hasAccess: true,
      component: <Text>Statistics Tab (в разработке)</Text>, 
    },
  ];

  const accessibleTabs = allTabs.filter(tab => tab.hasAccess);

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
    <Box w="100%" overflowX="hidden">
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

            <Divider borderColor={dividerBorderColor} borderWidth="1px" />

            <Wrap spacingX={6} spacingY={2} color="gray.500" fontSize="sm">
              <HStack>
                <Avatar size="xs" name={inventory.userCreator.userName} />
                <Text>
                  {t('inventoryPage.info.createdBy')}{' '}
                  <Text as="b" color={createdByColor}>
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
                <Icon as={FiTag} color="gray.500" />
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
          {isMobile ? (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="100%" mb={4} >
                {accessibleTabs[tabIndex]?.label}
              </MenuButton>
              <MenuList>
                {accessibleTabs.map((tab, index) => (
                  <MenuItem key={tab.key} onClick={() => setTabIndex(index)}>
                    {tab.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          ) : (
            <TabList>
              {accessibleTabs.map(tab => (
                <Tab key={tab.key}>{tab.label}</Tab>
              ))}
            </TabList>
          )}

          <TabPanels>
            {accessibleTabs.map(tab => (
              <TabPanel key={tab.key}>
                {tab.component}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
};

export default InventoryPage;