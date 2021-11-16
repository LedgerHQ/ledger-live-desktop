// @flow

import React, { useCallback, useContext } from "react";
import { compose } from "redux";
import { useRouteMatch } from "react-router";
import { connect } from "react-redux";
import styled from "styled-components";
import { Trans, withTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";
import CryptoCurrencyHeader from "~/renderer/screens/market/cryptocurrency/CryptocurrencyHeader";
import CryptocurrencyHeaderActions from "~/renderer/screens/market/cryptocurrency/CryptocurrencyHeaderActions";
import CryptocurrencySummary from "~/renderer/screens/market/cryptocurrency/CryptocurrencySummary";
import CryptocurrencyStats from "~/renderer/screens/market/cryptocurrency/CryptocurrencyStats";
import { useMarketCurrency } from "~/renderer/hooks/market/useMarketCurrency";
import { rgba } from "~/renderer/styles/helpers";
import Text from "~/renderer/components/Text";
import useTheme from "~/renderer/hooks/useTheme";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import InfoCircle from "~/renderer/icons/InfoCircle";
import ExternalLink from "~/renderer/components/ExternalLink";
import { openURL } from "~/renderer/linking";
import { MarketContext } from "~/renderer/contexts/MarketContext";

const Divider: ThemedComponent<{}> = styled(Box)`
  border: 1px solid ${p => p.theme.colors.palette.divider};
`;

const CryptoCurrencyPage = () => {
  const {
    params: { id },
  } = useRouteMatch();

  const { contextState } = useContext(MarketContext);
  const { favorites, reload, counterCurrency, range, counterValue } = contextState;

  const { loading, currency } = useMarketCurrency({
    id: id || "",
    counterCurrency,
    range,
    reload,
  });

  currency.isStarred = Boolean(favorites.find(item => item.id === id));

  return (
    <Box>
      <Box horizontal py={20} flow={4} style={{ justifyContent: "space-between" }}>
        <CryptoCurrencyHeader loading={loading} currency={currency} />
        <CryptocurrencyHeaderActions loading={loading} currency={currency} />
      </Box>
      <Divider />
      {!loading && !currency.supportedCurrency && <NotLiveCompatible mt={3} />}
      <Box mt={3} mb={7}>
        <CryptocurrencySummary
          loading={loading}
          currency={currency}
          range={range}
          counterValue={counterValue}
        />
      </Box>
      <CryptocurrencyStats loading={loading} currency={currency} />
    </Box>
  );
};

const ConnectedCryptoCurrencyPage: React$ComponentType<{}> = compose(
  connect(),
  withTranslation(),
)(CryptoCurrencyPage);

const NotLiveCompatibleWrapper: ThemedComponent<{}> = styled(Box)`
  background: ${p => rgba(p.theme.colors.palette.primary.main, 0.1)};
  color: ${p => p.theme.colors.palette.primary.main};
  font-size: 13px;
  font-weight: 500;
  padding: 18px;
  border-radius: 4px;
`;

const NotLiveCompatible = props => {
  const color = useTheme("colors.palette.primary.main");
  const handleSupported = useCallback(
    () => openURL("https://www.ledger.com/supported-crypto-assets"),
    [],
  );
  return (
    <NotLiveCompatibleWrapper horizontal alignItems="center" {...props}>
      <InfoCircle color={color} size={16} />
      <Text ml={2} mr={1}>
        <Trans i18nKey="market.detailsPage.assetNotSupportedOnLedgerLive" />
      </Text>
      <ExternalLink
        onClick={handleSupported}
        isInternal={false}
        label={<Trans i18nKey="market.detailsPage.supportedCoinsAndTokens" />}
      />
    </NotLiveCompatibleWrapper>
  );
};

export default ConnectedCryptoCurrencyPage;
