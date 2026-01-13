import { Box, Button, forwardRef } from "@chakra-ui/react";
import { ru } from "date-fns/locale/ru";
import { enUS } from "date-fns/locale/en-US";
import { useTranslation } from "react-i18next";
import ReactDatePicker, { registerLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "../../theme/datepicker.css";

registerLocale("ru", ru);
registerLocale("en", enUS);

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  showTimeSelect?: boolean;
}

const DatePicker = ({
  selected,
  onChange,
  showTimeSelect = false,
}: DatePickerProps) => {
  const { t, i18n } = useTranslation("common");
  const currentLocale = i18n.language.split("-")[0];

  type InputProps = {
    value?: string;
    onClick?: () => void;
  };

  const ExampleCustomInput = forwardRef<InputProps, "button">(
    ({ value, onClick }, ref) => (
      <Button w="full" onClick={onClick} ref={ref} variant="outline">
        {value || t("datePicker.state_change_button_title")}
      </Button>
    )
  );

  const dateFormat = showTimeSelect
    ? t("datePicker.dateFormat")
    : t("datePicker.dateFormatDateOnly");

  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      customInput={<ExampleCustomInput />}
      showTimeSelect={showTimeSelect}
      timeIntervals={showTimeSelect ? 1 : undefined}
      popperPlacement="bottom-start"
      popperProps={{
        strategy: "fixed",
      }}
      locale={currentLocale}
      dateFormat={dateFormat}
      timeCaption={showTimeSelect ? t("datePicker.timeCaption") : undefined}
      timeFormat={
        currentLocale === "ru" && showTimeSelect ? "HH:mm" : "h:mm aa"
      }
    >
      <Box>
        <Button
          w="start"
          variant="unstyled"
          textColor="red.500"
          size="xs"
          onClick={() => {
            onChange(null);
          }}
        >
          {t("datePicker.clear_button_title")}
        </Button>
      </Box>
    </ReactDatePicker>
  );
};

export default DatePicker;
