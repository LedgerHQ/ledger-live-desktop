// @flow

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRegion } from "~/renderer/actions/settings";
import { langAndRegionSelector } from "~/renderer/reducers/settings";
import Select from "~/renderer/components/Select";
import Track from "~/renderer/analytics/Track";
import regionsByKey from "./regions.json";

const regions = Object.keys(regionsByKey).map(key => {
  const [language, region] = key.split("-");
  return { value: key, language, region, label: regionsByKey[key] };
});

const RegionSelect = () => {
  const dispatch = useDispatch();
  const { language, region } = useSelector(langAndRegionSelector);

  const handleChangeRegion = useCallback(
    ({ region }: { region: string }) => {
      dispatch(setRegion(region));
    },
    [dispatch],
  );

  const regionsFiltered = regions.filter(item => language === item.language);
  const currentRegion = regionsFiltered.find(item => item.region === region) || regionsFiltered[0];

  return (
    <>
      <Track onUpdate event="RegionSelectChange" currentRegion={currentRegion.region} />
      <Select
        small
        minWidth={260}
        onChange={handleChangeRegion}
        renderSelected={item => item && item.name}
        value={currentRegion}
        options={regionsFiltered}
      />
    </>
  );
};

export default RegionSelect;
