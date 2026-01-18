import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import authEn from "./auth/authEn.json";
import authRu from "./auth/authRu.json";

import commonEn from "./common/commonEn.json";
import commonRu from "./common/commonRu.json";

import inventoryCatalogEn from "./inventoryCatalog/inventoryCatalogEn.json";
import inventoryCatalogRu from "./inventoryCatalog/inventoryCatalogRu.json";

import inventoryCreateEn from "./inventoryCreate/inventoryCreateEn.json";
import inventoryCreateRu from "./inventoryCreate/inventoryCreateRu.json";

import inventoryPageEn from "./inventoryPage/inventoryPageEn.json";
import inventoryPageRu from "./inventoryPage/inventoryPageRu.json";

import adminEn from "./admin/adminEn.json";
import adminRu from "./admin/adminRu.json";

import mainPageEn from "./main/mainPageEn.json";
import mainPageRu from "./main/mainPageRu.json";

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
        inventoryCreate: inventoryCreateEn,
        inventoryPage: inventoryPageEn,
        admin: adminEn,
        main: mainPageEn,
      },
      ru: {
        auth: authRu,
        common: commonRu,
        inventoryCatalog: inventoryCatalogRu,
        inventoryCreate: inventoryCreateRu,
        inventoryPage: inventoryPageRu,
        admin: adminRu,
        main: mainPageRu,
      },
    },
  });

export default i18next;
