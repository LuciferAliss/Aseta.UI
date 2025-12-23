// src/theme/components/input.ts
export const Input = {
  variants: {
    base: {
      field: {
        border: "2px",
        bg: "input-bg",
        borderColor: "input-border-color",
        _hover: {
          borderColor: "input-hover-border-color",
          _notfocus: {
            borderColor: "input-hover-border-color",
          },
        },
        _focus: {
          borderColor: "focus-border-color",
        },
      },
    },
  },
};
