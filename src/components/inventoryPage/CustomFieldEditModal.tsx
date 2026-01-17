import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  FormErrorMessage,
  VStack,
} from "@chakra-ui/react";
import { Formik, Form, Field, type FieldProps } from "formik";
import { useTranslation } from "react-i18next";
import { CustomFieldType, type CustomFieldData } from "../../types/customField";
import { updateCustomField } from "../../lib/services/customFieldService";
import { useAppToast } from "../../lib/hooks/useAppToast";
import { CustomSelect } from "../layout/CustomSelect";

interface CustomFieldEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomFieldUpdated: () => void;
  customField: CustomFieldData | null;
  inventoryId: string;
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

const CustomFieldEditModal = ({
  isOpen,
  onClose,
  onCustomFieldUpdated,
  customField,
  inventoryId,
}: CustomFieldEditModalProps) => {
  const { t } = useTranslation("inventoryPage");
  const { showError, showSuccess } = useAppToast();

  if (!customField) {
    return null;
  }

  const initialValues = {
    name: customField.name,
    type: customField.type,
  };

  const validate = (values: { name: string; type: CustomFieldType }) => {
    const errors: { name?: string; type?: string } = {};
    if (!values.name) {
      errors.name = t("customFieldEditModal.validation.name_required");
    }
    if (!values.type) {
      errors.type = t("customFieldEditModal.validation.type_required");
    }
    return errors;
  };

  const handleSubmit = async (
    values: { name: string; type: CustomFieldType },
    { setSubmitting }: any
  ) => {
    if (!customField) return;

    try {
      await updateCustomField(inventoryId, customField.id, {
        name: values.name,
        type: values.type,
      });
      showSuccess(t("customFieldEditModal.success"));
      onCustomFieldUpdated();
      onClose();
    } catch (error) {
      showError(t("customFieldEditModal.errors.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  const fieldTypeOptions = Object.values(CustomFieldType).map((type) => ({
    value: type,
    label: t(`customFieldCreateModal.fieldTypes.${type}`),
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <ModalHeader>{t("customFieldEditModal.title")}</ModalHeader>
              <ModalCloseButton
                _focusVisible={{
                  ring: "2px",
                  ringColor: "btn-focus-ring",
                  ringOffset: "2px",
                  ringOffsetColor: "app-bg",
                }}
              />
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.name && touched.name}>
                    <FormLabel htmlFor="name">
                      {t("customFieldEditModal.name_label")}
                    </FormLabel>
                    <Field as={Input} id="name" name="name" />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.type && touched.type}>
                    <FormLabel htmlFor="type">
                      {t("customFieldEditModal.type_label")}
                    </FormLabel>
                    <Field
                      name="type"
                      component={FormikCustomSelect}
                      placeholder={t("customFieldEditModal.type_placeholder")}
                      options={fieldTypeOptions}
                    />
                    <FormErrorMessage>{errors.type}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose} mr={3}>
                  {t("customFieldEditModal.cancelButton")}
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  {t("customFieldEditModal.updateButton")}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default CustomFieldEditModal;
