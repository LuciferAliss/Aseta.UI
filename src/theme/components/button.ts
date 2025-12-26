// src/theme/components/button.ts
import { defineStyleConfig } from "@chakra-ui/react";

export const Button = defineStyleConfig({
  // Базовые стили для всех кнопок
  baseStyle: {
    fontWeight: "bold",
    borderRadius: "lg",
    transitionProperty: "common",
    transitionDuration: "normal",
    _focusVisible: {
      boxShadow: "outline",
    },
  },

  variants: {
    base: {
      bg: "btn-primary-bg",
      color: "btn-primary-text",

      _hover: {
        bg: "btn-primary-hover-bg",
        _disabled: {
          bg: "btn-primary-bg",
          opacity: 0.6,
        },
      },

      _active: {
        bg: "btn-primary-active-bg",
        transform: "scale(0.98)",
      },

      _focusVisible: {
        ring: "2px",
        ringColor: "focus-ring",
        ringOffset: "2px",
        ringOffsetColor: "app-bg",
      },
    },

    outline: {
      bg: "transparent",
      border: "1px solid",
      borderColor: "border-default",
      color: "text-primary",

      _hover: {
        bg: "gray.100",
        borderColor: "gray.300",
        _dark: {
          bg: "whiteAlpha.100",
          borderColor: "whiteAlpha.300",
        },
      },
    },

    link: {
      bg: "transparent",
      color: "btn-link-text",
      border: "none",
      boxShadow: "none",

      padding: "0",
      height: "auto",
      lineHeight: "normal",
      verticalAlign: "baseline",

      _hover: {
        textDecoration: "underline",
        bg: "transparent",
        color: "btn-link-hover-text",
        _disabled: {
          textDecoration: "none",
        },
      },

      _active: {
        color: "btn-link-hover-text",
      },

      _focusVisible: {
        ring: "2px",
        ringColor: "focus-ring",
        ringOffset: "2px",
        ringOffsetColor: "app-bg",
      },
    },

    ghost: {
      bg: "transparent",
      color: "btn-primary-bg",
      _hover: {
        bg: "violet.50",
        _dark: {
          bg: "whiteAlpha.100",
        },
      },

      _active: {
        bg: "violet.100",
        _dark: {
          bg: "whiteAlpha.200",
        },
      },

      _focusVisible: {
        ring: "2px",
        ringColor: "focus-ring",
        ringOffset: "2px",
        ringOffsetColor: "app-bg",
      },
    },
  },

  defaultProps: {
    variant: "base",
    size: "md",
  },
});
