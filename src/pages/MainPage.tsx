import { Box, Button, Container, Grid, GridItem } from '@chakra-ui/react';
import Headers from '../components/Header';
import LatestInventories from '../components/main/LatestInventories';
import PopularInventories from '../components/main/PopularInventories';
import TagCloud from '../components/main/TagCloud';
import { useAuth } from '../hooks/useAuth';
import { Link as RouterLink } from 'react-router-dom';

const MainPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box w='100%' maxW="100vw" overflowX="hidden">
      <Headers />
      <Container maxW="container.xl" py={5}>
        <Grid
          templateAreas={{
            base: `"tags" "popular" "latest"`,
            lg: `"popular tags" "latest  tags"`,
          }}
          templateColumns={{ base: '1fr', lg: '2fr 1fr' }}
          gap={6}
        >
          <GridItem area="popular">
            <PopularInventories />
          </GridItem>
          
          <GridItem area="latest">
            <LatestInventories />
          </GridItem>

          <GridItem area="tags">
            <TagCloud />   
            {isAuthenticated ? <Button mt={5} w="100%" as={RouterLink} to="/create-inventory" colorScheme="teal">Создать инвентарь</Button> : null}
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default MainPage;