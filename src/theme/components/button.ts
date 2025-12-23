// src/theme/components/button.ts
export const Button = {
  variants: {
    base: {
      bg: "button-bg",
      textColor: "button-text",
      _hover: {
        bg: "button-hover-bg",
        _disabled: {
          bg: "button-hover-bg",
        },
        _notfocus: {
          borderColor: "input-hover-border-color",
        },
      },
      _active: {
        bg: "button-active-bg",
      },
      _focus: {
        boxShadow: "none",
      },
      _focusVisible: {
        border: "2px solid var(--chakra-colors-focus-border-color)",
      },
    },
  },
};
