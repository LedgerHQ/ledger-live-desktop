// @flow

import React from "react";
import { compose } from "redux";
import { useRouteMatch } from "react-router";
import { connect, useSelector } from "react-redux";
import styled from "styled-components";
import { withTranslation } from "react-i18next";

import Box from "~/renderer/components/Box";
import CryptoCurrencyHeader from "~/renderer/screens/market/cryptocurrency/CryptocurrencyHeader";
import CryptocurrencyHeaderActions from "~/renderer/screens/market/cryptocurrency/CryptocurrencyHeaderActions";
import CryptocurrencySummary from "~/renderer/screens/market/cryptocurrency/CryptocurrencySummary";
import CryptocurrencyStats from "~/renderer/screens/market/cryptocurrency/CryptocurrencyStats";
import { useMarketCurrency } from "~/renderer/hooks/market/useMarketCurrency";
import { rgba } from "~/renderer/styles/helpers";
import Text from "~/renderer/components/Text";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import Shield from "~/renderer/icons/Shield";
import useTheme from "~/renderer/hooks/useTheme";

const Divider = styled(Box)`
  border: 1px solid ${p => p.theme.colors.palette.divider};
`;

const CryptoCurrencyPage = () => {
  const {
    params: { id },
  } = useRouteMatch();

  const { favorites } = useSelector(state => state.market);

  const { counterCurrency, range, counterValue } = useSelector(state => state.market);

  const { loading, currency } = useMarketCurrency({ id, counterCurrency, range });

  currency.isStarred = !!favorites.find(item => item.id === id);
  const device = useSelector(getCurrentDevice);

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
      {!device && <NotLiveCompatible mt={3} />}
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

const NotLiveCompatibleWrapper = styled(Box)`
  background: ${p => rgba(p.theme.colors.palette.primary.main, 0.1)};
  color: ${p => p.theme.colors.palette.primary.main};
  font-size: 13px;
  font-weight: 500;
  padding: 18px;
  border-radius: 4px;
`;

const NotLiveCompatible = props => {
  const color = useTheme("colors.palette.primary.main");
  return (
    <NotLiveCompatibleWrapper horizontal alignItems="center" {...props}>
      <Shield color={color} size={16} />
      <Text ml={2}>This asset is not supported on Ledger Live.</Text>
    </NotLiveCompatibleWrapper>
  );
};

export default ConnectedCryptoCurrencyPage;
