// @flow
import { useSelector } from "react-redux";
import { languageSelector } from "~/renderer/reducers/settings";

const useDateTimeFormat = (options: Intl$DateTimeFormatOptions) => {
  const currentLanguage = useSelector(languageSelector);
  const formatter = new Intl.DateTimeFormat(currentLanguage, options);

  return formatter.format;
};

export default useDateTimeFormat;
