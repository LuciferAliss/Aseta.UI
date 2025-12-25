import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import auth_en from "./auth/authEn.json";
import auth_ru from "./auth/authRu.json";

import common_en from "./common/commonEn.json";
import common_ru from "./common/commonRu.json";

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false },
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
    resources: {
      en: {
        auth: auth_en,
        common: common_en,
      },
      ru: {
        auth: auth_ru,
        common: common_ru,
      },
    },
  });

export default i18next;
