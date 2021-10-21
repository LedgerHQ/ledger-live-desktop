import React, { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { setLanguage } from "~/renderer/actions/settings";
import { langAndRegionSelector } from "~/renderer/reducers/settings";
import { useDispatch, useSelector } from "react-redux";
import { languageLabels } from "~/renderer/screens/settings/sections/General/LanguageSelect";
import { Dropdown } from "@ledgerhq/react-ui";

import moment from "moment";

const options = [
  { value: "en", support: "full", label: languageLabels.en },
  { value: "fr", support: "full", label: languageLabels.fr },
  { value: "ru", support: "partial", label: languageLabels.ru },
  { value: "zh", support: "partial", label: languageLabels.zh },
  { value: "es", support: "partial", label: languageLabels.es },
];

const styles = {
  // TODO: implement this behavior in the @ledger/ui lib, here we are just overriding the style from the design system lib to have the MENU right aligned
  menu: () => ({}),
  // TODO: implement this behavior in the @ledger/ui lib, here we are just overriding the style from the design system lib to have the VALUE right aligned
  valueContainer: () => ({}),
  option: () => ({
    flex: 1,
    alignSelf: "center",
    textAlign: "center",
  }),
};

const LangSwitcher = () => {
  const { language } = useSelector(langAndRegionSelector);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  useEffect(() => {
    moment.locale(language);
    i18n.changeLanguage(language);
  }, [i18n, language]);

  const changeLanguage = useCallback(
    ({ value }) => {
      dispatch(setLanguage(value));
    },
    [dispatch],
  );

  const currentLanguage = useMemo(
    () => options.find(({ value }) => value === language) || options[0],
    [language],
  );

  return (
    <Dropdown
      label=""
      value={currentLanguage}
      options={options}
      onChange={changeLanguage}
      styles={styles}
    />
  );
};

export default LangSwitcher;
