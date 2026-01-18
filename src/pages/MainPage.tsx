import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAuth } from "../lib/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../lib/routes";
import InventoryCreateModal from "../components/inventoriesCreate/InventoryCreateModal";
import { useTranslation } from "react-i18next";
import AuthModal from "../components/auth/AuthModal";

const MainPage = () => {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("main");

  return (
    <Flex gap="1rem" direction="column">
      <VStack
        spacing={4}
        textAlign="center"
        p={8}
        _light={{ bg: "violet.600" }}
        _dark={{ bg: "violet.800" }}
        bgPos="center"
        bgSize="cover"
        minH="40vh"
        maxW="100vw"
        justifyContent="center"
      >
        <Heading
          as="h1"
          size={{ base: "2xl", md: "3xl", lg: "4xl" }}
          fontWeight="extrabold"
        >
          {t("hero.title")}
        </Heading>
        <Text fontSize={{ base: "lg", md: "xl", lg: "2xl" }}>
          {t("hero.subtitle")}
        </Text>
      </VStack>

      <Box p={10}>
        <Heading
          as="h2"
          size={{ base: "lg", md: "xl" }}
          textAlign="center"
          mb={10}
        >
          {t("actions.title")}
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Container variant="card">
            <VStack spacing={4} alignItems="flex-start" h="100%">
              <Heading as="h3" size="md">
                {t("actions.catalog.title")}
              </Heading>
              <Text>{t("actions.catalog.description")}</Text>
              <Spacer />
              <Button w="100%" onClick={() => navigate(ROUTES.inventories)}>
                {t("actions.catalog.button")}
              </Button>
            </VStack>
          </Container>

          <Container variant="card">
            <VStack spacing={4} alignItems="flex-start" h="100%">
              <Heading as="h3" size="md">
                {t("actions.create.title")}
              </Heading>
              <Text>{t("actions.create.description")}</Text>
              <Spacer />
              <InventoryCreateModal />
            </VStack>
          </Container>

          {isAuth ? (
            <Container variant="card">
              <VStack spacing={4} alignItems="flex-start" h="100%">
                <Heading as="h3" size="md">
                  {t("actions.profile.title")}
                </Heading>
                <Text>{t("actions.profile.description")}</Text>
                <Spacer />
                <Button w="100%">{t("actions.profile.button")}</Button>
              </VStack>
            </Container>
          ) : (
            <Container variant="card">
              <VStack spacing={4} alignItems="flex-start" h="100%">
                <Heading as="h3" size="md">
                  {t("actions.login.title")}
                </Heading>
                <Text>{t("actions.login.description")}</Text>
                <Spacer />
                <AuthModal variant="base" w="full" />
              </VStack>
            </Container>
          )}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default MainPage;
