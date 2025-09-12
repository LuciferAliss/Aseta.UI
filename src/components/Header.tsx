import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  useDisclosure,
  useColorModeValue,
  Heading,
  VStack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import LanguageChangeButton from '../components/LanguageChangeButton';
import ThemeChangeButton from './ThemeChangeButton';

const NavLink = ({ children, to }: { children: React.ReactNode; to: string }) => (
  <Link
    as={RouterLink}
    to={to}
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
  >
    {children}
  </Link>
);

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated, logoutAuth } = useAuth();
  const [ t ] = useTranslation("global");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutAuth();
    navigate(0); 
  };

  return (
    <>
      <Box bg={useColorModeValue('gray.50', 'gray.900')} px={4} w="100%" position="fixed" top="0" zIndex={10} boxShadow="md">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />

          <HStack spacing={8} alignItems={'center'}>
            <Heading as={RouterLink} to="/" size="md">
              Aseta
            </Heading>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {isAuthenticated && <NavLink to="/profile">{t('header.profile')}</NavLink>}
            </HStack>
          </HStack>

          <Flex alignItems={'center'}>
            <Flex gap={4}>
              <LanguageChangeButton />
              <ThemeChangeButton />
            </Flex>
            <HStack spacing={2} ml={4} display={{ base: 'none', md: 'flex' }}>
              {isAuthenticated ? (
                <Button onClick={handleLogout} colorScheme="teal" variant="outline" size="sm">
                  {t('header.logout')}
                </Button>
              ) : (
                <>
                  <Button as={RouterLink} to="/login" state={{ from: location }} colorScheme="teal" variant="solid" size="sm">
                    {t('header.login')}
                  </Button>
                </>
              )}
            </HStack>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <VStack as={'nav'} spacing={4} align="stretch">
              {isAuthenticated ? (
                <>
                  <NavLink to="/profile">{t('header.profile')}</NavLink>
                  <Button onClick={handleLogout} colorScheme="teal" variant="outline" width="full">
                    {t('header.logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button as={RouterLink} to="/login" colorScheme="teal" variant="solid" width="full">
                    {t('header.login')}
                  </Button>
                </>
              )}
            </VStack>
          </Box>
        ) : null}
      </Box>
      <Box h={16} />
    </>
  );
}