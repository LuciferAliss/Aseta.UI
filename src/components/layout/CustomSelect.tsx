import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useMultiStyleConfig,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: CustomSelectProps) => {
  const styles = useMultiStyleConfig("Input", {});
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Menu>
      <MenuButton
        as={Button}
        sx={styles.field}
        w="100%"
        fontWeight="normal"
        textAlign="left"
        rightIcon={<ChevronDownIcon />}
        isDisabled={disabled}
      >
        {selectedOption?.label || placeholder}
      </MenuButton>
      <MenuList>
        {options.map((option) => (
          <MenuItem key={option.value} onClick={() => onChange(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
