import React, { useState, useEffect } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Box, Button, VStack, HStack, Heading, Text, IconButton, Menu, MenuButton, MenuList, MenuItem,
  FormControl, FormLabel, Input, Select, useToast, Icon, useColorModeValue,
  Alert, AlertIcon, AlertTitle, AlertDescription, Tooltip, useNumberInput,
  FormErrorMessage,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, DragHandleIcon, InfoIcon } from '@chakra-ui/icons';
import type { CustomIdRule, CustomIdRuleApiRequest, CustomIdRulesRequest } from '../../types/inventory';

const LabelWithTooltip: React.FC<{ label: string; tooltipText: string }> = ({ label, tooltipText }) => (
  <HStack spacing={1} align="center">
    <FormLabel mb="0">{label}</FormLabel>
    <Tooltip label={tooltipText} placement="top" hasArrow>
      <InfoIcon color="gray.500" cursor="help" />
    </Tooltip>
  </HStack>
);

interface CustomIdTabProps {
  inventoryId: string;
  initialRules: CustomIdRule[];
  initialSeparator: string;
  onUpdate: () => void;
}

const RuleEditor: React.FC<{ rule: CustomIdRule; onChange: (updatedRule: CustomIdRule) => void; }> = ({ rule, onChange }) => {
  const { t } = useTranslation('global');
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const focusBorderColor = useColorModeValue('teal.600', 'teal.400');

  const handleFieldChange = (field: string, value: string | number) => {
    onChange({ ...rule, [field]: value });
  };

  const getEditorHeaderKey = () => {
    if (rule.type.startsWith('random_digits')) return 'random_digits';
    if (rule.type.startsWith('random_bits')) return 'random_bits';
    return rule.type;
  }

  const renderRuleFields = () => {
    switch (rule.type) {
      case 'fixed_text':
        const isInvalid = !rule.text || rule.text.trim() === '';
        return (
          <FormControl isInvalid={isInvalid}> 
            <LabelWithTooltip
              label={t('inventoryPage.customIdTab.fields.textValue')}
              tooltipText={t('inventoryPage.customIdTab.tooltips.textValue')}
            />
            <Input
              mt={2}
              focusBorderColor={focusBorderColor}
              value={rule.text || ''}
              onChange={(e) => handleFieldChange('text', e.target.value)}
            />
            {isInvalid && (
              <FormErrorMessage>
                {t('inventoryPage.customIdTab.errors.fieldRequired')}
              </FormErrorMessage>
            )}
          </FormControl>
        );
      case 'sequence':
        const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
          useNumberInput({
            defaultValue: 1, min: 1, max: 15,
            value: rule.padding || 1,
            onChange: (_, valueAsNumber) => handleFieldChange('padding', valueAsNumber || 1),
          });

        return (
          <FormControl>
            <LabelWithTooltip 
              label={t('inventoryPage.customIdTab.fields.padding')}
              tooltipText={t('inventoryPage.customIdTab.tooltips.padding')}
            />
            <HStack mt={2}>
              <Button {...getDecrementButtonProps()} >-</Button>
              <Input {...getInputProps()} isReadOnly focusBorderColor={focusBorderColor} />
              <Button {...getIncrementButtonProps()} >+</Button>
            </HStack>
          </FormControl>
        );
      case 'date':
        return (
          <FormControl>
            <LabelWithTooltip
              label={t('inventoryPage.customIdTab.fields.dateFormat')}
              tooltipText={t('inventoryPage.customIdTab.tooltips.dateFormat')}
            />
            <Select
              mt={2} 
              focusBorderColor={focusBorderColor}
              value={rule.format || 'yyyyMMdd'} 
              onChange={(e) => handleFieldChange('format', e.target.value)}
            >
              <option value="yyyyMMdd">{t('inventoryPage.customIdTab.dateFormats.yyyyMMdd')}</option>
              <option value="yyyy-MM-dd">{t('inventoryPage.customIdTab.dateFormats.yyyy_MM_dd_hyphen')}</option>
              <option value="ddMMyy">{t('inventoryPage.customIdTab.dateFormats.ddMMyy')}</option>
              <option value="yyyyMMddHHmmss">{t('inventoryPage.customIdTab.dateFormats.yyyyMMddHHmmss')}</option>
              <option value="yyyy">{t('inventoryPage.customIdTab.dateFormats.year_only')}</option>
              <option value="MM">{t('inventoryPage.customIdTab.dateFormats.month_only')}</option>
            </Select>
          </FormControl>
        );
      case 'guid':
        return (
          <FormControl>
            <LabelWithTooltip
              label={t('inventoryPage.customIdTab.fields.guidFormat')}
              tooltipText={t('inventoryPage.customIdTab.tooltips.guidFormat')}
            />
            <Select
              mt={2} 
              focusBorderColor={focusBorderColor}
              value={rule.format || 'D'}
              onChange={(e) => handleFieldChange('format', e.target.value)}
            >
              <option value="D">{t('inventoryPage.customIdTab.guidFormats.D')}</option>
              <option value="N">{t('inventoryPage.customIdTab.guidFormats.N')}</option>
              <option value="X">{t('inventoryPage.customIdTab.guidFormats.X')}</option>
            </Select>
          </FormControl>
        );
      case 'random_digits':
        return (
          <VStack align="stretch" spacing={4}>
            <FormControl>
              <LabelWithTooltip
                label={t('inventoryPage.customIdTab.fields.digitCount')}
                tooltipText={t('inventoryPage.customIdTab.tooltips.digitCount')}
              />
              <Select
                mt={2} 
                focusBorderColor={focusBorderColor}
                value={rule.length || 6}
                onChange={(e) => handleFieldChange('length', parseInt(e.target.value))}
              >
                <option value={6}>{t('inventoryPage.customIdTab.digitCounts.6')}</option>
                <option value={9}>{t('inventoryPage.customIdTab.digitCounts.9')}</option>
              </Select>
            </FormControl>
            <FormControl>
              <LabelWithTooltip
                label={t('inventoryPage.customIdTab.fields.numberFormat')}
                tooltipText={t('inventoryPage.customIdTab.tooltips.numberFormat')}
              />
              <Select
                mt={2} 
                focusBorderColor={focusBorderColor}
                value={rule.format || 'D'} 
                onChange={(e) => handleFieldChange('format', e.target.value)}
              >
                <option value="D">{t('inventoryPage.customIdTab.numberFormats.dec')}</option>
                <option value="X">{t('inventoryPage.customIdTab.numberFormats.hex')}</option>
              </Select>
            </FormControl>
          </VStack>
        );
      case 'random_bits':
        return (
          <VStack align="stretch" spacing={4}>
            <FormControl>
              <LabelWithTooltip
                label={t('inventoryPage.customIdTab.fields.bitCount')}
                tooltipText={t('inventoryPage.customIdTab.tooltips.bitCount')}
              />
              <Select
                mt={2} 
                focusBorderColor={focusBorderColor}
                value={rule.countBits || 20}
                onChange={(e) => handleFieldChange('countBits', parseInt(e.target.value))}
              >
                <option value={20}>{t('inventoryPage.customIdTab.bitCounts.20')}</option>
                <option value={32}>{t('inventoryPage.customIdTab.bitCounts.32')}</option>
              </Select>
            </FormControl>
            <FormControl>
              <LabelWithTooltip
                label={t('inventoryPage.customIdTab.fields.numberFormat')}
                tooltipText={t('inventoryPage.customIdTab.tooltips.numberFormat')}
              />
              <Select
                mt={2} 
                focusBorderColor={focusBorderColor}
                value={rule.format || 'X'}
                onChange={(e) => handleFieldChange('format', e.target.value)}
              >
                <option value="D">{t('inventoryPage.customIdTab.numberFormats.dec')}</option>
                <option value="X">{t('inventoryPage.customIdTab.numberFormats.hex')}</option>
              </Select>
            </FormControl>
          </VStack>
        );
      default:
        return <Text color="red.500">{t('inventoryPage.customIdTab.errors.unknownRule')}</Text>;
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="md" w="100%" bg={bgColor}>
      <Heading size="sm" mb={3}>{t(`inventoryPage.customIdTab.editorHeaders.${getEditorHeaderKey()}`)}</Heading>
      {renderRuleFields()}
    </Box>
  );
};

const SortableRuleItem: React.FC<{
  rule: CustomIdRule;
  onUpdate: (updatedRule: CustomIdRule) => void;
  onRemove: () => void;
}> = ({ rule, onUpdate, onRemove }) => {
  const { t } = useTranslation('global');
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: rule.clientSideId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box ref={setNodeRef} style={style} w="100%">
      <HStack spacing={2} align="center">
        <Box {...attributes} {...listeners} cursor="grab" p={2} aria-label={t('inventoryPage.customIdTab.dragHandleAriaLabel')} sx={{ touchAction: 'none' }}>
          <Icon as={DragHandleIcon} color="gray.500" />
        </Box>
        <RuleEditor rule={rule} onChange={onUpdate} />
        <IconButton
          aria-label={t('inventoryPage.customIdTab.removeRuleAriaLabel')}
          icon={<DeleteIcon />}
          colorScheme="red"
          onClick={onRemove}
        />
      </HStack>
    </Box>
  );
};


