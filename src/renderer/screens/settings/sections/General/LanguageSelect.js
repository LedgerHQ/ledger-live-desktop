// @flow

import React, { useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { allLanguages, prodStableLanguages } from "~/config/languages";
import useEnv from "~/renderer/hooks/useEnv";
import { setLanguage } from "~/renderer/actions/settings";
import { langAndRegionSelector } from "~/renderer/reducers/settings";
import Select from "~/renderer/components/Select";
import Track from "~/renderer/analytics/Track";

export const languageLabels = {
  de: "Deutsch",
  el: "Ελληνικά",
  en: "English",
  es: "Español",
  fi: "suomi",
  fr: "Français",
  hu: "magyar",
  it: "italiano",
  ja: "日本語",
  ko: "한국어",
  nl: "Nederlands",
  no: "Norsk",
  pl: "polski",
  pt: "português",
  ru: "Русский",
  sr: "српски",
  sv: "svenska",
  tr: "Türkçe",
  zh: "简体中文",
};

type LangKeys = $Keys<typeof languageLabels>;
type ChangeLangArgs = { value: LangKeys, label: string };

const LanguageSelect = () => {
  const { useSystem, language } = useSelector(langAndRegionSelector);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const debugLanguage = useEnv("EXPERIMENTAL_LANGUAGES");

  const languages = useMemo(
    () =>
      [{ value: null, label: t(`language.system`) }].concat(
        (debugLanguage ? allLanguages : prodStableLanguages).map(key => ({
          value: key,
          label: languageLabels[key],
        })),
      ),
    [t, debugLanguage],
  );

  const currentLanguage = useMemo(
    () => (useSystem ? languages[0] : languages.find(l => l.value === language)),
    [language, languages, useSystem],
  );

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  const handleChangeLanguage = useCallback(
    ({ value: languageKey }: ChangeLangArgs) => {
      dispatch(setLanguage(languageKey));
    },
    [dispatch],
  );

  return (
    <>
      <Track
        onUpdate
        event="LanguageSelect"
        currentRegion={currentLanguage && currentLanguage.value}
      />

      <Select
        small
        minWidth={260}
        isSearchable={false}
        onChange={handleChangeLanguage}
        renderSelected={item => item && item.name}
        value={currentLanguage}
        options={languages}
      />
    </>
  );
};

export default LanguageSelect;
