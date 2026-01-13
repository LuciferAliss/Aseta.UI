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
import { type RefObject } from "react";
import { Field, Form, Formik } from "formik";
import { useAppToast } from "../../lib/hooks/useAppToast";
import { useAuth } from "../../lib/contexts/AuthContext";
import { VALIDATION_CONSTANTS } from "../../lib/constants";

interface RegisterViewProps {
  onSwitchToLogin: () => void;
  ref: RefObject<any>;
}

const RegisterView = ({ onSwitchToLogin, ref }: RegisterViewProps) => {
  const { register, isLoading } = useAuth();
  const { showSuccess, showError } = useAppToast();

  const { t } = useTranslation("auth");

  const validateForm = (values: any) => {
    const errors: any = {};

    // Email Validation
    if (!values.email) {
      errors.email = t("validation_errors.email.required");
    } else if (!/^\S+@\S+$/i.test(values.email)) {
      errors.email = t("validation_errors.email.invalid");
    } else if (values.email.length > VALIDATION_CONSTANTS.EMAIL.MAX_LENGTH) {
      errors.email = t("validation_errors.email.max");
    }

    // Password Validation
    if (!values.password) {
      errors.password = t("validation_errors.password.required");
    } else if (
      values.password.length < VALIDATION_CONSTANTS.PASSWORD.MIN_LENGTH
    ) {
      errors.password = t("validation_errors.password.min");
    } else if (
      values.password.length > VALIDATION_CONSTANTS.PASSWORD.MAX_LENGTH
    ) {
      errors.password = t("validation_errors.password.max");
    } else if (!/[A-Z]/.test(values.password)) {
      errors.password = t("validation_errors.password.uppercase");
    } else if (!/[a-z]/.test(values.password)) {
      errors.password = t("validation_errors.password.lowercase");
    } else if (!/[0-9]/.test(values.password)) {
      errors.password = t("validation_errors.password.digit");
    } else if (!/[^a-zA-Z0-9]/.test(values.password)) {
      errors.password = t("validation_errors.password.special");
    }

    // Confirm Password Validation
    if (!values.confirmPassword) {
      errors.confirmPassword = t("validation_errors.password.required"); // Reusing for consistency
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = t("validation_errors.passwords_not_match");
    }

    // Username Validation
    if (!values.userName) {
      errors.userName = t("validation_errors.username.required");
    } else if (
      values.userName.length < VALIDATION_CONSTANTS.USER_NAME.MIN_LENGTH
    ) {
      errors.userName = t("validation_errors.username.min");
    } else if (
      values.userName.length > VALIDATION_CONSTANTS.USER_NAME.MAX_LENGTH
    ) {
      errors.userName = t("validation_errors.username.max");
    }

    return errors;
  };

  return (
    <Formik
      initialValues={{
        email: "",
        userName: "",
        password: "",
        confirmPassword: "",
      }}
      validate={validateForm}
      onSubmit={async (values) => {
        try {
          await register(values);
          showSuccess(
            t("register.success_title"),
            t("register.success_message")
          );
        } catch (error) {
          showError(t("register.error_title"), "erwf");
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
                {t("register.title")}
              </Text>
            </Center>
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl
                isInvalid={!!props.errors.email && props.touched.email}
              >
                <FormLabel>{t("register.email_label")}</FormLabel>
                <Field
                  as={Input}
                  ref={ref}
                  name="email"
                  id="email"
                  type="email"
                  onFocus={() => props.setFieldError("email", undefined)}
                  placeholder={t("register.email_placeholder")}
                />
                <FormErrorMessage>{props.errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={!!props.errors.userName && props.touched.userName}
              >
                <FormLabel>{t("register.username_label")}</FormLabel>
                <Field
                  as={Input}
                  name="userName"
                  id="userName"
                  type="text"
                  onFocus={() => props.setFieldError("userName", undefined)}
                  placeholder={t("register.username_placeholder")}
                />
                <FormErrorMessage>{props.errors.userName}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={!!props.errors.password && props.touched.password}
              >
                <FormLabel>{t("register.password_label")}</FormLabel>
                <Field
                  as={PasswordInput}
                  name="password"
                  id="password"
                  onFocus={() => props.setFieldError("password", undefined)}
                  placeholder={t("password_input.placeholder")}
                />
                <FormErrorMessage>{props.errors.password}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={
                  !!props.errors.confirmPassword &&
                  props.touched.confirmPassword
                }
              >
                <FormLabel>{t("register.confirm_password_label")}</FormLabel>
                <Field
                  as={PasswordInput}
                  name="confirmPassword"
                  id="confirmPassword"
                  onFocus={() =>
                    props.setFieldError("confirmPassword", undefined)
                  }
                  placeholder={t("password_input.confirm_placeholder")}
                />
                <FormErrorMessage>
                  {props.errors.confirmPassword}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <VStack w="100%" spacing="1rem">
              <Button
                variant="base"
                w="100%"
                type="submit"
                isLoading={isLoading}
              >
                {t("register.submit_button")}
              </Button>
              <Button variant="link" w="100%" onClick={onSwitchToLogin}>
                {t("register.switch_to_login")}
              </Button>
            </VStack>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterView;
