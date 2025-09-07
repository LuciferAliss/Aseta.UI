import type { Category, CreateInventoryRequest } from "../types/inventory";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Spinner,
  Switch,
  Textarea,
  useToast,
  VStack,
  FormHelperText,
  Center,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Headers from '../components/Header';
import ImageUpload from "../components/inventoryCreate/ImageUpload";
import app from '..';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import {v4 as uuidv4} from 'uuid';
import { useInventory } from "../hooks/useInventory";

const CreateInventoryPage = () => {
  const { t } = useTranslation('global');
  const toast = useToast();
  const navigate = useNavigate();
  const { isLoading, createInventory, getCategories } = useInventory();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [categoryId, setCategoryId] = useState<number | ''>('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const a = data.collection;
        setCategories(a);
      } catch (error) {
        toast({
          title: t('createPage.toast.categoriesErrorTitle'),
          description: t('createPage.toast.categoriesErrorDescription'),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchCategories();
  }, [t, toast]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId) {
        toast({
            title: t('createPage.toast.validationErrorTitle'),
            description: t('createPage.toast.validationErrorDescription'),
            status: 'warning',
            duration: 3000,
            isClosable: true,
        });
        return;
    }

    setIsSubmitting(true);
    let imageUrl : string = '';

    try {
      if (imageFile) {
        const storage = getStorage(app);
        
        const imageRef = ref(storage, `images/${imageFile.name + uuidv4()}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = imageRef.fullPath;

        setImageFile(null);
      }
      
      const requestData: CreateInventoryRequest = {
        name,
        description,
        imageUrl,
        isPublic,
        categoryId: Number(categoryId),
      };

      const response = await createInventory(requestData);
      
      toast({
        title: t('createPage.toast.successTitle'),
        description: t('createPage.toast.successDescription'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate(`/inventory/${response.id}`);

    } catch (error) {
      toast({ 
        title: t('createPage.toast.errorTitle'),
        description: t('createPage.toast.errorDescription'),
        status: 'error',
        duration: 5000,
        isClosable: true,
       });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box w={'100%'} overflowX="hidden">
      <Headers /> 
      <Container maxW="container.md" py={8}>
        <VStack as="form" onSubmit={handleSubmit} spacing={6} align="stretch">
          <Heading as="h1" size="lg" textAlign="center">
            {t('createPage.title')}
          </Heading>

          <FormControl isRequired>
            <FormLabel>{t('createPage.nameLabel')}</FormLabel>
            <Input
              placeholder={t('createPage.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t('createPage.descriptionLabel')}</FormLabel>
            <Textarea
              placeholder={t('createPage.descriptionPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t('createPage.imageLabel')}</FormLabel>
            <ImageUpload onFileAccepted={setImageFile} />
            <FormHelperText>{t('createPage.imageHelper')}</FormHelperText>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{t('createPage.categoryLabel')}</FormLabel>
            {isLoading ? <Center><Spinner /></Center> : (
              <Select
                placeholder={t('createPage.categoryPlaceholder')}
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                isDisabled={isLoading}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            )}
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="is-public" mb="0">
              {t('createPage.publicLabel')}
            </FormLabel>
            <Switch
              id="is-public"
              isChecked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              colorScheme="teal"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            size="lg"
            isLoading={isSubmitting}
            loadingText={t('createPage.submittingButton')}
            isDisabled={!name || !categoryId}
          >
            {t('createPage.createButton')}
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default CreateInventoryPage;