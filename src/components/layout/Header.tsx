import { Box, Flex, Heading, Spacer } from "@chakra-ui/react";
import LanguageChangeButton from "./LanguageChangeButton";
import ThemeChangeButton from "./ThemeChangeButton";
import AuthModal from "../auth/AuthModal";
import { Link } from "react-router-dom";
import { ROUTES } from "../../lib/routes";
import { useAuth } from "../../lib/contexts/AuthContext";
import UserMenu from "./UserMenu";

const Header = () => {
  const { isAuth, user } = useAuth();

  return (
    <Box
      as="header"
      // 1. Уменьшаем паддинги на мобилках (base: 2), на десктопе оставляем 4
      py={2}
      px={{ base: 2, md: 4 }}
      bg="header-bg"
      boxShadow="header-bottom-glow"
      data-testid="header"
      position="sticky"
      top={0}
      zIndex={10}
      w="100%" // Явно задаем ширину
    >
      <Flex alignItems="center">
        <Heading
          as={Link}
          to={ROUTES.main}
          // 2. Уменьшаем размер шрифта логотипа на мобилках
          size={{ base: "md", md: "lg" }}
          fontWeight="extrabold"
          letterSpacing="tight"
          bg="text-brand"
          bgClip="text"
          mr={2} // Небольшой отступ справа от логотипа
          _hover={{
            bg: "text-brand-hover",
            bgClip: "text",
          }}
          _focusVisible={{
            borderRadius: "lg",
            outline: "none",
            ring: "2px",
            ringColor: "btn-focus-ring",
            ringOffset: "2px",
            ringOffsetColor: "app-bg",
          }}
        >
          ASETA
        </Heading>

        <Spacer />

        {/* 3. Уменьшаем расстояние между кнопками (gap) */}
        <Flex gap={{ base: 1, md: 2 }} alignItems="center">
          <LanguageChangeButton />
          <ThemeChangeButton />
          {isAuth && user ? <UserMenu /> : <AuthModal />}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
