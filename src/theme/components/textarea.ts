import { defineStyleConfig } from "@chakra-ui/react";

const baseVariant = {
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

  _invalid: {
    borderColor: "input-border-error",
    boxShadow: "0 0 0 1px var(--chakra-colors-input-border-error)",
  },
};

export const Textarea = defineStyleConfig({
  variants: {
    base: baseVariant,
    outline: baseVariant,
  },
  defaultProps: {
    variant: "base",
  },
});
