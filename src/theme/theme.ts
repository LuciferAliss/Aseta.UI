import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { colors } from "./colors";
import { semanticTokens } from "./semanticTokens";
import { shadows } from "./shadows";
import { components } from "./components";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors,
  semanticTokens,
  styles: {
    global: () => ({
      body: {
        bg: "app-bg",
        color: "text-primary",
      },
    }),
  },
  shadows: {
    ...shadows,
  },
  components,
});

export default theme;
