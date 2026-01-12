import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  type InputProps,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";

const PasswordInput = (props: InputProps) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const { t } = useTranslation("auth");

  return (
    <InputGroup borderColor="app-border">
      <Input type={show ? "text" : "password"} maxLength={128} {...props} />
      <InputRightElement>
        <IconButton
          icon={show ? <ViewIcon /> : <ViewOffIcon />}
          onClick={handleClick}
          aria-label="Show password"
          variant="ghost"
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;
