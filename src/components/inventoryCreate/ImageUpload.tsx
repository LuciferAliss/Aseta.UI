import { Box, VStack, Text, Icon, useColorModeValue, Center, Image, Button } from '@chakra-ui/react';
import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { FiUploadCloud, FiX } from 'react-icons/fi';

interface ImageUploadProps {
  onFileAccepted: (file: File | null) => void;
}

const ImageUpload = ({ onFileAccepted }: ImageUploadProps) => {
  const { t } = useTranslation('global');
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setPreview(URL.createObjectURL(file));
      onFileAccepted(file);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
    multiple: false, 
  });
  
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleRemoveImage = () => {
    setPreview(null);
    onFileAccepted(null);
  };
  
  const dropzoneActiveBg = useColorModeValue('teal.50', 'teal.900');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const activeBorderColor = useColorModeValue('teal.500', 'teal.300');

  if (preview) {
    return (
      <Box position="relative" w="100%" borderWidth="1px" borderRadius="lg" p={2}>
        <Image src={preview} alt={t('imageUpload.previewAlt')} borderRadius="md" w="100%" />
        <Button
          position="absolute"
          top="10px"
          right="10px"
          size="sm"
          colorScheme="red"
          onClick={handleRemoveImage}
          aria-label={t('imageUpload.removeAriaLabel')}
        >
          <Icon as={FiX} />
        </Button>
      </Box>
    );
  }

  return (
    <Center
      {...getRootProps()}
      p={10}
      borderWidth="2px"
      borderStyle="dashed"
      borderColor={isDragActive ? activeBorderColor : borderColor}
      borderRadius="lg"
      bg={isDragActive ? dropzoneActiveBg : 'transparent'}
      transition="border-color 0.2s, background-color 0.2s"
      cursor="pointer"
    >
      <input {...getInputProps()} />
      <VStack>
        <Icon as={FiUploadCloud} boxSize={12} color="gray.500" />
        <Text fontWeight="medium">
          {isDragActive ? t('imageUpload.dropActive') : t('imageUpload.prompt')}
        </Text>
        <Text fontSize="sm" color="gray.500">{t('imageUpload.orClick')}</Text>
      </VStack>
    </Center>
  );
};

export default ImageUpload;