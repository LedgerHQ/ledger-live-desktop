// @flow
import { useSelector } from "react-redux";
import { localeSelector } from "~/renderer/reducers/settings";

const useDateTimeFormat = (options: Intl$DateTimeFormatOptions) => {
  const currentLanguage = useSelector(localeSelector);
  const formatter = new Intl.DateTimeFormat(currentLanguage, options);

  return formatter.format;
};

export default useDateTimeFormat;
