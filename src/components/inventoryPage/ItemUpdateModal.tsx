import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  NumberInput,
  NumberInputField,
  Switch,
  HStack,
  Box,
  Textarea,
} from "@chakra-ui/react";
import { Formik, Form, Field, type FieldProps } from "formik";
import type { CustomFieldsDefinition } from "../../types/inventory";
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../lib/hooks/useAppToast";
import { updateItem } from "../../lib/services/itemService";
import type {
  UpdateItemRequest,
  CustomFieldValue,
  Item,
} from "../../types/item";
import { useAuth } from "../../lib/contexts/AuthContext";

interface ItemUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryId: string;
  item: Item | null;
  customFieldsDefinition: CustomFieldsDefinition[];
  onItemUpdated: () => void;
}

const ItemUpdateModal = ({
  isOpen,
  onClose,
  inventoryId,
  item,
  customFieldsDefinition,
  onItemUpdated,
}: ItemUpdateModalProps) => {
  const { t } = useTranslation(["inventoryPage", "common"]);
  const { showSuccess, showError } = useAppToast();
  const { user } = useAuth();

  if (!item) {
    return null;
  }

  const initialValues = customFieldsDefinition.reduce((acc, fieldDef) => {
    const existingValue = item.customFieldValues.find(
      (cv) => cv.fieldId === fieldDef.id
    );
    switch (fieldDef.type) {
      case "Checkbox":
        acc[fieldDef.id] = existingValue
          ? existingValue.value === "true"
          : false;
        break;
      default:
        acc[fieldDef.id] = existingValue ? existingValue.value : "";
        break;
    }
    return acc;
  }, {} as Record<string, any>);

  const validateItem = (values: Record<string, any>) => {
    const errors: Record<string, string> = {};
    customFieldsDefinition.forEach((field) => {
      const value = values[field.id];
      switch (field.type) {
        case "Number":
          if (value && isNaN(Number(value))) {
            errors[field.id] = t("itemModal.validation.numberType");
          }
          break;
        case "Date":
          if (value && isNaN(new Date(value).getTime())) {
            errors[field.id] = t("itemModal.validation.dateType");
          }
          break;
      }
    });
    return errors;
  };

  const renderField = (fieldDef: CustomFieldsDefinition) => {
    const name = fieldDef.id;
    switch (fieldDef.type) {
      case "Number":
        return (
          <Field name={name}>
            {({ field, form }: FieldProps) => (
              <FormControl
                isInvalid={!!form.errors[name] && !!form.touched[name]}
              >
                <FormLabel htmlFor={name}>{fieldDef.name}</FormLabel>
                <NumberInput
                  id={name}
                  {...field}
                  onChange={(val) => form.setFieldValue(field.name, val)}
                >
                  <NumberInputField />
                </NumberInput>
                <FormErrorMessage>
                  {form.errors[name] as string}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>
        );
      case "Checkbox":
        return (
          <Field name={name}>
            {({ field, form }: FieldProps) => (
              <FormControl
                isInvalid={!!form.errors[name] && !!form.touched[name]}
              >
                <HStack justifyContent="space-between">
                  <FormLabel htmlFor={name} mb="0">
                    {fieldDef.name}
                  </FormLabel>
                  <Switch
                    id={name}
                    {...field}
                    isChecked={field.value}
                    onChange={(e) =>
                      form.setFieldValue(field.name, e.target.checked)
                    }
                  />
                </HStack>
                <FormErrorMessage>
                  {form.errors[name] as string}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>
        );
      case "Date":
        return (
          <Field name={name}>
            {({ field, form }: FieldProps) => (
              <FormControl
                isInvalid={!!form.errors[name] && !!form.touched[name]}
              >
                <FormLabel htmlFor={name}>{fieldDef.name}</FormLabel>
                <Input type="date" id={name} {...field} />
                <FormErrorMessage>
                  {form.errors[name] as string}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>
        );
      case "MultiLineText":
        return (
          <Field name={name}>
            {({ field, form }: FieldProps) => (
              <FormControl
                isInvalid={!!form.errors[name] && !!form.touched[name]}
              >
                <FormLabel htmlFor={name}>{fieldDef.name}</FormLabel>
                <Textarea id={name} {...field} />
                <FormErrorMessage>
                  {form.errors[name] as string}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>
        );
      case "SingleLineText":
      default:
        return (
          <Field name={name}>
            {({ field, form }: FieldProps) => (
              <FormControl
                isInvalid={!!form.errors[name] && !!form.touched[name]}
              >
                <FormLabel htmlFor={name}>{fieldDef.name}</FormLabel>
                <Input id={name} {...field} />
                <FormErrorMessage>
                  {form.errors[name] as string}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>
        );
    }
  };

  const handleSubmit = async (
    values: Record<string, any>,
    actions: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    if (!item || user?.role !== "Admin") {
      showError(t("updateItemModal.errors.unauthorized"));
      actions.setSubmitting(false);
      return;
    }

    try {
      const customFields: CustomFieldValue[] = customFieldsDefinition.map(
        (field) => ({
          fieldId: field.id,
          value: values[field.id].toString(),
        })
      );

      const requestBody: UpdateItemRequest = {
        customFieldValueRequests: customFields,
      };

      await updateItem(inventoryId, item.id, requestBody);
      showSuccess(t("updateItemModal.success"));
      onItemUpdated();
      onClose();
    } catch (error) {
      showError(t("updateItemModal.errors.generic"));
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />
      <Formik
        initialValues={initialValues}
        validate={validateItem}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(props) => (
          <ModalContent as={Form}>
            <ModalHeader>{t("updateItemModal.title")}</ModalHeader>
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
                {customFieldsDefinition.map((fieldDef) => (
                  <Box key={fieldDef.id} w="100%">
                    {renderField(fieldDef)}
                  </Box>
                ))}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                isLoading={props.isSubmitting}
                colorScheme="blue"
              >
                {t("updateItemModal.updateButton")}
              </Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Formik>
    </Modal>
  );
};

export default ItemUpdateModal;
