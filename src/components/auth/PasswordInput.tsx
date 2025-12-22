import { Icon, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const PasswordInput = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup borderColor="app-border">
      <Input
        type={show ? "text" : "password"}
        placeholder="Enter password"
        variant="auth"
      />
      <InputRightElement>
        <Icon
          as={show ? ViewIcon : ViewOffIcon}
          onClick={handleClick}
          cursor="pointer"
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;
