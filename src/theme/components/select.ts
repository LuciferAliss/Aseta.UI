import { selectAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys);

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
    _focusVisible: {
      borderColor: "input-border-focus",
      boxShadow: "0 0 0 1px var(--chakra-colors-input-border-focus)",
      bg: "input-bg",
    },
  },
  icon: {
    color: "input-placeholder",
  },
});

export const Select = defineMultiStyleConfig({
  variants: {
    base: baseVariant,
    outline: baseVariant,
  },
  defaultProps: {
    variant: "base",
  },
});
