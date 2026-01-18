import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

const enclosedVariant = definePartsStyle({
  tab: {
    borderRadius: "lg",
    fontWeight: "bold",
    color: "text-secondary",
    bg: "transparent",
    _selected: {
      color: "white",
      bg: "btn-primary-bg",
    },
    margin: "4px",
    _focusVisible: {
      ring: "2px",
      ringColor: "btn-focus-ring",
      ringOffset: "2px",
      ringOffsetColor: "app-bg",
    },
  },
  tablist: {},
});

const variants = {
  enclosed: enclosedVariant,
};

export const Tabs = defineMultiStyleConfig({
  variants,
});
