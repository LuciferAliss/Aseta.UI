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
  Checkbox,
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import type { HttpError } from '../types/HttpError';
import PasswordInput from '../components/auth/PasswordInput';
import Header from '../components/Header';

const LoginPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { loginAuth, checkAuthStatus, isLoading, isAuthenticated } = useAuth();
  
  const [ t ] = useTranslation("global");

  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault();
    try {
      await loginAuth({ email, password }, rememberMe);
      await checkAuthStatus();
      toast({
        title: t('loginPage.toast.successTitle'),
        position: 'top-right',
        description: t('loginPage.toast.successDescription'),
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      navigate('/');
    } catch (err : any) {
      if (typeof err === 'object' && err !== null && 'status' in err) {
        const error = err as HttpError;
        if (error.response.data.detail === 'LockedOut') {
          toast({
            title: t('loginPage.toast.errorTitle'),
            description: t('loginPage.toast.lockedOutDescription'),
            status: 'error',  
            position: 'top-right',
            duration: 2000,
            isClosable: true,
          });
        } else if (error.response.data.detail === 'Failed') {
          toast({
            title: t('loginPage.toast.errorTitle'),
            description: t('loginPage.toast.badRequestDescription'),
            status: 'error',  
            position: 'top-right',
            duration: 2000,
            isClosable: true,
          });
        } else if ( error.response.data.detail === 'NotAllowed')
        {
          toast({
            title: t('loginPage.toast.errorTitle'),
            description: t('loginPage.toast.notAllowedDescription'),
            status: 'error',  
            position: 'top-right',
            duration: 2000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: t('loginPage.toast.errorTitle'),
          description: t('loginPage.toast.serverErrorDescription'),
          status: 'error',
          position: 'top-right',
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <VStack w={'100%'}>
      <Header />
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
        <VStack spacing={4} as="form" >
          <Heading>{t('loginPage.heading')}</Heading>
          <FormControl isRequired>
            <FormLabel>{t('loginPage.email')}</FormLabel>
            <Input type="email" onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('loginPage.password')}</FormLabel>
            <PasswordInput
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </FormControl>
          
          <Checkbox colorScheme='teal' justifyContent='start' width='100%' isChecked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}>
            {t('loginPage.rememberMe')}
          </Checkbox>

          <Button type="submit" colorScheme="teal" width="full" isLoading={isLoading} >
            {t('loginPage.login')}
          </Button>
          <Text>
            {t('loginPage.noAccount')}{' '}
            <ChakraLink as={RouterLink} to="/register" color="teal.500">
              {t('loginPage.register')}
            </ChakraLink>
          </Text>
        </VStack>
      </Box>

    </VStack>
  );
};

export default LoginPage;