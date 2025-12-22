import { Button, Text, Center, Input, VStack } from "@chakra-ui/react";
import PasswordInput from "../components/auth/PasswordInput";
import CardBox from "../components/common/CardBox";

const LoginPage = () => {
  return (
    <Center h="100vh">
      <CardBox>
        <Text fontSize="4xl" as="b" align="center">
          Login
        </Text>
        <VStack alignItems="left">
          <Text>Email</Text>
          <Input placeholder="Email" type="email" id="email" variant="auth" />
        </VStack>
        <VStack alignItems="left">
          <Text>Password</Text>
          <PasswordInput />
        </VStack>
        <Button type="submit" mt="1rem">
          Login
        </Button>
      </CardBox>
    </Center>
  );
};

export default LoginPage;
