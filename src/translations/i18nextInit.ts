import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import authEn from "./auth/authEn.json";
import authRu from "./auth/authRu.json";

import commonEn from "./common/commonEn.json";
import commonRu from "./common/commonRu.json";

import inventoryCatalogEn from "./inventoryCatalog/inventoryCatalogEn.json";
import inventoryCatalogRu from "./inventoryCatalog/inventoryCatalogRu.json";

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
        auth: authEn,
        common: commonEn,
        inventoryCatalog: inventoryCatalogEn,
      },
      ru: {
        auth: authRu,
        common: commonRu,
        inventoryCatalog: inventoryCatalogRu,
      },
    },
  });

export default i18next;
