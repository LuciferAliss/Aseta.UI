// src/components/LoginPage.tsx
import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const { login, loginGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      login({ email, password });
      toast({
        title: 'Вход выполнен успешно.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Ошибка входа.',
        description: 'Неверный email или пароль.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg" margin="auto" mt={20}>
      <VStack spacing={4}>
        <Heading>Вход</Heading>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Пароль</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button colorScheme="teal" onClick={handleLogin} width="full">
          Войти
        </Button>
        <Button colorScheme="teal" onClick={loginGoogle} width="full">
          Вход через Google
        </Button>
      </VStack>
    </Box>
  );
};

export default LoginPage;