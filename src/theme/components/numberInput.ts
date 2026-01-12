import { numberInputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(numberInputAnatomy.keys);

const baseVariant = definePartsStyle({
  field: {
    border: "2px solid",
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

    _autofill: {
      transition: "background-color 0s 600000s, color 0s 600000s",
    },

    _groupInvalid: {
      borderColor: "input-border-error",
      boxShadow: "0 0 0 1px var(--chakra-colors-input-border-error)",
    },
  },
});

export const NumberInput = defineMultiStyleConfig({
  variants: {
    base: baseVariant,
    outline: baseVariant,
  },
  defaultProps: {
    variant: "base",
  },
});
