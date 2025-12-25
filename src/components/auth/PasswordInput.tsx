import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";

const PasswordInput = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const { t } = useTranslation("auth");

  return (
    <InputGroup borderColor="app-border">
      <Input
        type={show ? "text" : "password"}
        placeholder={t("password_input_placeholder")}
        variant="base"
      />
      <InputRightElement>
        <IconButton
          icon={show ? <ViewIcon /> : <ViewOffIcon />}
          onClick={handleClick}
          bg="transparent"
          aria-label="Show password"
          _focusVisible={{
            boxShadow: "none",
            border: "2px solid var(--chakra-colors-focus-border-color)",
          }}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;
