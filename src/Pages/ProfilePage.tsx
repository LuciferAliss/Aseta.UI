// src/pages/ProfilePage.tsx
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  const { user, logoutAuth } = useAuth();

  return (
    <Box p={8}>
      <Heading>Profile</Heading>
      {user && <Text>Welcome, {user.email}!</Text>}
      <Button mt={4} onClick={logoutAuth}>
        Logout
      </Button>
    </Box>
  );
};

export default ProfilePage;