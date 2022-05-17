// @flow

import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { upperFirst } from "lodash";
import { setLocale } from "~/renderer/actions/settings";
import { languageSelector, localeSelector } from "~/renderer/reducers/settings";
import Select from "~/renderer/components/Select";
import Track from "~/renderer/analytics/Track";
import regionsByKey from "./regions.json";

const getRegionOption = (regionLocale, languageLocale) => {
  const [language, region = ""] = regionLocale.split("-");
  const languageDisplayName = new window.Intl.DisplayNames([languageLocale], {
    type: "language",
  }).of(language);
  const regionDisplayName = new window.Intl.DisplayNames([languageLocale], { type: "region" }).of(
    region,
  );
  const labelPrefix = upperFirst(regionDisplayName);
  const labelSuffix = regionDisplayName ? ` (${upperFirst(languageDisplayName)})` : "";
  const label = `${labelPrefix}${labelSuffix}`;
  return { value: regionLocale, locale: regionLocale, language, region, label };
};

const getRegionsOptions = languageLocale =>
  Object.keys(regionsByKey)
    .map(regionLocale => getRegionOption(regionLocale, languageLocale))
    .sort((a, b) => a.label.localeCompare(b.label));

const RegionSelect = () => {
  const dispatch = useDispatch();
  const language = useSelector(languageSelector);
  const locale = useSelector(localeSelector);

  const regionsOptions = useMemo(() => {
    return getRegionsOptions(language);
  }, [language]);

  const handleChangeRegion = useCallback(
    ({ locale }: { locale: string }) => {
      moment.locale(locale);
      dispatch(setLocale(locale));
    },
    [dispatch],
  );

  const currentRegionOption = useMemo(
    () => regionsOptions.find(o => o.value === locale) || getRegionOption(locale, language),
    [locale, language, regionsOptions],
  );

  return (
    <>
      <Track onUpdate event="RegionSelectChange" currentRegion={currentRegionOption.region} />
      <Select
        small
        minWidth={260}
        onChange={handleChangeRegion}
        renderSelected={item => item && item.name}
        value={currentRegionOption}
        options={regionsOptions}
      />
    </>
  );
};

export default RegionSelect;
