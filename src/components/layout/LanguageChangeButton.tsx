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
  const { t } = useTranslation("common");

  const languages = [
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  return (
    <Menu>
      <MenuButton as={Button} variant="ghost" leftIcon={<ImSphere />}>
        {currentLanguage?.name || "English"}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          value={i18n.language}
          title={t("header.language_change_button.title")}
          type="radio"
        >
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
