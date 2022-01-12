// @flow

import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { upperFirst } from "lodash";
import { setLocale } from "~/renderer/actions/settings";
import { localeSelector } from "~/renderer/reducers/settings";
import Select from "~/renderer/components/Select";
import Track from "~/renderer/analytics/Track";
import regionsByKey from "./regions.json";

const getRegionOption = locale => {
  const [language, region = ""] = locale.split("-");
  const languageDisplayName = new window.Intl.DisplayNames([locale], { type: "language" }).of(
    language,
  );
  const regionDisplayName = new window.Intl.DisplayNames([locale], { type: "region" }).of(region);
  const labelPrefix = upperFirst(regionDisplayName);
  const labelSuffix = regionDisplayName ? ` (${upperFirst(languageDisplayName)})` : "";
  const label = `${labelPrefix}${labelSuffix}`;
  return { value: locale, locale, language, region, label };
};

const regionsOptions = Object.keys(regionsByKey)
  .map(getRegionOption)
  .sort((a, b) => a.label.localeCompare(b.label));

const RegionSelect = () => {
  const dispatch = useDispatch();
  const locale = useSelector(localeSelector);

  const handleChangeRegion = useCallback(
    ({ locale }: { locale: string }) => {
      moment.locale(locale);
      dispatch(setLocale(locale));
    },
    [dispatch],
  );

  const currentRegionOption = useMemo(
    () => regionsOptions.find(o => o.value === locale) || getRegionOption(locale),
    [locale],
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
