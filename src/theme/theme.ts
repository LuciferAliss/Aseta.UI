import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { colors } from "./colors";
import { semanticTokens } from "./semantic-tokens";
import { Shadows } from "./shadows";

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
  components: {
    Input: {
      variants: {
        auth: {
          field: {
            border: "2px",
            bg: "input-bg",
            borderColor: "static-border-color",
            _hover: {
              borderColor: "hover-border-color",
              _notfocus: {
                borderColor: "hover-border-color",
              },
            },
            _focus: {
              borderColor: "focus-border-color",
              boxShadow: "input-focus",
            },
          },
        },
      },
    },
  },
});

export default theme;
