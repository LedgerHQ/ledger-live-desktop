// @flow
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { setMarketIndicator } from "~/renderer/actions/settings";
import { marketIndicatorSelector } from "~/renderer/reducers/settings";
import Track from "~/renderer/analytics/Track";
import RadioGroup from "~/renderer/components/RadioGroup";

const MarketIndicatorRadio = () => {
  const dispatch = useDispatch();
  const marketIndicator = useSelector(marketIndicatorSelector);
  const { t } = useTranslation();

  const indicators = [
    {
      label: t("common.eastern"),
      key: "eastern",
    },
    {
      label: t("common.western"),
      key: "western",
    },
  ];

  const onChange = useCallback(
    (item: { key: string }) => {
      dispatch(setMarketIndicator(item.key));
    },
    [dispatch],
  );

  return (
    <>
      <Track onUpdate event="MarketIndicatorRadio" marketIndicator={marketIndicator} />
      <RadioGroup items={indicators} activeKey={marketIndicator} onChange={onChange} />
    </>
  );
};

export default MarketIndicatorRadio;
