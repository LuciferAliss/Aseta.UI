// src/theme/components/input.ts
import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const baseVariant = definePartsStyle({
  field: {
    border: "1px solid",
    bg: "input-bg",
    borderColor: "input-border",
    color: "text-primary",
    borderRadius: "md",

    _placeholder: {
      color: "input-placeholder",
    },

    _hover: {
      borderColor: "input-border-hover",
    },

    _focus: {
      borderColor: "input-border-focus",
      boxShadow: "0 0 0 1px var(--chakra-colors-input-border-focus)",
      bg: "input-bg",
    },

    _invalid: {
      borderColor: "status-error-text",
      boxShadow: "none",
    },
  },
});

export const Input = defineMultiStyleConfig({
  variants: {
    base: baseVariant,
    outline: baseVariant,
  },
  defaultProps: {
    variant: "base",
  },
});
