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
      <MenuButton as={Button} leftIcon={<ImSphere />}>
        {currentLanguage?.name || "English"}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup value={i18n.language} title="Language" type="radio">
          <MenuDivider />
          {languages.map((lang) => (
            <MenuItemOption
              key={lang.code}
              value={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
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
