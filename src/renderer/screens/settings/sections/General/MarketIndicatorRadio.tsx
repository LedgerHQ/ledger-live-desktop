import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { setMarketIndicator } from "~/renderer/actions/settings";
import { marketIndicatorSelector } from "~/renderer/reducers/settings";
import Track from "~/renderer/analytics/Track";
import { Radio } from "@ledgerhq/react-ui";

const MarketIndicatorRadio = () => {
  const dispatch = useDispatch();
  const marketIndicator = useSelector(marketIndicatorSelector);
  const { t } = useTranslation();

  return (
    <>
      <Track onUpdate event="MarketIndicatorRadio" marketIndicator={marketIndicator} />
      <Radio
        currentValue={marketIndicator}
        name="marketRadioIndicator"
        onChange={value => dispatch(setMarketIndicator(value))}
      >
        <Radio.ListElement label={t("common.eastern")} value="eastern" />
        <Radio.ListElement label={t("common.western")} value="western" />
      </Radio>
    </>
  );
};

export default MarketIndicatorRadio;
