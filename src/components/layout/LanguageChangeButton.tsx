import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ImSphere } from "react-icons/im";

const LanguageChangeButton = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: "ru", name: "Русский" },
    { code: "en", name: "English" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  return (
    <Menu>
      <MenuButton as={Button} variant="base" leftIcon={<ImSphere />}>
        {currentLanguage?.name || "English"}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          defaultValue={i18n.language}
          title="Language"
          type="radio"
        >
          <MenuDivider />
          {languages.map((lang) => (
            <MenuItemOption
              key={lang.code}
              value={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              _hover={{ bg: "menu-item-hover-bg" }}
              _active={{ bg: "menu-item-active-bg" }}
              _focus={{ bg: "menu-item-hover-bg" }}
            >
              {lang.name}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default LanguageChangeButton;
