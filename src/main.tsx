import { StrictMode } from 'react'
import { ColorModeScript } from '@chakra-ui/react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from './context/AuthContext.tsx'
import theme from './theme/theme'

import global_en from './translations/en/global.json'
import global_ru from './translations/ru/global.json'
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";


i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
  interpolation: { escapeValue: false }, 
  fallbackLng: 'en',
  detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  resources: {
    en: {
      global: global_en
    },
    ru: {
      global: global_ru
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider>
      <I18nextProvider i18n={i18next}>
        <AuthProvider>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </AuthProvider>
      </I18nextProvider>
    </ChakraProvider>
  </StrictMode>,
)
