import { defineStyleConfig } from "@chakra-ui/react";

export const Button = defineStyleConfig({
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
        ringColor: "btn-focus-ring",
        ringOffset: "2px",
        ringOffsetColor: "app-bg",
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
        ringColor: "btn-focus-ring",
        ringOffset: "2px",
        ringOffsetColor: "app-bg",
      },
    },

    ghost: {
      bg: "transparent",
      textColor: "btn-ghost-text",
      color: "btn-primary-bg",
      _hover: {
        bg: "btn-ghost-hover-bg",
      },

      _active: {
        bg: "btn-ghost-active-bg",
        transform: "scale(0.90)",
      },

      _focusVisible: {
        ring: "2px",
        ringColor: "btn-focus-ring",
        ringOffset: "2px",
        ringOffsetColor: "app-bg",
      },
    },

    outline: {
      _focusVisible: {
        ring: "2px",
        ringColor: "btn-focus-ring",
        ringOffset: "2px",
        ringOffsetColor: "app-bg",
      },
    },

    unstyled: {
      _focusVisible: {
        ring: "2px",
        ringColor: "btn-focus-ring",
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
