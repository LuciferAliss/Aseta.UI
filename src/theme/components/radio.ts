import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers([
  "container",
  "control",
  "label",
]);

const radioTheme = defineMultiStyleConfig({
  baseStyle: {
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
  },
});

export default radioTheme;
