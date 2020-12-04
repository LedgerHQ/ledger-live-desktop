// @flow
import React, { useMemo } from "react";
import Select from "react-select";
import { Trans } from "react-i18next";
import useTheme from "~/renderer/hooks/useTheme";
import { rgba } from "~/renderer/styles/helpers";

const options = [
  { value: "en", label: <Trans i18nKey="language.switcher.en" /> },
  { value: "fr", label: <Trans i18nKey="language.switcher.fr" /> },
  { value: "ru", label: <Trans i18nKey="language.switcher.ru" /> },
  { value: "zh", label: <Trans i18nKey="language.switcher.zh" /> },
  { value: "es", label: <Trans i18nKey="language.switcher.es" /> },
];

const styleFn = theme => ({
  container: (provided, state) => ({
    ...provided,
    width: 120,
  }),
  control: (provided, state) => {
    return {
      ...provided,
      backgroundColor: theme.colors.transparent,
      borderRadius: 20,
      borderColor: state.isFocused ? theme.colors.wallet : rgba(theme.colors.dark, 0.1),
      boxShadow: "none",
      ":hover": {
        borderColor: theme.colors.wallet,
      },
    };
  },
  valueContainer: (provided, state) => ({
    ...provided,
    paddingLeft: 14,
    paddingRight: 0,
    justifyContent: "center",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 12,
    textTransform: "uppercase",
    color: theme.colors.palette.text.shade100,
  }),
  input: provided => ({ ...provided, color: theme.colors.transparent }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    paddingLeft: 0,
    paddingRight: 14,
    color: theme.colors.palette.text.shade100,
    ":hover": {
      color: theme.colors.palette.text.shade100,
    },
  }),
  menu: provided => ({
    ...provided,
    backgroundColor: theme.colors.transparent,
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
      fontFamily: "Inter",
      fontWeight: 800,
      fontSize: 10,
      textTransform: "uppercase",
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

type Props = {
  onChange?: (args: { value: string }) => void,
};

const LangSwitcher = ({ onChange }: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => styleFn(theme), [theme]);

  return <Select onChange={onChange} styles={styles} options={options} defaultValue={options[0]} />;
};

export default LangSwitcher;
