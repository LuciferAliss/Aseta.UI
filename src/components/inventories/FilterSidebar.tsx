import {
  VStack,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Box,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  Input,
} from "@chakra-ui/react";
import { Field, type FormikProps, type FieldProps } from "formik";
import { sortByOptions, sortOrderOptions } from "../../types/inventory";
import type { FilterFormValues } from "../../pages/InventoryCatalogPage";
import DatePicker from "../layout/DatePicker";

const FilterSidebar = (props: FormikProps<FilterFormValues>) => {
  return (
    <Box p={6} as="form" onSubmit={props.handleSubmit} noValidate>
      <VStack spacing={6} align="stretch">
        <Heading size="md" textAlign="center">
          Filters
        </Heading>

        <FormControl>
          <FormLabel as="legend">Sort By</FormLabel>
          <Field name="sortBy">
            {({ field, form }: FieldProps) => (
              <RadioGroup
                {...field}
                onChange={(val) => form.setFieldValue(field.name, val)}
              >
                <Stack spacing={2}>
                  {sortByOptions.map((option) => (
                    <Radio key={option} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            )}
          </Field>
        </FormControl>

        <FormControl>
          <FormLabel as="legend">Sort Order</FormLabel>
          <Field name="sortOrder">
            {({ field, form }: FieldProps) => (
              <RadioGroup
                {...field}
                onChange={(val) => form.setFieldValue(field.name, val)}
              >
                <Stack spacing={2}>
                  {sortOrderOptions.map((option) => (
                    <Radio key={option} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            )}
          </Field>
        </FormControl>

        <Field name="pageSize">
          {({ field, form }: FieldProps) => (
            <FormControl
              isInvalid={!!form.errors.pageSize && !!form.touched.pageSize}
            >
              <FormLabel>Items per page</FormLabel>
              <NumberInput
                {...field}
                id="pageSize"
                min={1}
                onChange={(val) => form.setFieldValue(field.name, val)}
              >
                <NumberInputField />
              </NumberInput>
              <FormErrorMessage>
                {form.errors.pageSize as string}
              </FormErrorMessage>
            </FormControl>
          )}
        </Field>

        <Field name="minItemsCount">
          {({ field, form }: FieldProps) => (
            <FormControl
              isInvalid={
                !!form.errors.minItemsCount && !!form.touched.minItemsCount
              }
            >
              <FormLabel>Item minimum count</FormLabel>
              <NumberInput
                {...field}
                id="minItemsCount"
                onChange={(val) => form.setFieldValue(field.name, val)}
              >
                <NumberInputField />
              </NumberInput>
              <FormErrorMessage>
                {form.errors.minItemsCount as string}
              </FormErrorMessage>
            </FormControl>
          )}
        </Field>

        <Field name="maxItemsCount">
          {({ field, form }: FieldProps) => (
            <FormControl
              isInvalid={
                !!form.errors.maxItemsCount && !!form.touched.maxItemsCount
              }
            >
              <FormLabel>Item maximum count</FormLabel>
              <NumberInput
                {...field}
                id="maxItemsCount"
                onChange={(val) => form.setFieldValue(field.name, val)}
              >
                <NumberInputField />
              </NumberInput>
              <FormErrorMessage>
                {form.errors.maxItemsCount as string}
              </FormErrorMessage>
            </FormControl>
          )}
        </Field>

        <FormControl
          isInvalid={
            !!props.errors.createdAtFrom && !!props.touched.createdAtFrom
          }
        >
          <FormLabel>Created At From</FormLabel>
          <Field name="createdAtFrom">
            {({ field }: FieldProps<Date | null>) => (
              <DatePicker
                selected={field.value}
                onChange={(date) => props.setFieldValue(field.name, date)}
                showTimeSelect
              />
            )}
          </Field>
          <FormErrorMessage>
            {props.errors.createdAtFrom as string}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={!!props.errors.createdAtTo && !!props.touched.createdAtTo}
        >
          <FormLabel>Created At To</FormLabel>
          <Field name="createdAtTo" component={DatePicker} showTimeSelect />
          <FormErrorMessage>
            {props.errors.createdAtTo as string}
          </FormErrorMessage>
        </FormControl>

        <Button type="submit" w="full">
          Apply Filters
        </Button>
      </VStack>
    </Box>
  );
};

export default FilterSidebar;
