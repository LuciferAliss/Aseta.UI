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

interface LoginViewProps {
  onSwitchToRegister: () => void;
}

const LoginView = ({ onSwitchToRegister }: LoginViewProps) => {
  return (
    <>
      <ModalHeader>
        <Center>
          <Text fontSize="4xl" as="b">
            Sign in
          </Text>
        </Center>
      </ModalHeader>
      <ModalBody>
        <VStack alignItems="left" mb="1rem">
          <Text>Email</Text>
          <Input
            placeholder="Enter email"
            type="email"
            id="email"
            variant="base"
          />
        </VStack>
        <VStack alignItems="left" mb="0.5rem">
          <Text>Password</Text>
          <PasswordInput />
        </VStack>
      </ModalBody>
      <ModalFooter>
        <VStack w="100%" spacing="1rem">
          <Button variant="base" w="100%" type="submit">
            Sign in
          </Button>
          <Button variant="link" w="100%" onClick={onSwitchToRegister}>
            Don't have an account? Sign up
          </Button>
        </VStack>
      </ModalFooter>
    </>
  );
};

export default LoginView;
