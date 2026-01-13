import {
  Button,
  Text,
  Center,
  Input,
  VStack,
  ModalFooter,
  ModalBody,
  ModalHeader,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import PasswordInput from "./PasswordInput";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../lib/contexts/AuthContext";
import { useAppToast } from "../../lib/hooks/useAppToast";
import { Formik, Field, Form } from "formik";
import type { RefObject } from "react";
import { getTitleError } from "../../lib/utils/errorUtils";
import { VALIDATION_CONSTANTS } from "../../lib/constants";

interface LoginViewProps {
  onSwitchToRegister: () => void;
  ref: RefObject<any>;
}

const LoginView = ({ onSwitchToRegister, ref }: LoginViewProps) => {
  const { t } = useTranslation(["auth", "common"]);
  const { login, isLoading } = useAuth();
  const { showSuccess, showError } = useAppToast();

  const validateForm = (values: any) => {
    const errors: any = {};

    // Email Validation
    if (!/^\S+@\S+$/i.test(values.email)) {
      errors.email = t("validation_errors.email.invalid");
    } else if (values.email.length > VALIDATION_CONSTANTS.EMAIL.MAX_LENGTH) {
      errors.email = t("validation_errors.email.max");
    }

    // Password Validation
    if (!values.password.length) {
      errors.password = t("validation_errors.password.required");
    }

    return errors;
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validate={validateForm}
      onSubmit={async (values) => {
        try {
          await login(values);
          showSuccess(t("login.success_title"), t("login.success_message"));
        } catch (error) {
          let backendErrorTitle = getTitleError(error);

          if (backendErrorTitle) {
            if (backendErrorTitle.startsWith("Users.")) {
              backendErrorTitle = backendErrorTitle.substring("Users.".length);
            }

            const localizedKey = `login.backend_errors.${backendErrorTitle}`;
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
              showError(
                t("backend_error.server_error.title", { ns: "common" }),
                t("backend_error.server_error.description", { ns: "common" })
              );
            }
          } else {
            showError(
              t("backend_error.server_error.title", { ns: "common" }),
              t("backend_error.server_error.description", { ns: "common" })
            );
          }
        }
      }}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {(props) => (
        <Form onSubmit={props.handleSubmit} noValidate>
          <ModalHeader>
            <Center>
              <Text fontSize="4xl" as="b">
                {t("login.title")}
              </Text>
            </Center>
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl
                isInvalid={!!props.errors.email && props.touched.email}
              >
                <FormLabel htmlFor="email">{t("login.email_label")}</FormLabel>
                <Field
                  as={Input}
                  ref={ref}
                  name="email"
                  id="email"
                  type="email"
                  onFocus={() => props.setFieldError("email", undefined)}
                  placeholder={t("login.email_placeholder")}
                />
                <FormErrorMessage>{props.errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={!!props.errors.password && props.touched.password}
              >
                <FormLabel htmlFor="password">
                  {t("login.password_label")}
                </FormLabel>
                <Field
                  as={PasswordInput}
                  id="password"
                  name="password"
                  onFocus={() => props.setFieldError("password", undefined)}
                  placeholder={t("password_input.placeholder")}
                />
                <FormErrorMessage>{props.errors.password}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <VStack w="full" spacing="1rem">
              <Button
                variant="base"
                w="full"
                type="submit"
                isLoading={isLoading}
              >
                {t("login.submit_button")}
              </Button>
              <Button variant="link" w="100%" onClick={onSwitchToRegister}>
                {t("login.switch_to_register")}
              </Button>
            </VStack>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
};

export default LoginView;
