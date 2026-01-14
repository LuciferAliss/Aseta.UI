import {
  Button,
  Center,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { type InventoryCreateRequest } from "../../types/inventory";
import ImageUploader from "../layout/ImageUploader";
import { createInventory } from "../../lib/services/inventoryService";
import { useAppToast } from "../../lib/hooks/useAppToast";
import { uploadImage } from "../../lib/services/cloudinaryService";
import { getTitleError } from "../../lib/utils/errorUtils";
import { VALIDATION_CONSTANTS } from "../../lib/constants";
import { useAuth } from "../../lib/contexts/AuthContext";

interface FormValues extends Omit<InventoryCreateRequest, "imageUrl"> {
  imageFile: File | null;
}

const InventoryCreateModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation(["inventoryCreate", "common"]);
  const { showError, showSuccess } = useAppToast();
  const { isAuth } = useAuth();

  const handleOpenModal = () => {
    if (!isAuth) {
      showError(t("not_authenticated_error"));
      return;
    }
    onOpen();
  };

  const initialValues: FormValues = {
    name: "",
    description: "",
    categoryId: "",
    isPublic: true,
    imageFile: null,
  };

  const validateForm = (values: FormValues) => {
    const errors: Partial<Record<keyof FormValues, string>> = {};

    if (!values.name) {
      errors.name = t("validation_errors.name_required");
    } else if (
      values.name.length < VALIDATION_CONSTANTS.INVENTORY.NAME.MIN_LENGTH
    ) {
      errors.name = t("validation_errors.name_min");
    } else if (
      values.name.length > VALIDATION_CONSTANTS.INVENTORY.NAME.MAX_LENGTH
    ) {
      errors.name = t("validation_errors.name_max");
    }

    if (
      values.description.length >
      VALIDATION_CONSTANTS.INVENTORY.DESCRIPTION.MAX_LENGTH
    ) {
      errors.description = t("validation_errors.description_max");
    }

    if (!values.categoryId) {
      errors.categoryId = t("validation_errors.category_required");
    }

    if (!values.imageFile) {
      errors.imageFile = t("validation_errors.image_required");
    }

    return errors;
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    try {
      if (!values.imageFile) {
        showError(t("validation_errors.image_required"));
        setSubmitting(false);
        return;
      }

      const imageUrl = await uploadImage(values.imageFile);

      const request: InventoryCreateRequest = {
        name: values.name,
        description: values.description,
        categoryId: values.categoryId,
        isPublic: values.isPublic,
        imageUrl: imageUrl,
      };

      await createInventory(request);

      showSuccess(t("success_title"), t("success_description"));
      onClose();
    } catch (error) {
      const backendErrorTitle = getTitleError(error);
      const localizedKey = `backend_errors.${backendErrorTitle}`;
      const translatedError = t(localizedKey, { returnObjects: true });

      if (
        typeof translatedError === "object" &&
        translatedError &&
        "Title" in translatedError &&
        "Description" in translatedError
      ) {
        showError(
          translatedError.Title as string,
          translatedError.Description as string
        );
      } else {
        showError(t("error_title"));
      }
    }
  };

  return (
    <>
      <Button onClick={handleOpenModal} w="full">
        {t("create_inventory_title")}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        isCentered
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton
            _focusVisible={{
              ring: "2px",
              ringColor: "btn-focus-ring",
              ringOffset: "2px",
              ringOffsetColor: "app-bg",
            }}
          />
          <Formik
            initialValues={initialValues}
            validate={validateForm}
            onSubmit={handleSubmit}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {({
              isSubmitting,
              setFieldValue,
              errors,
              touched,
              setFieldError,
            }) => (
              <Form noValidate>
                <ModalHeader>
                  <Center>
                    <Text fontSize="2xl" as="b">
                      {t("create_inventory_title")}
                    </Text>
                  </Center>
                </ModalHeader>
                <ModalBody>
                  <VStack spacing={4}>
                    <FormControl isInvalid={!!errors.name && touched.name}>
                      <FormLabel>{t("name_label")}</FormLabel>
                      <Field
                        as={Input}
                        name="name"
                        onFocus={() => setFieldError("name", undefined)}
                        placeholder={t("name_placeholder")}
                      />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={!!errors.description && touched.description}
                    >
                      <FormLabel>{t("description_label")}</FormLabel>
                      <Field
                        as={Input}
                        name="description"
                        onFocus={() => setFieldError("description", undefined)}
                        placeholder={t("description_placeholder")}
                      />
                      <FormErrorMessage>{errors.description}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={!!errors.categoryId && touched.categoryId}
                    >
                      <FormLabel>{t("category_id_label")}</FormLabel>
                      <Field
                        as={Input}
                        name="categoryId"
                        onFocus={() => setFieldError("categoryId", undefined)}
                        placeholder={t("category_id_placeholder")}
                      />
                      <FormErrorMessage>{errors.categoryId}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={!!errors.imageFile && touched.imageFile}
                    >
                      <FormLabel>{t("image_label")}</FormLabel>
                      <ImageUploader
                        onFileChange={(file) => {
                          setFieldValue("imageFile", file);
                        }}
                        onClearError={() =>
                          setFieldError("imageFile", undefined)
                        }
                      />
                      <FormErrorMessage>{errors.imageFile}</FormErrorMessage>
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    w="full"
                  >
                    {t("submit_button")}
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InventoryCreateModal;
