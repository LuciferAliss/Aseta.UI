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
  const styles = useMultiStyleConfig("Input", {}); // Reuse Input styles for the button
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Menu>
      <MenuButton
        as={Button}
        sx={styles.field}
        w="100%"
        textAlign="left"
        rightIcon={<ChevronDownIcon />}
        isDisabled={disabled}
      >
        {selectedOption?.label || placeholder}
      </MenuButton>
      <MenuList>
        {options.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            // isChecked can be used for visual indication
            // The hover/focus color is handled by the Menu theme
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
