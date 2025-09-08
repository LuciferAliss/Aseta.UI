import {
    VStack, 
    FormControl, 
    FormLabel, 
    Input, 
    Textarea, 
    Select, 
    useToast, 
    Text
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { type Inventory } from '../../types/inventory';
import ImageUpload from '../inventoryCreate/ImageUpload';

const SettingsTab = ({ inventory }: { inventory: Inventory }) => {
  const { t } = useTranslation('global');
  const toast = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formState, setFormState] = useState({
    name: inventory.name,
    description: inventory.description,
    imageUrl: inventory.imageUrl
  });
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSaveStatus('unsaved');
  };
  const handleImageUpload = (cdnUrl: string) => {
    setSaveStatus('unsaved');
  };
  
  useEffect(() => {
    if (saveStatus === 'unsaved') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setSaveStatus('saving');
      // TODO: Замените на реальный API вызов
      console.log('Сохранение данных...', formState);
      setTimeout(() => {
      setSaveStatus('saved');
      toast({ title: t('inventoryPage.settings.autoSaveSuccess'), status: 'success', duration: 2000 });
      }, 1500); 
    }, 7000); // 7 секунд
    }

    return () => {
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
    }
  }}, [formState, saveStatus, t, toast]);
  
  const getSaveStatusText = () => {
    if (saveStatus === 'saved') return t('inventoryPage.settings.statusSaved');
    if (saveStatus === 'saving') return t('inventoryPage.settings.statusSaving');
    return t('inventoryPage.settings.statusUnsaved');
  };

  return (
    <VStack spacing={4} align="stretch">
      <Text alignSelf="flex-end" fontSize="sm" color="gray.500">{getSaveStatusText()}</Text>
      <FormControl>
        <FormLabel>{t('inventoryPage.settings.nameLabel')}</FormLabel>
        <Input name="name" value={formState.name} onChange={handleInputChange} />
      </FormControl>
      <FormControl>
        <FormLabel>{t('inventoryPage.settings.descriptionLabel')}</FormLabel>
        <Textarea name="description" value={formState.description} onChange={handleInputChange} rows={10} />
      </FormControl>
      <FormControl>
        <FormLabel>{t('inventoryPage.settings.imageLabel')}</FormLabel>
        <ImageUpload onFileAccepted={setImageFile} />
      </FormControl>
    </VStack>
  );
};

export default SettingsTab;