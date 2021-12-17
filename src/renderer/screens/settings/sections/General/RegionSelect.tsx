import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRegion } from "~/renderer/actions/settings";
import { langAndRegionSelector } from "~/renderer/reducers/settings";
import { SelectInput } from "@ledgerhq/react-ui";
import Track from "~/renderer/analytics/Track";
import regionsByKey from "./regions";

type RegionKey = keyof typeof regionsByKey;
type RegionOption = {
  value: RegionKey;
  label: string;
  language: string;
  region: string;
};

const regionOptions: RegionOption[] = (Object.keys(regionsByKey) as RegionKey[])
  .map(key => {
    const [language, region] = key.split("-");
    return { value: key, language, region, label: regionsByKey[key] };
  })
  .sort((a, b) => a.label.localeCompare(b.label));

const RegionSelect = () => {
  const dispatch = useDispatch();
  const { language, region } = useSelector(langAndRegionSelector);

  const handleChangeRegion = useCallback(
    (option: RegionOption | null) => {
      dispatch(setRegion(option?.region ?? null));
    },
    [dispatch],
  );

  const regionsFiltered = regionOptions.filter(item => language === item.language);
  const currentRegion = regionsFiltered.find(item => item.region === region) || regionsFiltered[0];

  return (
    <>
      <Track onUpdate event="RegionSelectChange" currentRegion={currentRegion.region} />
      <SelectInput
        onChange={handleChangeRegion}
        options={regionsFiltered}
        value={currentRegion}
        styles={{ input: provided => ({ ...provided, width: "210px" }) }}
      />
    </>
  );
};

export default RegionSelect;
