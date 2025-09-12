import { Box, useColorModeValue, Text, Checkbox, Flex, VStack, Heading, Tooltip, Divider } from '@chakra-ui/react';
import type { CustomFieldDefinition, InventoryItem } from '../../types/inventory';
import { useTranslation } from 'react-i18next';

interface ItemCardProps {
  item: InventoryItem;
  customFields: CustomFieldDefinition[];
  isSelected: boolean;
  onSelectItem: (id: string, isChecked: boolean) => void;
  isActionLoading: boolean;
  canEdit: boolean;
}

const ItemCard = ({ item, customFields, isSelected, onSelectItem, isActionLoading, canEdit }: ItemCardProps) => {
  const { t, i18n } = useTranslation('global');
  const cardBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('teal.50', 'teal.900_20');
  const borderColor = useColorModeValue('teal.200', 'teal.500');

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(i18n.language, {
      day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <Flex
      p={4}
      bg={isSelected ? selectedBg : cardBg}
      boxShadow="md"
      borderRadius="lg"
      borderWidth="1px"
      borderColor={isSelected ? borderColor : 'transparent'}
      _hover={{ bg: !isSelected ? hoverBg : undefined }}
      transition="all 0.2s ease-in-out"
      opacity={isActionLoading ? 0.6 : 1}
      align="flex-start"
      gap={4}
    >
      {canEdit && (
        <Checkbox
          colorScheme="teal"
          isChecked={isSelected}
          onChange={(e) => onSelectItem(item.id, e.target.checked)}
          isDisabled={isActionLoading}
          mt={1}
          aria-label={`Select item ${item.customId}`}
        />
      )}
      <VStack align="stretch" spacing={3} w="100%">
        <Flex justify="space-between" align="center" w="100%">
          <Tooltip label={item.customId}>
            <Heading as="h3" size="sm" noOfLines={1} maxW="70%">
              {item.customId || 'No ID'}
            </Heading>
          </Tooltip>
          <Text fontSize="xs" color="gray.500">
            {formatDate(item.createdAt.toString())}
          </Text>
        </Flex>

        <Divider />

        <VStack align="stretch" spacing={2}>
          {customFields.slice(0, 3).map((field) => {
            const cellValue = String(item.customFields.find(cf => cf.fieldId === field.id)?.value ?? '—');
            return (
              <Box key={`${item.id}-${field.id}`} fontSize="sm">
                <Text as="span" color="gray.500" fontWeight="medium">{field.name}: </Text>
                <Text as="span">{cellValue}</Text>
              </Box>
            );
          })}
        </VStack>

        <Flex justify="flex-end" pt={2}>
          <Tooltip label={item.userUpdate.userName}>
            <Text fontSize="xs" color="gray.500" noOfLines={1}>
              {t('inventoryPage.elementsTab.table.header.updatedBy')}: {item.userUpdate.userName}
            </Text>
          </Tooltip>
        </Flex>
      </VStack>
    </Flex>
  );
};

export default ItemCard;