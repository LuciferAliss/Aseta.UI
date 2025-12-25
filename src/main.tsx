import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme";

import i18next from "./translations/i18nextInit.ts";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <I18nextProvider i18n={i18next}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nextProvider>
    </ChakraProvider>
  </StrictMode>
);
