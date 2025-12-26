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
import type { RefObject } from "react";

interface LoginViewProps {
  onSwitchToRegister: () => void;
  ref: RefObject<any>;
}

const LoginView = ({ onSwitchToRegister, ref }: LoginViewProps) => {
  const { t } = useTranslation("auth");

  return (
    <>
      <ModalHeader>
        <Center>
          <Text fontSize="4xl" as="b">
            {t("login.title")}
          </Text>
        </Center>
      </ModalHeader>
      <ModalBody>
        <VStack alignItems="left" mb="1rem">
          <Text>{t("login.email_label")}</Text>
          <Input
            ref={ref}
            placeholder={t("login.email_placeholder")}
            type="email"
            id="email"
            variant="base"
          />
        </VStack>
        <VStack alignItems="left" mb="0.5rem">
          <Text>{t("login.password_label")}</Text>
          <PasswordInput />
        </VStack>
      </ModalBody>
      <ModalFooter>
        <VStack w="100%" spacing="1rem">
          <Button variant="base" w="100%" type="submit">
            {t("login.submit_button")}
          </Button>
          <Button variant="link" w="100%" onClick={onSwitchToRegister}>
            {t("login.switch_to_register")}
          </Button>
        </VStack>
      </ModalFooter>
    </>
  );
};

export default LoginView;
