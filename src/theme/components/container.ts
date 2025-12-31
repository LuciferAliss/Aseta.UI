import { defineStyleConfig } from "@chakra-ui/react";

export const Container = defineStyleConfig({
  variants: {
    card: {
      p: 8,
      bg: "card-bg",
      borderWidth: "4px",
      borderColor: "card-border",
      borderRadius: "xl",
      boxShadow: "card-glow-lg",
    },
  },
});
