import React, { useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import { allLanguages, prodStableLanguages, LangKeys, languageLabels } from "~/config/languages";

import useEnv from "~/renderer/hooks/useEnv";
import { setLanguage } from "~/renderer/actions/settings";
import { langAndRegionSelector } from "~/renderer/reducers/settings";
import Track from "~/renderer/analytics/Track";

import { SelectInput } from "@ledgerhq/react-ui";
import moment from "moment";

type ChangeLangArgs = { value: LangKeys | null; label: string };

const LanguageSelect = () => {
  const { useSystem, language } = useSelector(langAndRegionSelector);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const debugLanguage = useEnv("EXPERIMENTAL_LANGUAGES");

  const languages = useMemo(() => {
    const langs: ChangeLangArgs[] = (debugLanguage ? allLanguages : prodStableLanguages).map(
      (key: LangKeys) => ({
        value: key,
        label: languageLabels[key],
      }),
    );

    langs.unshift({ value: null, label: t(`language.system`) });

    return langs;
  }, [t, debugLanguage]);

  const currentLanguage = useMemo(
    () => (useSystem ? languages[0] : languages.find(l => l.value === language)),
    [language, languages, useSystem],
  );

  useEffect(() => {
    moment.locale(language);
    i18n.changeLanguage(language);
  }, [i18n, language]);

  const handleChangeLanguage = useCallback(
    (option: ChangeLangArgs | null) => {
      dispatch(setLanguage(option?.value ?? null));
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

      <SelectInput
        onChange={handleChangeLanguage}
        options={languages}
        value={currentLanguage}
        styles={{ input: provided => ({ ...provided, width: "210px" }) }}
      />
    </>
  );
};

export default LanguageSelect;
