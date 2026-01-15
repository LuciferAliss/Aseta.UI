import { checkboxAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const baseStyle = definePartsStyle({
  control: {
    _checked: {
      borderColor: "radio-hover-border",
      color: "radio-hover-color",
      bg: "radio-hover-bg",
      _hover: {
        borderColor: "radio-hover-border",
        color: "radio-hover-color",
        bg: "radio-hover-bg",
      },
    },
    _hover: {
      borderColor: "violet.300",
    },
    _focusVisible: {
      ring: "2px",
      ringColor: "radio-focus-ring",
      ringOffset: "2px",
      ringOffsetColor: "app-bg",
    },
  },
  label: {
    _hover: {
      color: "radio-label-hover-color",
    },
  },
});

export const Checkbox = defineMultiStyleConfig({ baseStyle });
