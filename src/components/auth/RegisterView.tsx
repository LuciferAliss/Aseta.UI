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

interface RegisterViewProps {
  onSwitchToLogin: () => void;
}

const RegisterView = ({ onSwitchToLogin }: RegisterViewProps) => {
  return (
    <>
      <ModalHeader>
        <Center>
          <Text fontSize="4xl" as="b">
            Sign up
          </Text>
        </Center>
      </ModalHeader>
      <ModalBody>
        <VStack alignItems="left" mb="1rem">
          <Text>Email</Text>
          <Input
            placeholder="Enter email"
            type="email"
            id="inputEmail"
            variant="base"
          />
        </VStack>
        <VStack alignItems="left" mb="1rem">
          <Text>Username</Text>
          <Input
            placeholder="Enter username"
            type="text"
            id="inputUsername"
            variant="base"
          />
        </VStack>
        <VStack alignItems="left" mb="1rem">
          <Text>Password</Text>
          <PasswordInput />
        </VStack>
        <VStack alignItems="left" mb="0.5rem">
          <Text>Confirm Password</Text>
          <PasswordInput />
        </VStack>
      </ModalBody>
      <ModalFooter>
        <VStack w="100%" spacing="1rem">
          <Button variant="base" w="100%" type="submit">
            Sign up
          </Button>
          <Button variant="link" w="100%" onClick={onSwitchToLogin}>
            Already have an account? Sign in
          </Button>
        </VStack>
      </ModalFooter>
    </>
  );
};

export default RegisterView;
