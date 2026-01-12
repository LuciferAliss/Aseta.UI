import { Box, VStack, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, type FieldProps } from "formik";
import { ru } from "date-fns/locale/ru";
import { enUS } from "date-fns/locale/en-US";
import { registerLocale } from "react-datepicker";

import DatePicker from "../components/layout/DatePicker";

import "react-datepicker/dist/react-datepicker.css";
import "../theme/datepicker.css";

registerLocale("ru", ru);
registerLocale("en", enUS);

interface FormValues {
  dateOnly: Date | null;
  dateTime: Date | null;
}

const DatePickerTestPage = () => {
  const { t } = useTranslation("common");

  const initialValues: FormValues = {
    dateOnly: new Date(),
    dateTime: new Date(),
  };

  const onSubmit = (values: FormValues) => {
    console.log("Form submitted:", values);
  };

  return (
    <Box p={8}>
      <VStack spacing={8} align="start">
        <Heading as="h1" size="xl">
          {t("datePickerTestPage.title")}
        </Heading>

        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ setFieldValue, values }) => (
            <Form>
              <VStack spacing={4} align="start">
                <Field name="dateOnly">
                  {({ field }: FieldProps<Date | null>) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => setFieldValue(field.name, date)}
                    />
                  )}
                </Field>

                <Field name="dateTime">
                  {({ field }: FieldProps<Date | null>) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => setFieldValue(field.name, date)}
                      showTimeSelect
                    />
                  )}
                </Field>
                {/* You can add a submit button here if needed */}
                {/* <Button type="submit">Submit</Button> */}
              </VStack>
            </Form>
          )}
        </Formik>
      </VStack>
    </Box>
  );
};

export default DatePickerTestPage;