const CustomIdTab: React.FC<CustomIdTabProps> = ({ inventoryId, initialRules = [], onUpdate }) => {
  const { t } = useTranslation('global');
  const toast = useToast();
  const { updateCustomIdRules } = useInventory();

  const [rules, setRules] = useState<CustomIdRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setRules(initialRules.map((r, index) => ({
      ...r,
      order: index,
      clientSideId: uuidv4(),
    })));
  }, [initialRules]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setRules((items) => {
        const oldIndex = items.findIndex((item) => item.clientSideId === active.id);
        const newIndex = items.findIndex((item) => item.clientSideId === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        return newArray.map((item, index) => ({ ...item, order: index }));
      });
    }
  };

  const addRule = (type: string) => {
    let defaults: Partial<CustomIdRule> = {};

    switch (type) {
      case 'fixed_text':
        defaults = { text: 'FIXED-' };
        break;
      case 'sequence':
        defaults = { padding: 4 };
        break;
      case 'date':
        defaults = { format: 'yyyyMMdd' };
        break;
      case 'guid':
        defaults = { format: 'N' };
        break;
      case 'random_digits':
        defaults = { length: 6, format: 'D' }; 
        break;
      case 'random_bits':
        defaults = { countBits: 20, format: 'X' }; 
        break;
    }

    const newRule: CustomIdRule = {
      clientSideId: uuidv4(),
      type,
      order: rules.length,
      ...defaults,
    };
    setRules([...rules, newRule]);
  };
  
  const updateRule = (clientSideId: string, updatedRule: CustomIdRule) => {
    setRules(rules.map(rule => (rule.clientSideId === clientSideId ? updatedRule : rule)));
  };

  const removeRule = (clientSideIdToRemove: string) => {
    const newRules = rules.filter(rule => rule.clientSideId !== clientSideIdToRemove);
    setRules(newRules.map((item, index) => ({ ...item, order: index })));
  };

  const prepareRulesForApi = (rules: CustomIdRule[]): CustomIdRulesRequest => {
    const apiRuleParts: CustomIdRuleApiRequest[] = rules.map(rule => {
      switch (rule.type) {
        case 'fixed_text':
          return {
            $type: 'fixed_text',
            order: rule.order,
            text: rule.text || '',
          };
        case 'sequence':
          return {
            $type: 'sequence',
            order: rule.order,
            padding: rule.padding || 0, 
          };
        case 'date':
          return {
            $type: 'date',
            order: rule.order,
            format: rule.dateFormat || 'yyyyMMdd',
          };
        case 'guid':
          return {
            $type: 'guid',
            order: rule.order,
            format: rule.guidFormat || 'N',
          };
        case 'random_digits':
          return {
            $type: 'random_digits',
            order: rule.order,
            length: rule.digitCount || 6,
          };
        case 'random_bits':
          return {
            $type: 'random_bits',
            order: rule.order,
            countBits: rule.bitCount || 20,
            format: rule.numberFormat || 'hex',
          };
        default:
          throw new Error(`Unknown custom ID rule type: "${rule.type}"`);
      }
    });

    return { customIdRuleParts: apiRuleParts };
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {     
      const invalidRule = rules.find(rule => 
        rule.type === 'fixed_text' && (!rule.text || rule.text.trim() === '')
      );

      if (invalidRule) {
        toast({
          title: t('inventoryPage.customIdTab.toast.validationErrorTitle'),
          description: t('inventoryPage.customIdTab.toast.validationErrorDescription'),
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
        setIsLoading(false);
        return;
      }

      const rulesToSave: CustomIdRulesRequest = {
        customIdRuleParts: prepareRulesForApi(rules).customIdRuleParts
      };
      
      await updateCustomIdRules(rulesToSave, inventoryId);
      toast({
        title: t('inventoryPage.customIdTab.toast.successTitle'),
        description: t('inventoryPage.customIdTab.toast.successDescription'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onUpdate();
    } catch (error) {
      toast({
        title: t('inventoryPage.customIdTab.toast.errorTitle'),
        description: t('inventoryPage.customIdTab.toast.errorDescription'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  const generatePreview = () => {
    if (rules.length === 0) return t('inventoryPage.customIdTab.preview.defaultGuid');
    return rules.map(rule => {
      switch (rule.type) {
        case 'fixed_text': return rule.text || '';
        case 'sequence': return '1'.padStart(rule.padding || 1, '0');
        case 'date': return '20250912...';
        case 'guid': return 'a1b2c3d4...';
        case 'random_digits': return '...'.padStart(rule.length || 0, 'X');
        case 'random_bits': return 'ABC123...';
        default: return '';
      }
    }).join('-');
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg">{t('inventoryPage.customIdTab.title')}</Heading>
      <Alert status="info" borderRadius="md" colorScheme='teal'>
        <AlertIcon />
        <Box>
          <AlertTitle>{t('inventoryPage.customIdTab.info.title')}</AlertTitle>
          <AlertDescription>{t('inventoryPage.customIdTab.info.description')}</AlertDescription>
        </Box>
      </Alert>

      <VStack spacing={4} p={4} borderWidth={1} borderRadius="md" align="stretch">
        <Heading size="md">{t('inventoryPage.customIdTab.preview.title')}</Heading>
        <Text fontFamily="monospace" fontSize="lg" p={2} borderRadius="sm" overflowX="auto" minH="32px">
          {generatePreview()}
        </Text>
      </VStack>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={rules.map(r => r.clientSideId)} strategy={verticalListSortingStrategy}>
          <VStack spacing={4} align="stretch">
            {rules.map((rule) => (
              <SortableRuleItem
                key={rule.clientSideId}
                rule={rule}
                onUpdate={(updated) => updateRule(rule.clientSideId, updated)}
                onRemove={() => removeRule(rule.clientSideId)}
              />
            ))}
          </VStack>
        </SortableContext>
      </DndContext>

      <HStack justifyContent="space-between" mt={4}>
        <Menu>
          <MenuButton as={Button} leftIcon={<AddIcon />} colorScheme="teal">
            {t('inventoryPage.customIdTab.addRule')}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => addRule('fixed_text')}>{t('inventoryPage.customIdTab.ruleTypes.fixed_text')}</MenuItem>
            <MenuItem onClick={() => addRule('sequence')}>{t('inventoryPage.customIdTab.ruleTypes.sequence')}</MenuItem>
            <MenuItem onClick={() => addRule('date')}>{t('inventoryPage.customIdTab.ruleTypes.date')}</MenuItem>
            <MenuItem onClick={() => addRule('guid')}>{t('inventoryPage.customIdTab.ruleTypes.guid')}</MenuItem>
            <MenuItem onClick={() => addRule('random_digits')}>{t('inventoryPage.customIdTab.ruleTypes.random_digits')}</MenuItem>
            <MenuItem onClick={() => addRule('random_bits')}>{t('inventoryPage.customIdTab.ruleTypes.random_bits')}</MenuItem>
          </MenuList>
        </Menu>
        <Button colorScheme="teal" onClick={handleSave} isLoading={isLoading}>
          {t('inventoryPage.customIdTab.saveChanges')}
        </Button>
      </HStack>
    </VStack>
  );
};

export default CustomIdTab;