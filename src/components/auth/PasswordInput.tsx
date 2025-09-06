import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { IconButton, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import type { PasswordInputProps } from "../../types/auth/passwordInputProps";

const PasswordInput = ({ value, onChange }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

    return (
       <InputGroup>
        <Input type={showPassword ? 'text' : 'password'} value={value} onChange={onChange} />
        <InputRightElement h={'full'}>
          <IconButton variant={'ghost'} aria-label="" onClick={() => setShowPassword((show) => !show)} icon={showPassword ? <ViewOffIcon /> : <ViewIcon />} />
          </InputRightElement>
      </InputGroup>
    );
};

export default PasswordInput