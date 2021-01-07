// @flow
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Select from "react-select";
import { Trans, useTranslation } from "react-i18next";
import { setLanguage } from "~/renderer/actions/settings";
import useTheme from "~/renderer/hooks/useTheme";
import { rgba } from "~/renderer/styles/helpers";
import { langAndRegionSelector } from "~/renderer/reducers/settings";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "~/renderer/modals/ConfirmModal";
import WarningIcon from "~/renderer/icons/TriangleWarning";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import moment from "moment";
import Box from "../Box/Box";

const IconWrapperCircle: ThemedComponent<{ color?: string }> = styled(Box)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: ${p => p.theme.colors.wallet};
  background: ${p => p.theme.colors.blueTransparentBackground};
  align-items: center;
  justify-content: center;
`;

const options = [
  { value: "en", support: "full", label: <Trans i18nKey="language.switcher.en" /> },
  { value: "fr", support: "full", label: <Trans i18nKey="language.switcher.fr" /> },
  { value: "ru", support: "partial", label: <Trans i18nKey="language.switcher.ru" /> },
  { value: "zh", support: "partial", label: <Trans i18nKey="language.switcher.zh" /> },
  { value: "es", support: "partial", label: <Trans i18nKey="language.switcher.es" /> },
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

const LangSwitcher = () => {
  const theme = useTheme();
  const styles = useMemo(() => styleFn(theme), [theme]);
  const { language } = useSelector(langAndRegionSelector);
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();
  const [infoModalOpen, setInfoModalOpen] = useState("");

  useEffect(() => {
    moment.locale(language);
    i18n.changeLanguage(language);
  }, [i18n, language]);

  const changeLanguage = useCallback(
    ({ value, support }) => {
      dispatch(setLanguage(value));
      if (support !== "full") {
        setInfoModalOpen(value);
      }
    },
    [dispatch],
  );

  const onCloseInfoModal = useCallback(() => {
    setInfoModalOpen("");
  }, []);

  const currentLanguage = useMemo(
    () => options.find(({ value }) => value === language) || options[0],
    [language],
  );

  return (
    <>
      <Select onChange={changeLanguage} value={currentLanguage} styles={styles} options={options} />
      <ConfirmModal
        analyticsName="OnboardingLanguageInfo"
        centered
        isOpened={!!infoModalOpen}
        onClose={onCloseInfoModal}
        onConfirm={onCloseInfoModal}
        confirmText={<Trans i18nKey="onboarding.screens.welcome.languageWarning.cta" />}
        title={
          <Trans
            i18nKey="onboarding.screens.welcome.languageWarning.title"
            values={{ language: t(`language.switcher.${currentLanguage.value}`) }}
          />
        }
        desc={<Trans i18nKey="onboarding.screens.welcome.languageWarning.desc" />}
        renderIcon={() => (
          <IconWrapperCircle>
            <WarningIcon size={24} />
          </IconWrapperCircle>
        )}
      />
    </>
  );
};

export default LangSwitcher;
