// @flow

import React from "react";
import { compose } from "redux";
import { connect, useSelector } from "react-redux";
import { withTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";
import CryptoCurrencyHeader from "~/renderer/screens/market/cryptocurrency/CryptocurrencyHeader";
import CryptocurrencyHeaderActions from "~/renderer/screens/market/cryptocurrency/CryptocurrencyHeaderActions";
import styled from "styled-components";
import CryptocurrencySummary from "~/renderer/screens/market/cryptocurrency/CryptocurrencySummary";
import { useRouteMatch } from "react-router";
import CryptocurrencyStats from "~/renderer/screens/market/cryptocurrency/CryptocurrencyStats";
import { useMarketCurrency } from "~/renderer/hooks/market/useMarketCurrency";

const Divider = styled(Box)`
  border: 1px solid ${p => p.theme.colors.palette.divider};
`;

const CryptoCurrencyPage = () => {
  const {
    params: { id },
  } = useRouteMatch();

  const { counterCurrency, range, counterValue } = useSelector(state => state.market);

  const { loading, currency } = useMarketCurrency({ id, counterCurrency, range });

  if (loading) {
    return null;
  }

  return (
    <Box>
      <Box horizontal py={20} flow={4} style={{ justifyContent: "space-between" }}>
        <CryptoCurrencyHeader currency={currency} />
        <CryptocurrencyHeaderActions currency={currency} />
      </Box>
      <Divider />
      <Box mt={3} mb={7}>
        {!loading && (
          <CryptocurrencySummary currency={currency} range={range} counterValue={counterValue} />
        )}
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
