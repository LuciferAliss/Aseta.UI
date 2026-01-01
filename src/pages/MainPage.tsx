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

const MainPage = () => {
  const isLoggedIn = false;

  return (
    <Flex gap="1rem" direction="column" flex="1">
      <VStack
        spacing={4}
        textAlign="center"
        p={8}
        _light={{ bg: "violet.450" }}
        _dark={{ bg: "violet.800" }}
        bgPos="center"
        bgSize="cover"
        minH="40vh"
        maxW="100vw"
        justifyContent="center"
      >
        <Heading as="h1" size="4xl">
          Добро пожаловать в Aseta!
        </Heading>
        <Text fontSize="2xl">
          Порядок в каждой детали. Ваши инвентари под полным контролем.
        </Text>
      </VStack>

      <Box p={10}>
        <Heading as="h2" size="xl" textAlign="center" mb={10}>
          Основные действия
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Container variant="card">
            <VStack spacing={4} alignItems="flex-start" h="100%">
              <Heading as="h3" size="md">
                Каталог инвентарей
              </Heading>
              <Text>
                Изучайте и ищите среди всех общедоступных инвентарей, созданных
                другими пользователями.
              </Text>
              <Spacer />
              <Button w="100%">Перейти к каталогу</Button>
            </VStack>
          </Container>

          <Container variant="card">
            <VStack spacing={4} alignItems="flex-start" h="100%">
              <Heading as="h3" size="md">
                Создать инвентарь
              </Heading>
              <Text>
                Начните с нуля и создайте свой личный инвентарь с уникальными
                полями и настройками.
              </Text>
              <Spacer />
              <Button w="100%">Создать</Button>
            </VStack>
          </Container>

          {isLoggedIn ? (
            <Container variant="card">
              <VStack spacing={4} alignItems="flex-start" h="100%">
                <Heading as="h3" size="md">
                  Ваш профиль
                </Heading>
                <Text>
                  Управляйте настройками своего аккаунта, отслеживайте
                  активность и личные данные.
                </Text>
                <Spacer />
                <Button w="100%">Перейти в профиль</Button>
              </VStack>
            </Container>
          ) : (
            <Container variant="card">
              <VStack spacing={4} alignItems="flex-start" h="100%">
                <Heading as="h3" size="md">
                  Вход
                </Heading>
                <Text>
                  Войдите в свой профиль, чтобы управлять личными инвентарями,
                  или зарегистрируйтесь, чтобы начать.
                </Text>
                <Spacer />
                <Button w="100%">Войти</Button>
              </VStack>
            </Container>
          )}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default MainPage;
