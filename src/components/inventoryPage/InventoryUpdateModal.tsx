import {
  Button,
  Center,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  CheckboxGroup,
  Checkbox,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import {
  type InventoryResponse,
  type InventoryUpdateRequest,
} from "../../types/inventory";
import ImageUploader from "../layout/ImageUploader";
import { updateInventory } from "../../lib/services/inventoryService";
import { useAppToast } from "../../lib/hooks/useAppToast";
import { uploadImage } from "../../lib/services/cloudinaryService";
import { getTitleError } from "../../lib/utils/errorUtils";
import { VALIDATION_CONSTANTS } from "../../lib/constants";
import { useState, useEffect } from "react";
import { type CategoryResponse } from "../../types/category";
import { GetAllCategory } from "../../lib/services/categoryService";
import { CustomSelect } from "../layout/CustomSelect";
import { type TagResponse } from "../../types/tag";
import { getAllTags } from "../../lib/services/tagService";

interface InventoryUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryResponse | null;
  onInventoryUpdated: () => void;
}

interface FormValues extends Omit<InventoryUpdateRequest, "imageUrl"> {
  imageFile: File | null;
}

const InventoryUpdateModal = ({
  isOpen,
  onClose,
  inventory,
  onInventoryUpdated,
}: InventoryUpdateModalProps) => {
  const { t } = useTranslation(["inventoryPage", "common"]);
  const { showError, showSuccess } = useAppToast();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      if (isOpen) {
        setIsLoadingCategories(true);
        try {
          const response = await GetAllCategory();
          setCategories(response.categories);
        } catch (error) {
          showError(t("common:backend_error.server_error.title"));
        } finally {
          setIsLoadingCategories(false);
        }
      }
    };

    const fetchTags = async () => {
      if (isOpen) {
        setIsLoadingTags(true);
        try {
          const response = await getAllTags();
          setTags(response.tags);
        } catch (error) {
          showError(t("common:backend_error.server_error.title"));
        } finally {
          setIsLoadingTags(false);
        }
      }
    };

    if (isOpen) {
      fetchCategories();
      fetchTags();
      setImageRemoved(false);
    }
  }, [isOpen, showError, t]);

  if (!inventory) {
    return null;
  }

  const initialValues: FormValues = {
    name: inventory.name,
    description: inventory.description,
    categoryId: inventory.category.id,
    tagIds: inventory.tags.map((tag) => tag.id),
    isPublic: inventory.isPublic,
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
      values.description &&
      values.description.length >
        VALIDATION_CONSTANTS.INVENTORY.DESCRIPTION.MAX_LENGTH
    ) {
      errors.description = t("validation_errors.description_max", {
        ns: "common",
      });
    }

    if (!values.categoryId) {
      errors.categoryId = t("validation_errors.category_required", {
        ns: "common",
      });
    }

    return errors;
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    try {
      let imageUrl: string | undefined;

      if (values.imageFile) {
        imageUrl = await uploadImage(values.imageFile);
      } else if (imageRemoved) {
        imageUrl = "";
      } else {
        imageUrl = inventory?.imageUrl;
      }

      const request: InventoryUpdateRequest = {
        name: values.name,
        description: values.description,
        categoryId: values.categoryId,
        tagIds: values.tagIds,
        isPublic: values.isPublic,
        imageUrl,
      };

      await updateInventory(inventory.id, request);

      showSuccess(t("update_success_title"), t("update_success_description"));
      onInventoryUpdated();
      onClose();
    } catch (error) {
      const backendErrorTitle = getTitleError(error);
      const localizedKey = `backend_errors.${backendErrorTitle}`;
      const translatedError = t(localizedKey, {
        returnObjects: true,
        ns: "common",
      });

      if (
        typeof translatedError === "object" &&
        translatedError &&
        "Title" in translatedError &&
        "Description" in translatedError
      ) {
        showError(
          translatedError.Title as string,
          translatedError.Description as string,
        );
      } else {
        showError(t("error_title"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
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
            enableReinitialize
          >
            {({
              isSubmitting,
              setFieldValue,
              errors,
              values,
              touched,
              setFieldError,
            }) => (
              <Form noValidate>
                <ModalHeader>
                  <Center>
                    <Text fontSize="2xl" as="b">
                      {t("updateInventoryModal.title")}
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
                        placeholder={t("description_placeholder", {
                          ns: "common",
                        })}
                      />
                      <FormErrorMessage>{errors.description}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={!!errors.categoryId && touched.categoryId}
                    >
                      <FormLabel>{t("category_id_label")}</FormLabel>
                      {isLoadingCategories ? (
                        <Spinner size="sm" />
                      ) : (
                        <CustomSelect
                          placeholder={t("category_id_placeholder", {
                            ns: "common",
                          })}
                          options={categories.map((cat) => ({
                            value: cat.id,
                            label: cat.name,
                          }))}
                          value={values.categoryId || null}
                          onChange={(value) => {
                            setFieldValue("categoryId", value);
                            setFieldError("categoryId", undefined);
                          }}
                          disabled={isLoadingCategories}
                        />
                      )}
                      <FormErrorMessage>{errors.categoryId}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.tagIds && touched.tagIds}>
                      <FormLabel>{t("tags_label")}</FormLabel>
                      {isLoadingTags ? (
                        <Spinner size="sm" />
                      ) : (
                        <CheckboxGroup
                          colorScheme="blue"
                          value={values.tagIds}
                          onChange={(value) => {
                            setFieldValue("tagIds", value);
                          }}
                        >
                          <Stack spacing={[1, 5]} direction={["column", "row"]}>
                            {tags.map((tag) => (
                              <Checkbox key={tag.id} value={tag.id}>
                                {tag.name}
                              </Checkbox>
                            ))}
                          </Stack>
                        </CheckboxGroup>
                      )}
                      <FormErrorMessage>{errors.tagIds}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={!!errors.imageFile && touched.imageFile}
                    >
                      <FormLabel>{t("image_label")}</FormLabel>
                      <ImageUploader
                        initialPreviewUrl={inventory?.imageUrl}
                        onFileChange={(file) => {
                          if (file) {
                            setImageRemoved(false);
                          }
                          setFieldValue("imageFile", file);
                        }}
                        onClearError={() =>
                          setFieldError("imageFile", undefined)
                        }
                        onRemove={() => setImageRemoved(true)}
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

export default InventoryUpdateModal;
