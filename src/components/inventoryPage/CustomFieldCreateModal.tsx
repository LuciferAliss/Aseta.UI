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
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { Field, Form, Formik, FieldArray, type FieldProps } from "formik";
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../lib/hooks/useAppToast";
import { useAuth } from "../../lib/contexts/AuthContext";
import { CustomSelect } from "../layout/CustomSelect";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  CustomFieldType,
  type CustomFieldsCreateRequest,
  type CustomFieldCreateData,
} from "../../types/customField";
import { createCustomFields } from "../../lib/services/customFieldService";

interface CustomFieldCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryId: string;
  onCustomFieldCreated: () => void;
  trigger?: (onClick: () => void) => React.ReactNode;
}

const FormikCustomSelect = ({
  field,
  form,
  ...props
}: FieldProps & { options: any[]; placeholder?: string }) => {
  const { name } = field;
  const { setFieldValue } = form;

  return (
    <CustomSelect
      {...props}
      value={field.value}
      onChange={(val) => setFieldValue(name, val)}
    />
  );
};

const CustomFieldCreateModal = ({
  isOpen,
  onClose,
  inventoryId,
  onCustomFieldCreated,
  trigger,
}: CustomFieldCreateModalProps) => {
  const { t } = useTranslation("inventoryPage");
  const { showError, showSuccess } = useAppToast();

  const initialValues: CustomFieldsCreateRequest = {
    customFields: [{ name: "", type: CustomFieldType.SingleLineTextType }],
  };

  const validateForm = (values: CustomFieldsCreateRequest) => {
    const errors: any = {};
    const customFieldsErrors: any[] = [];

    values.customFields.forEach((field, index) => {
      const fieldErrors: Partial<CustomFieldCreateData> = {};
      if (!field.name) {
        fieldErrors.name = t("customFieldCreateModal.validation.name_required");
      }
      if (Object.keys(fieldErrors).length > 0) {
        customFieldsErrors[index] = fieldErrors;
      }
    });

    if (customFieldsErrors.length > 0) {
      errors.customFields = customFieldsErrors;
    }

    return errors;
  };

  const handleSubmit = async (
    values: CustomFieldsCreateRequest,
    { setSubmitting }: any
  ) => {
    try {
      await createCustomFields(inventoryId, values);
      showSuccess(t("customFieldCreateModal.success"));
      onCustomFieldCreated();
      onClose();
    } catch (error) {
      showError(t("customFieldCreateModal.errors.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  const fieldTypeOptions = Object.values(CustomFieldType).map((type) => ({
    value: type,
    label: t(`customFieldCreateModal.fieldTypes.${type}`),
  }));

  return (
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
          {({ isSubmitting, errors, values, touched }) => (
            <Form noValidate>
              <ModalHeader>
                <Center>
                  <Text fontSize="2xl" as="b">
                    {t("customFieldCreateModal.title")}
                  </Text>
                </Center>
              </ModalHeader>
              <ModalBody>
                <FieldArray name="customFields">
                  {({ remove, push }) => (
                    <VStack spacing={6}>
                      {values.customFields.map((_, index) => (
                        <HStack
                          key={index}
                          w="full"
                          spacing={2}
                          alignItems="flex-end"
                        >
                          <VStack w="full" spacing={4}>
                            <FormControl
                              isInvalid={
                                !!(errors.customFields?.[index] as any)?.name &&
                                (touched.customFields?.[index] as any)?.name
                              }
                            >
                              <FormLabel>
                                {t("customFieldCreateModal.name_label")}
                              </FormLabel>
                              <Field
                                as={Input}
                                name={`customFields.${index}.name`}
                                placeholder={t(
                                  "customFieldCreateModal.name_placeholder"
                                )}
                              />
                              <FormErrorMessage>
                                {(errors.customFields?.[index] as any)?.name}
                              </FormErrorMessage>
                            </FormControl>
                            <FormControl>
                              <FormLabel>
                                {t("customFieldCreateModal.type_label")}
                              </FormLabel>
                              <Field
                                name={`customFields.${index}.type`}
                                component={FormikCustomSelect}
                                placeholder={t(
                                  "customFieldCreateModal.type_placeholder"
                                )}
                                options={fieldTypeOptions}
                              />
                            </FormControl>
                          </VStack>
                          <IconButton
                            aria-label={t(
                              "customFieldCreateModal.remove_field_button"
                            )}
                            icon={<DeleteIcon />}
                            onClick={() => remove(index)}
                            colorScheme="red"
                            variant="ghost"
                            isDisabled={values.customFields.length <= 1}
                          />
                        </HStack>
                      ))}
                      <Button
                        onClick={() =>
                          push({
                            name: "",
                            type: CustomFieldType.SingleLineTextType,
                          })
                        }
                        leftIcon={<AddIcon />}
                        w="full"
                      >
                        {t("customFieldCreateModal.add_field_button")}
                      </Button>
                    </VStack>
                  )}
                </FieldArray>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  w="full"
                >
                  {t("customFieldCreateModal.submit_button")}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default CustomFieldCreateModal;
