// @flow
import React, { useCallback } from "react";
import { useHistory } from "react-router";

import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { MarketCounterValueSelect } from "~/renderer/screens/market/MarketCounterValueSelect";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { useSelector } from "react-redux";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import type { MarketCurrencyInfo } from "~/renderer/reducers/market";

type Props = {
  currency: MarketCurrencyInfo,
};

function CryptocurrencyHeaderActions({ currency }: Props) {
  const history = useHistory();

  const onBuy = useCallback(() => {
    setTrackingSource("cryptocurrency header actions");
    history.push({
      pathname: "/exchange",
      state: {
        defaultCurrency: currency.supportedCurrency,
      },
    });
  }, [currency, history]);

  const onSwap = useCallback(() => {
    setTrackingSource("cryptocurrency header actions");
    history.push({
      pathname: "/swap",
      state: {
        defaultCurrency: currency.supportedCurrency,
      },
    });
  }, [currency, history]);

  const device = useSelector(getCurrentDevice);

  return (
    <Box horizontal alignItems="center">
      <Box mr={12}>
        <MarketCounterValueSelect />
      </Box>
      {currency.supportedCurrency && device && (
        <>
          <Box mr={12}>
            <Button primary onClick={onBuy}>
              Buy
            </Button>
          </Box>
          <Box mr={12}>
            <Button primary onClick={onSwap}>
              Swap
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default CryptocurrencyHeaderActions;
