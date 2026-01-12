import { modalAnatomy as parts, tableAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

const baseStyle = definePartsStyle({
  table: {
    bg: "table-bg",
    borderWidth: "2px",
    borderColor: "table-border",
    boxShadow: "card-glow-lg",
    Tbody: {
      Tr: {
        _hover: {
          bg: "table-item-hover-bg",
        },
        _active: {
          bg: "table-item-active-bg",
        },
      },
    },
  },
});

export const Table = defineMultiStyleConfig({ baseStyle });
