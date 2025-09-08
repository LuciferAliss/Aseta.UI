import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';

const ProfilePage = () => {
  const { user, logoutAuth } = useAuth();

  return (
    <>
      <Header />
      <Box p={4}>
        <Heading as="h2" size="xl" mb={4}>
          {user?.email}
        </Heading>
        <Text mb={2}>Email: {user?.email}</Text>
        <Button colorScheme="red" onClick={logoutAuth}>
          Logout
        </Button>
      </Box>
    </>
  );
};

export default ProfilePage;