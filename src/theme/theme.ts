import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {},
  semanticTokens: {
    colors: {
      "app-bg": {
        _light: "gray.50",
        _dark: "gray.900",
      },
    },
  },
  styles: {
    global: () => ({
      body: {
        bg: "app-bg",
      },
    }),
  },
  components: {},
});

export default theme;
