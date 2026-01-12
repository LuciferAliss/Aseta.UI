import { Input, useBreakpointValue } from "@chakra-ui/react";
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
  const isMobile = useBreakpointValue({ base: true, md: false });
  const currentLocale = i18n.language.split("-")[0];

  const dateFormat = showTimeSelect
    ? t("datePicker.dateFormat")
    : t("datePicker.dateFormatDateOnly");

  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      customInput={<Input autoComplete="off" />}
      showTimeSelect={showTimeSelect}
      timeIntervals={showTimeSelect ? 1 : undefined}
      portalId={isMobile ? undefined : "root"}
      popperPlacement="bottom-start"
      popperProps={{
        strategy: "fixed",
      }}
      withPortal={isMobile}
      locale={currentLocale}
      dateFormat={dateFormat}
      timeCaption={showTimeSelect ? t("datePicker.timeCaption") : undefined}
      timeFormat={
        currentLocale === "ru" && showTimeSelect ? "HH:mm" : "h:mm aa"
      }
    />
  );
};

export default DatePicker;
