import {
  Button,
  Text,
  Center,
  Input,
  VStack,
  ModalFooter,
  ModalBody,
  ModalHeader,
} from "@chakra-ui/react";
import PasswordInput from "./PasswordInput";
import { useTranslation } from "react-i18next";
import { type RefObject } from "react";

interface RegisterViewProps {
  onSwitchToLogin: () => void;
  ref: RefObject<any>;
}

const RegisterView = ({ onSwitchToLogin, ref }: RegisterViewProps) => {
  const { t } = useTranslation("auth");

  return (
    <>
      <ModalHeader>
        <Center>
          <Text fontSize="4xl" as="b">
            {t("register.title")}
          </Text>
        </Center>
      </ModalHeader>
      <ModalBody>
        <VStack alignItems="left" mb="1rem">
          <Text>{t("register.email_label")}</Text>
          <Input
            ref={ref}
            placeholder={t("register.email_placeholder")}
            type="email"
            id="inputEmail"
            variant="base"
          />
        </VStack>
        <VStack alignItems="left" mb="1rem">
          <Text>{t("register.username_label")}</Text>
          <Input
            placeholder={t("register.username_placeholder")}
            type="text"
            id="inputUsername"
            variant="base"
          />
        </VStack>
        <VStack alignItems="left" mb="1rem">
          <Text>{t("register.password_label")}</Text>
          <PasswordInput />
        </VStack>
        <VStack alignItems="left" mb="0.5rem">
          <Text>{t("register.confirm_password_label")}</Text>
          <PasswordInput />
        </VStack>
      </ModalBody>
      <ModalFooter>
        <VStack w="100%" spacing="1rem">
          <Button variant="base" w="100%" type="submit">
            {t("register.submit_button")}
          </Button>
          <Button
            variant="link"
            w="100%"
            onClick={onSwitchToLogin}
            _focusVisible={{
              border: "2px solid var(--chakra-colors-focus-border-color)",
            }}
          >
            {t("register.switch_to_login")}
          </Button>
        </VStack>
      </ModalFooter>
    </>
  );
};

export default RegisterView;
