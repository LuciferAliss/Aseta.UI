import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { colors } from "./colors";
import { semanticTokens } from "./semantic-tokens";
import { Shadows } from "./shadows";
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
        color: "app-text",
      },
    }),
  },
  shadows: {
    ...Shadows,
  },
  components,
});

export default theme;
