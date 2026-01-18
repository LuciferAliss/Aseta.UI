import {
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  VStack,
  Button,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";

interface AdminMobileNavProps {
  setTabIndex: (index: number) => void;
}

const AdminMobileNav = ({ setTabIndex }: AdminMobileNavProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation("admin");

  const handleSelect = (index: number) => {
    setTabIndex(index);
    onClose();
  };

  return (
    <Box display={{ base: "block", md: "none" }} mb={4}>
      <IconButton
        aria-label="Open menu"
        icon={<HamburgerIcon />}
        onClick={onOpen}
      />
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">{t("title")}</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch">
              <Button onClick={() => handleSelect(0)} w="full">
                {t("tags.title")}
              </Button>
              <Button onClick={() => handleSelect(1)} w="full">
                {t("categories.title")}
              </Button>
              <Button onClick={() => handleSelect(2)} w="full">
                {t("users.title")}
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default AdminMobileNav;
