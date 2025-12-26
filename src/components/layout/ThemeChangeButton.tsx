import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { IconButton, useColorMode } from "@chakra-ui/react";

const ThemeChangeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton variant="base" onClick={toggleColorMode} aria-label={""}>
      {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  );
};

export default ThemeChangeButton;
