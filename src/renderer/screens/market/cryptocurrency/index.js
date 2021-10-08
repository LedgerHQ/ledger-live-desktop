// @flow

import React from "react";
import { compose } from "redux";
import { connect, useSelector } from "react-redux";
import { withTranslation } from "react-i18next";
import { getCurrencyColor } from "~/renderer/getCurrencyColor";
import Box from "~/renderer/components/Box";
import useTheme from "~/renderer/hooks/useTheme";
import CryptoCurrencyHeader from "~/renderer/screens/market/cryptocurrency/CryptocurrencyHeader";
import CryptocurrencyHeaderActions from "~/renderer/screens/market/cryptocurrency/CryptocurrencyHeaderActions";
import styled from "styled-components";
import CryptocurrencySummary from "~/renderer/screens/market/cryptocurrency/CryptocurrencySummary";
import { useMarketCurrencies } from "~/renderer/hooks/market/useMarketCurrencies";
import { useRange } from "~/renderer/hooks/market/useRange";
import type { MarketCurrency } from "~/renderer/reducers/market";
import { useRouteMatch } from "react-router";
import CryptocurrencyStats from "~/renderer/screens/market/cryptocurrency/CryptocurrencyStats";

const Divider = styled(Box)`
  border: 1px solid ${p => p.theme.colors.palette.divider};
`;

const CryptoCurrencyPage = () => {
  const bgColor = useTheme("colors.palette.background.paper");
  const {
    params: { id: currencyId },
  } = useRouteMatch();

  const { range, counterValue } = useSelector(state => state.market);

  const { rangeData } = useRange(range);
  const favorites = useSelector(state => state.market.favorites);
  const currencies: Array<MarketCurrency> = useMarketCurrencies({
    counterValueCurrency: counterValue.currency,
    ...rangeData,
    favorites,
  });

  const currency = currencies.find(item => item.id === currencyId);
  const color = getCurrencyColor(currency, bgColor);

  return (
    <Box>
      <Box horizontal py={20} flow={4} style={{ justifyContent: "space-between" }}>
        <CryptoCurrencyHeader currency={currency} />
        <CryptocurrencyHeaderActions currency={currency} />
      </Box>
      <Divider />
      <Box mt={3} mb={7}>
        <CryptocurrencySummary
          currency={currency}
          chartColor={color}
          range={range}
          counterValue={counterValue}
        />
      </Box>
      <CryptocurrencyStats currency={currency} />
    </Box>
  );
};

const ConnectedCryptoCurrencyPage: React$ComponentType<{}> = compose(
  connect(),
  withTranslation(),
)(CryptoCurrencyPage);

export default ConnectedCryptoCurrencyPage;
