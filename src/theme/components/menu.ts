import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle({
  list: {
    bg: "card-bg",

    borderWidth: "1px",
    borderColor: "card-border",

    padding: 2,
    zIndex: "popover",
  },

  item: {
    bg: "transparent",
    color: "text-primary",
    borderRadius: "md",
    transition: "background 0.2s",

    _hover: {
      bg: "menu-item-hover-bg",
      color: "text-primary",
    },
    _focusVisible: {
      bg: "menu-item-hover-bg",
    },

    _checked: {
      color: "text-brand",
      fontWeight: "bold",
    },
  },

  groupTitle: {
    mx: 3,
    my: 2,
    color: "text-secondary",
    fontSize: "xs",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "wider",
  },

  divider: {
    borderColor: "menu-border-subtle",
    my: 2,
    opacity: 0.6,
  },
});

export const Menu = defineMultiStyleConfig({
  baseStyle,
});
