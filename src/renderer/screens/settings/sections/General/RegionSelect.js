// @flow

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { upperFirst } from "lodash";
import { setLocale, setRegion } from "~/renderer/actions/settings";
import { localeSelector } from "~/renderer/reducers/settings";
import Select from "~/renderer/components/Select";
import Track from "~/renderer/analytics/Track";
import regionsByKey from "./regions.json";

const regions = Object.keys(regionsByKey)
  .map(key => {
    const [language, region] = key.split("-");
    const locale = key;
    const languageDisplayName = new window.Intl.DisplayNames([locale], { type: "language" }).of(
      language,
    );
    const regionDisplayName = new window.Intl.DisplayNames([locale], { type: "region" }).of(region);
    const label = `${upperFirst(regionDisplayName)} (${upperFirst(languageDisplayName)})`;
    return { value: key, locale: key, language, region, label };
  })
  .sort((a, b) => a.label.localeCompare(b.label));

const RegionSelect = () => {
  const dispatch = useDispatch();
  const locale = useSelector(localeSelector);

  const handleChangeRegion = useCallback(
    ({ locale, region }: { locale: string, region: string }) => {
      moment.locale(locale);
      dispatch(setRegion(region));
      dispatch(setLocale(locale));
    },
    [dispatch],
  );

  const currentRegion = regions.find(item => item.locale === locale) || regions[0];

  return (
    <>
      <Track onUpdate event="RegionSelectChange" currentRegion={currentRegion.region} />
      <Select
        small
        minWidth={260}
        onChange={handleChangeRegion}
        renderSelected={item => item && item.name}
        value={currentRegion}
        options={regions}
      />
    </>
  );
};

export default RegionSelect;
