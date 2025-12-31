import { Box, Flex, Heading, Spacer } from "@chakra-ui/react";
import LanguageChangeButton from "./LanguageChangeButton";
import ThemeChangeButton from "./ThemeChangeButton";
import AuthModal from "../auth/AuthModal";
import { Link } from "react-router-dom";
import { ROUTES } from "../../lib/routes";

const Header = () => {
  return (
    <Box
      as="header"
      py={2}
      px={4}
      bg="header-bg"
      boxShadow="header-bottom-glow"
      data-testid="header"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex alignItems="center">
        <Heading
          as={Link}
          to={ROUTES.main}
          size="lg"
          fontWeight="extrabold"
          letterSpacing="tight"
          bg="text-brand"
          bgClip="text"
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
        <Flex gap={2}>
          <LanguageChangeButton />
          <ThemeChangeButton />
          <AuthModal />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
