import { Box, Flex, IconButton, Link, Text } from "@chakra-ui/react";
import { FaGithub, FaTelegram } from "react-icons/fa";

const Footer = () => {
  return (
    <Box as="footer" py={2} px={4} bg="header-bg" boxShadow="footer-top-glow">
      <Flex alignItems="center">
        <Box flex={1} />

        <Text fontSize="sm" color="text-secondary" whiteSpace="nowrap">
          © {new Date().getFullYear()} Aseta. Все права защищены.
        </Text>

        <Flex flex={1} justifyContent="flex-end">
          <IconButton
            as={Link}
            href="https://github.com/LuciferAliss"
            isExternal
            aria-label="GitHub"
            variant="ghost"
            icon={<FaGithub fontSize="1.25rem" />}
          />
          <IconButton
            as={Link}
            href="https://t.me/LuciferAliss"
            isExternal
            aria-label="Telegram"
            variant="ghost"
            icon={<FaTelegram fontSize="1.25rem" />}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
