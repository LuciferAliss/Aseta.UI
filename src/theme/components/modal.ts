// src/theme/components/modal.ts
import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  overlay: {
    bg: "blackAlpha.600",
    backdropFilter: "blur(4px)",
  },

  dialog: {
    bg: "card-bg",
    borderWidth: "4px",
    borderColor: "card-border",
    borderRadius: "xl",
    boxShadow: "card-glow-lg",
  },

  header: {
    pb: 2,
    fontSize: "xl",
    fontWeight: "bold",
    color: "text-primary",
  },
  body: {
    py: 4,
    color: "text-secondary",
  },
  footer: {
    pt: 4,
  },
});

export const Modal = defineMultiStyleConfig({
  baseStyle,
});
