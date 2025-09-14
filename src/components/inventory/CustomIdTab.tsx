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
  FormControl, FormLabel, Input, Select, useToast, Icon, useColorModeValue, NumberInput,
  NumberInputField, Alert, AlertIcon, AlertTitle, AlertDescription, Tooltip,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, DragHandleIcon, InfoIcon } from '@chakra-ui/icons';
import type { CustomIdRule, CustomIdRulesRequest } from '../../types/inventory';

// Вспомогательный компонент для добавления Tooltip к FormLabel
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
  onUpdate: () => void;
}

const RuleEditor: React.FC<{ rule: CustomIdRule; onChange: (updatedRule: CustomIdRule) => void; }> = ({ rule, onChange }) => {
  const { t } = useTranslation('global');
  const bgColor = useColorModeValue('gray.50', 'gray.700');

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
        return (
          <FormControl>
            <LabelWithTooltip
              label={t('inventoryPage.customIdTab.fields.textValue')}
              tooltipText={t('inventoryPage.customIdTab.tooltips.textValue')}
            />
            <Input
              value={rule.text || ''}
              onChange={(e) => handleFieldChange('text', e.target.value)}
            />
          </FormControl>
        );
      case 'sequence':
        return (
          <FormControl>
            <LabelWithTooltip
              label={t('inventoryPage.customIdTab.fields.padding')}
              tooltipText={t('inventoryPage.customIdTab.tooltips.padding')}
            />
            <NumberInput
              min={1} max={10} value={rule.padding || 1}
              onChange={(_, valueAsNumber) => handleFieldChange('padding', valueAsNumber || 1)}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
        );
      case 'date':
        return (
          <FormControl>
            <LabelWithTooltip
              label={t('inventoryPage.customIdTab.fields.dateFormat')}
              tooltipText={t('inventoryPage.customIdTab.tooltips.dateFormat')}
            />
            <Input
              placeholder="e.g., yyyy-MM-dd HH:mm:ss"
              value={rule.format || ''}
              onChange={(e) => handleFieldChange('format', e.target.value)}
            />
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
              value={rule.format || 'D'}
              onChange={(e) => handleFieldChange('format', e.target.value)}
            >
              <option value="D">32 digits separated by hyphens</option>
              <option value="N">32 digits</option>
              <option value="B">Hyphens, enclosed in braces</option>
              <option value="P">Hyphens, enclosed in parentheses</option>
            </Select>
          </FormControl>
        );
      case 'random_digits':
        return (
          <FormControl>
            <LabelWithTooltip
              label={t('inventoryPage.customIdTab.fields.digitsLength')}
              tooltipText={t('inventoryPage.customIdTab.tooltips.digitsLength')}
            />
            <NumberInput
              min={1} max={15} value={rule.length || 6} // Увеличил max для гибкости
              onChange={(_, valueAsNumber) => handleFieldChange('length', valueAsNumber || 1)}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
        );
      case 'random_bits':
        return (
          <VStack align="stretch">
            <FormControl>
              <LabelWithTooltip
                label={t('inventoryPage.customIdTab.fields.bitCount')}
                tooltipText={t('inventoryPage.customIdTab.tooltips.bitCount')}
              />
              <Select
                value={rule.countBits || 20}
                onChange={(e) => handleFieldChange('countBits', parseInt(e.target.value))}
              >
                <option value={20}>20-bit</option>
                <option value={32}>32-bit</option>
              </Select>
            </FormControl>
            <FormControl>
              <LabelWithTooltip
                label={t('inventoryPage.customIdTab.fields.numberFormat')}
                tooltipText={t('inventoryPage.customIdTab.tooltips.numberFormat')}
              />
              <Input
                placeholder="e.g., X for Hex"
                value={rule.format || ''}
                onChange={(e) => handleFieldChange('format', e.target.value)}
              />
            </FormControl>
          </VStack>
        );
      default:
        return <Text color="red.500">Unknown rule type!</Text>;
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
        <Box {...attributes} {...listeners} cursor="grab" p={2} aria-label="Drag handle" sx={{ touchAction: 'none' }}>
          <Icon as={DragHandleIcon} color="gray.500" />
        </Box>
        <RuleEditor rule={rule} onChange={onUpdate} />
        <IconButton
          aria-label="Remove rule"
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
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  // === ИЗМЕНЕНИЕ 2: Обновленная функция addRule для предустановок ===
  const addRule = (type: string, defaults: Partial<CustomIdRule> = {}) => {
    const newRule: CustomIdRule = {
      clientSideId: uuidv4(),
      type: type,
      order: rules.length,
      ...defaults, // Применяем предустановленные значения
    };
    setRules([...rules, newRule]);
  };

  const updateRule = (clientSideId: string, updatedRule: CustomIdRule) => {
    setRules(prevRules =>
      prevRules.map(rule =>
        rule.clientSideId === clientSideId ? updatedRule : rule
      )
    );
  };

  const removeRule = (clientSideIdToRemove: string) => {
    const newRules = rules.filter(rule => rule.clientSideId !== clientSideIdToRemove);
    setRules(newRules.map((item, index) => ({ ...item, order: index })));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {

      const rulesToSave: CustomIdRulesRequest = {
        customIdRuleParts: rules.map(({ clientSideId, ...rest }) => rest) 
      };
    
      console.log(rulesToSave);
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
    if (rules.length === 0) return '';
    return rules.map(rule => {
      switch (rule.type) {
        case 'fixed_text': return rule.text || '';
        case 'sequence': return '1'.padStart(rule.padding || 1, '0');
        case 'date': return '20250912...';
        case 'guid': return 'a1b2c3d4e5f6...';
        case 'random_digits': return '...'.padStart(rule.length || 0, 'X');
        case 'random_bits': return 'ABC123...';
        default: return '';
      }
    }).join('');
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg">{t('inventoryPage.customIdTab.title')}</Heading>
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertTitle>{t('inventoryPage.customIdTab.info.title')}</AlertTitle>
          <AlertDescription>{t('inventoryPage.customIdTab.info.description')}</AlertDescription>
        </Box>
      </Alert>
      <Box p={4} borderWidth={1} borderRadius="md">
        <Heading size="md" mb={2}>{t('inventoryPage.customIdTab.preview.title')}</Heading>
        <Text fontFamily="monospace" fontSize="lg" p={2} bg={useColorModeValue('gray.100', 'gray.800')} borderRadius="sm" overflowX="auto">
          {rules.length > 0
            ? generatePreview()
            : t('inventoryPage.customIdTab.preview.defaultGuid')
          }
        </Text>
      </Box>

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
          {/* === ИЗМЕНЕНИЕ 3: Обновленное меню с конкретными опциями === */}
          <MenuList>
            <MenuItem onClick={() => addRule('fixed_text', { text: 'FIXED-' })}>{t('inventoryPage.customIdTab.ruleTypes.fixed_text')}</MenuItem>
            <MenuItem onClick={() => addRule('sequence', { padding: 4 })}>{t('inventoryPage.customIdTab.ruleTypes.sequence')}</MenuItem>
            <MenuItem onClick={() => addRule('date', { format: 'yyyyMMdd' })}>{t('inventoryPage.customIdTab.ruleTypes.date')}</MenuItem>
            <MenuItem onClick={() => addRule('guid', { format: 'N' })}>{t('inventoryPage.customIdTab.ruleTypes.guid')}</MenuItem>
            <MenuItem onClick={() => addRule('random_digits', { length: 6 })}>{t('inventoryPage.customIdTab.ruleTypes.random_digits_6')}</MenuItem>
            <MenuItem onClick={() => addRule('random_digits', { length: 9 })}>{t('inventoryPage.customIdTab.ruleTypes.random_digits_9')}</MenuItem>
            <MenuItem onClick={() => addRule('random_bits', { countBits: 20, format: 'X' })}>{t('inventoryPage.customIdTab.ruleTypes.random_bits_20')}</MenuItem>
            <MenuItem onClick={() => addRule('random_bits', { countBits: 32, format: 'X' })}>{t('inventoryPage.customIdTab.ruleTypes.random_bits_32')}</MenuItem>
          </MenuList>
        </Menu>

        <Button colorScheme="blue" onClick={handleSave} isLoading={isLoading}>
          {t('inventoryPage.customIdTab.saveChanges')}
        </Button>
      </HStack>
    </VStack>
  );
};

export default CustomIdTab;