import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Text,
  Link as ChakraLink,
  useColorModeValue,
  Flex
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ValidError } from '../types/auth/ValidError';
import { HttpStatusCode } from 'axios';
import PasswordInput from '../components/auth/PasswordInput';
import LanguageChangeButton from '../components/LanguageChangeButton';
import ThemeChangeButton from '../components/ThameChangeButton';

const RegisterPage = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { registerAuth, isLoading } = useAuth();

  const [ t ] = useTranslation("global");

  const validateRegistrationData = () => {
    if (password !== confirmPassword) {
      throw new ValidError(t('registerPage.validate.passwordsDoNotMatch'));
    }

    if (password.length < 6) {
      throw new ValidError(t('registerPage.validate.minLength'));
    }

    if (!/[a-z]/.test(password)) {
      throw new ValidError(t('registerPage.validate.lowercase'));
    }

    if (!/[A-Z]/.test(password)) {
      throw new ValidError(t('registerPage.validate.uppercase'));
    }

    if (!/[0-9]/.test(password)) {
      throw new ValidError(t('registerPage.validate.number'));
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new ValidError(t('registerPage.validate.specialChar'));
    }
  }

  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault();

    try {
      validateRegistrationData();
      await registerAuth({ email, password });
      toast({
        title: t('registerPage.toast.successTitle'),
        description: t('registerPage.toast.successDescription'),
        status: 'success',
        position: 'top-right',
        duration: 2000,
        isClosable: true,
      });
      navigate('/login');
    } catch(err) {
      if (typeof err === 'object' && err !== null && 'status' in err) {
        const error = err as { status: number };
        if (error.status === HttpStatusCode.BadRequest) {
          toast({
            title: t('registerPage.toast.errorTitle'),
            description: t('registerPage.toast.badRequestDescription'),
            status: 'error',  
            position: 'top-right',
            duration: 2000,
            isClosable: true,
          });
        } 
      } else if (err instanceof ValidError) {
        toast({
          title: t('registerPage.toast.errorTitle'),
          description: err.message,
          status: 'error',
          position: 'top-right',
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: t('registerPage.toast.errorTitle'),
          description: t('registerPage.toast.serverErrorDescription'),
          status: 'error',
          position: 'top-right',
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <VStack w={'100%'}>

      <Box 
        onSubmit={handleSubmit} 
        p={[4, 6, 8]}
        borderWidth={1} 
        borderRadius={8} 
        boxShadow="lg" 
        margin="auto" 
        width={['100%', '90%', '80%', '450px']}
        bg={useColorModeValue('white', 'gray.700')}
      >
        <VStack spacing={4} as="form">
          <Heading>{t('registerPage.heading')}</Heading>
          <FormControl isRequired>
            <FormLabel>{t('registerPage.email')}</FormLabel>
            <Input type="email" onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('registerPage.password')}</FormLabel>
            <PasswordInput
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('registerPage.confirmPassword')}</FormLabel>
            <PasswordInput
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" width="full" isLoading={isLoading}>
            {t('registerPage.register')}
          </Button>
          <Text>
            {t('registerPage.haveAccount')}{' '}
            <ChakraLink as={RouterLink} to="/login" color="teal.500">
              {t('registerPage.login')}
            </ChakraLink>
          </Text>
        </VStack>
      </Box>

      <Flex w='100%' justifyContent='flex-end' gap={4} alignItems='center' marginBottom={4} marginEnd={4} >
        <ThemeChangeButton />
        <LanguageChangeButton />
      </Flex>

    </VStack>
  );
};

export default RegisterPage;