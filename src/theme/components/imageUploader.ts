import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { anatomy } from "@chakra-ui/anatomy";

const parts = anatomy("imageUploader").parts(
  "container",
  "dropzone",
  "preview",
  "label",
  "icon",
  "textHint",
  "uploadLabel"
);

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  container: {
    width: "100%",
  },
  label: {
    fontSize: "sm",
    fontWeight: "md",
    color: "text-secondary",
  },
  dropzone: {
    _focus: { outline: "none" },
    _focusVisible: {
      ring: "2px",
      ringColor: "btn-focus-ring",
      ringOffset: "2px",
      ringOffsetColor: "app-bg",
    },
    mt: 1,
    justify: "center",
    align: "center",
    px: 6,
    pt: 5,
    pb: 6,
    borderWidth: "2px",
    borderColor: "input-border",
    borderStyle: "dashed",
    rounded: "md",
    transition: "background-color 0.2s ease",
    bg: "transparent",
    _hover: {
      bg: "input-bg",
      borderColor: "input-border-hover",
    },
    "&[data-active=true]": {
      bg: "input-bg",
      borderColor: "input-border-focus",
    },
  },
  icon: {
    mx: "auto",
    boxSize: { base: 10, md: 12 },
    color: "input-placeholder",
    stroke: "currentColor",
    fill: "none",
  },
  uploadLabel: {
    cursor: "pointer",
    rounded: "md",
    fontSize: "md",
    color: "text-brand",
    pos: "relative",
    _hover: {
      color: "text-brand-hover",
    },
  },
  textHint: {
    fontSize: "xs",
    color: "text-secondary",
  },
  preview: {
    mt: 4,
    justify: "center",
    align: "center",
    borderWidth: "1px",
    borderColor: "input-border",
    rounded: "md",
    overflow: "hidden",
    bg: "input-bg",
    maxH: { base: "250px", md: "300px" },
    w: "100%",
    "& > img": {
      objectFit: "contain",
      w: "100%", // Changed from 'auto'
      h: "100%", // Changed from 'auto'
      maxH: { base: "250px", md: "400px" },
      maxW: "100%",
    },
  },
});

export const ImageUploader = defineMultiStyleConfig({
  baseStyle,
});
