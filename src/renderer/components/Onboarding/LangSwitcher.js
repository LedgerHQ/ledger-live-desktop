// @flow
import React, { useCallback, useEffect, useMemo } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { setLanguage } from "~/renderer/actions/settings";
import useTheme from "~/renderer/hooks/useTheme";
import { rgba } from "~/renderer/styles/helpers";
import { languageSelector } from "~/renderer/reducers/settings";
import { useDispatch, useSelector } from "react-redux";
import { languageLabels } from "~/renderer/screens/settings/sections/General/LanguageSelect";

import { prodStableLanguages } from "~/config/languages";

const options = prodStableLanguages.map(value => ({
  value,
  support: ["en", "fr"].includes(value) ? "full" : "partial",
  label: languageLabels[value],
  fontFamily: value === "ar" ? "Cairo" : "Inter",
}));

const styleFn = (theme, rtl) => ({
  container: (provided, state) => ({
    ...provided,
    width: 120,
  }),
  control: (provided, state) => {
    return {
      ...provided,
      backgroundColor: theme.colors.transparent,
      borderRadius: 20,
      borderColor: state.isFocused
        ? theme.colors.palette.primary.main
        : theme.colors.palette.text.shade10,
      boxShadow: "none",
      ":hover": {
        borderColor: theme.colors.palette.primary.main,
      },
    };
  },
  valueContainer: (provided, state) => ({
    ...provided,
    paddingLeft: rtl ? 0 : 14,
    paddingRight: rtl ? 14 : 0,
    justifyContent: "center",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    fontFamily: state.data?.fontFamily ?? "Inter",
    fontWeight: 700,
    fontSize: state.data?.fontFamily === "Cairo" ? 14 : 12,
    textTransform: "uppercase",
    color: theme.colors.palette.text.shade100,
  }),
  input: provided => ({ ...provided, color: theme.colors.transparent }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    paddingLeft: rtl ? 14 : 0,
    paddingRight: rtl ? 0 : 14,
    color: theme.colors.palette.text.shade100,
    ":hover": {
      color: theme.colors.palette.text.shade100,
    },
  }),
  menu: provided => ({
    ...provided,
    backgroundColor: theme.colors.palette.background.default,
    boxShadow: "0 4px 11px hsla(0,0%,0%,0.1);",
    borderRadius: 5,
  }),
  menuList: provided => ({
    ...provided,
    padding: 0,
  }),
  option: (provided, state) => {
    return {
      ...provided,
      position: "relative",
      fontFamily: state.data?.fontFamily ?? "Inter",
      fontWeight: 800,
      fontSize: state.data?.fontFamily === "Cairo" ? 14 : 10,
      textTransform: "uppercase",
      lineHeight: "16px",
      color:
        state.isSelected || state.isFocused
          ? theme.colors.wallet
          : theme.colors.palette.text.shade100,
      backgroundColor:
        state.isSelected || state.isFocused
          ? theme.colors.blueTransparentBackground
          : theme.colors.transparent,
      borderBottom: `1px solid ${rgba(theme.colors.dark, 0.05)}`,
      ":first-child": {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
      },
      ":last-child": {
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderBottom: 0,
      },
    };
  },
});

const LangSwitcher = () => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const language = useSelector(languageSelector);
  const styles = useMemo(() => styleFn(theme, i18n?.dir(language) === "rtl"), [
    theme,
    language,
    i18n,
  ]);
  const dispatch = useDispatch();

  useEffect(() => {
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

  console.log("options = ", options);

  return (
    <>
      <Select
        onChange={changeLanguage}
        value={currentLanguage}
        styles={styles}
        options={options}
        isRtl={i18n.dir() === "rtl"}
      />
    </>
  );
};

export default LangSwitcher;
