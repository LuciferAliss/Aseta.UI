import { Box, styled } from "@chakra-ui/react";

const CardBox = styled(Box, {
  baseStyle: {
    display: "flex",
    gap: "1rem",
    padding: ["1rem", "1.5rem", "2rem"],
    flexDirection: "column",
    bg: "card-bg",
    borderColor: "card-border",
    borderWidth: "4px",
    borderRadius: "lg",
    boxShadow: "card-glow",
    width: ["90%", "70%", "50%", "30%"],
  },
});

export default CardBox;
