import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Icon,
  chakra,
  Flex,
  FormControl,
  VisuallyHidden,
  Text,
  Image,
  Button,
  useMultiStyleConfig,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void;
  initialPreviewUrl?: string | null;
  onClearError?: () => void;
}

export default function ImageUploader({
  onFileChange,
  initialPreviewUrl,
  onClearError,
}: ImageUploaderProps) {
  const { t } = useTranslation("common");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const styles = useMultiStyleConfig("ImageUploader", {});

  useEffect(() => {
    setPreviewUrl(initialPreviewUrl || null);
  }, [initialPreviewUrl]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onFileChange(file);
        onClearError?.();
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onFileChange, onClearError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    },
  });

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onFileChange(null);
    onClearError?.();
  };

  return (
    <>
      <FormControl sx={styles.container}>
        {!previewUrl ? (
          <Flex
            sx={styles.dropzone}
            data-active={isDragActive}
            {...getRootProps()}
          >
            <VStack spacing={1} w="full">
              <Icon viewBox="0 0 48 48" aria-hidden="true" sx={styles.icon}>
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Icon>
              <Flex fontSize="sm">
                <chakra.label htmlFor="file-upload" sx={styles.uploadLabel}>
                  <span>{t("imageUploader.dragAndDrop")}</span>{" "}
                  <VisuallyHidden>
                    <input {...getInputProps()} />
                  </VisuallyHidden>
                </chakra.label>
              </Flex>
              <Text sx={styles.textHint} cursor="default">
                {t("imageUploader.fileSize")}
              </Text>
            </VStack>
          </Flex>
        ) : (
          <VStack sx={styles.preview} w="full">
            <Image alt={t("imageUploader.imagePreview")} src={previewUrl} />
          </VStack>
        )}
      </FormControl>

      {previewUrl && (
        <Button onClick={handleRemoveImage} colorScheme="red" w="full" mt={2}>
          {t("imageUploader.removeImage")}
        </Button>
      )}
    </>
  );
}
