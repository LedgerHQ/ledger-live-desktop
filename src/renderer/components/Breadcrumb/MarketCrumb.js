// @flow
import React, { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import { Separator, TextLink } from "./common";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { useTranslation } from "react-i18next";
// $FlowFixMe
import { useSingleCoinMarketData } from "~/renderer/screens/market/MarketDataProvider";

export default function MarketCrumb() {
  const { t } = useTranslation();
  const history = useHistory();
  const { currencyId } = useParams();
  const { selectedCoinData } = useSingleCoinMarketData(currencyId);

  const goBackToMarket = useCallback(
    item => {
      setTrackingSource("Market breadcrumb");
      history.push({ pathname: `/market` });
    },
    [history],
  );

  return selectedCoinData ? (
    <>
      <Separator />
      <Text>{selectedCoinData.name}</Text>
    </>
  ) : (
    <TextLink>
      <Button onClick={goBackToMarket}>{t("market.title")}</Button>
    </TextLink>
  );
}
