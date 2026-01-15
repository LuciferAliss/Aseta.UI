import {
  VStack,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  Checkbox,
  CheckboxGroup,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { Field, type FormikProps, type FieldProps, Form } from "formik";
import { sortByOptions, sortOrderOptions } from "../../types/inventory";
import type { FilterFormValues } from "../../pages/InventoryCatalogPage";
import DatePicker from "../layout/DatePicker";
import { useTranslation } from "react-i18next";
import { type CategoryResponse } from "../../types/category";
import { type TagResponse } from "../../types/tag";

interface FilterSidebarProps extends FormikProps<FilterFormValues> {
  onReset: () => void;
  categories: CategoryResponse[];
  isLoadingCategories: boolean;
  tags: TagResponse[];
  isLoadingTags: boolean;
}

const FilterSidebar = (props: FilterSidebarProps) => {
  const { t } = useTranslation("inventoryCatalog");
  const { categories, isLoadingCategories, tags, isLoadingTags } = props;

  return (
    <Form onSubmit={props.handleSubmit} noValidate>
      <VStack spacing={6} align="stretch">
        <Heading size="md" textAlign="center">
          {t("filter_sidebar.filters_title")}
        </Heading>

        <FormControl>
          <FormLabel as="legend">{t("filter_sidebar.sort_by")}</FormLabel>
          <Field name="sortBy">
            {({ field, form }: FieldProps) => (
              <RadioGroup
                {...field}
                onChange={(val) => form.setFieldValue(field.name, val)}
              >
                <Stack spacing={2}>
                  {sortByOptions.map((option) => (
                    <Radio key={option} value={option}>
                      {t(`filter_sidebar.sort_options.${option}`)}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            )}
          </Field>
        </FormControl>

        <FormControl>
          <FormLabel as="legend">{t("filter_sidebar.sort_order")}</FormLabel>
          <Field name="sortOrder">
            {({ field, form }: FieldProps) => (
              <RadioGroup
                {...field}
                onChange={(val) => form.setFieldValue(field.name, val)}
              >
                <Stack spacing={2}>
                  {sortOrderOptions.map((option) => (
                    <Radio key={option} value={option}>
                      {t(`filter_sidebar.sort_order_options.${option}`)}
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
              <FormLabel htmlFor="pageSize">
                {t("filter_sidebar.items_per_page")}
              </FormLabel>
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
              <FormLabel htmlFor="minItemsCount">
                {t("filter_sidebar.item_minimum_count")}
              </FormLabel>
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
              <FormLabel htmlFor="maxItemsCount">
                {t("filter_sidebar.item_maximum_count")}
              </FormLabel>
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

        <Field name="createdAtFrom">
          {({ field, form }: FieldProps<Date | null>) => (
            <FormControl
              isInvalid={
                !!form.errors.createdAtFrom && !!form.touched.createdAtFrom
              }
            >
              <VStack align="stretch">
                <FormLabel htmlFor="createdAtFrom">
                  {t("filter_sidebar.created_at_from")}
                </FormLabel>
                <DatePicker
                  selected={field.value}
                  onChange={(date) => form.setFieldValue(field.name, date)}
                  showTimeSelect
                />
              </VStack>
              <FormErrorMessage>
                {form.errors.createdAtFrom as string}
              </FormErrorMessage>
            </FormControl>
          )}
        </Field>

        <Field name="createdAtTo">
          {({ field, form }: FieldProps<Date | null>) => (
            <FormControl
              isInvalid={
                !!form.errors.createdAtTo && !!form.touched.createdAtTo
              }
            >
              <VStack align="stretch">
                <FormLabel htmlFor="createdAtTo">
                  {t("filter_sidebar.created_at_to")}
                </FormLabel>
                <DatePicker
                  selected={field.value}
                  onChange={(date) => form.setFieldValue(field.name, date)}
                  showTimeSelect
                />
              </VStack>
              <FormErrorMessage>
                {form.errors.createdAtTo as string}
              </FormErrorMessage>
            </FormControl>
          )}
        </Field>

        <FormControl>
          <FormLabel as="legend">
            {t("filter_sidebar.categories_title")}
          </FormLabel>
          {isLoadingCategories ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <Field name="categoryIds">
              {({ field, form }: FieldProps) => (
                <CheckboxGroup
                  {...field}
                  onChange={(val) => form.setFieldValue(field.name, val)}
                >
                  <Stack spacing={2}>
                    {categories.map((category) => (
                      <Checkbox key={category.id} value={category.id}>
                        {category.name}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              )}
            </Field>
          )}
        </FormControl>

        <FormControl>
          <FormLabel as="legend">
            {t("filter_sidebar.tags_title")}
          </FormLabel>
          {isLoadingTags ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <Field name="tagIds">
              {({ field, form }: FieldProps) => (
                <CheckboxGroup
                  {...field}
                  onChange={(val) => form.setFieldValue(field.name, val)}
                >
                  <Stack spacing={2}>
                    {tags.map((tag) => (
                      <Checkbox key={tag.id} value={tag.id}>
                        {tag.name}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              )}
            </Field>
          )}
        </FormControl>

        <Button type="submit" w="full">
          {t("filter_sidebar.apply_filters")}
        </Button>
        <Button variant="link" w="full" onClick={props.onReset}>
          {t("filter_sidebar.reset_filters")}
        </Button>
      </VStack>
    </Form>
  );
};

export default FilterSidebar;
