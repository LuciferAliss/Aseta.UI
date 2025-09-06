import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ImSphere } from "react-icons/im"

const LanguageChangeButton = () => {
  const [ _, i18n ] = useTranslation('global');

  const handleChangeLanguage = (lang: string) => {
      i18n.changeLanguage(lang);
  }
  
  return (
      <Button leftIcon={<ImSphere /> } onClick={handleChangeLanguage.bind(null, i18n.language === 'en' ? 'ru' : 'en')}>
          {i18n.language === 'en' ? "Ru" : "En"}
      </Button>
  )
}

export default LanguageChangeButton