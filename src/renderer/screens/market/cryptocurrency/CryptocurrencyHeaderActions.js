// @flow

import React, { useCallback } from "react";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { MarketCounterValueSelect } from "~/renderer/screens/market/MarketCounterValueSelect";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { useHistory } from "react-router";
import type { MarketCurrency } from "~/renderer/reducers/market";

type Props = {
  currency: MarketCurrency,
};

function CryptocurrencyHeaderActions({ currency }: Props) {
  const history = useHistory();

  const onBuy = useCallback(() => {
    setTrackingSource("cryptocurrency header actions");
    history.push({
      pathname: "/exchange",
      state: {
        defaultCurrency: currency,
      },
    });
  }, [currency, history]);

  const onSwap = useCallback(() => {
    setTrackingSource("cryptocurrency header actions");
    history.push({
      pathname: "/swap",
      state: {
        defaultCurrency: currency,
      },
    });
  }, [currency, history]);

  return (
    <Box horizontal alignItems="center">
      <Box mr={12}>
        <MarketCounterValueSelect />
      </Box>
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
    </Box>
  );
}

export default CryptocurrencyHeaderActions;
