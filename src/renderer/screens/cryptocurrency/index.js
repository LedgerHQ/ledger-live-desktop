// @flow

import React from "react";
import { compose } from "redux";
import { connect, useSelector } from "react-redux";
import type { TFunction } from "react-i18next";
import { withTranslation } from "react-i18next";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { getCurrencyColor } from "~/renderer/getCurrencyColor";
import Box from "~/renderer/components/Box";
import useTheme from "~/renderer/hooks/useTheme";
import CryptoCurrencyHeader from "~/renderer/screens/cryptocurrency/CryptocurrencyHeader";
import CryptocurrencyHeaderActions from "~/renderer/screens/cryptocurrency/CryptocurrencyHeaderActions";
import styled from "styled-components";
import CryptocurrencySummary from "~/renderer/screens/cryptocurrency/CryptocurrencySummary";
import { useMarketCurrencies } from "~/renderer/hooks/useMarketCurrencies";
import { useRange } from "~/renderer/hooks/useRange";
import type { MarketCurrency } from "~/renderer/reducers/market";
import { useRouteMatch } from "react-router";

type Props = {
  t: TFunction,
  account?: AccountLike,
  parentAccount?: Account,
  countervalueFirst: boolean,
  setCountervalueFirst: boolean => void,
};

const Divider = styled(Box)`
  border: 1px solid ${p => p.theme.colors.palette.divider};
`;

const CryptoCurrencyPage = (props: Props) => {
  const bgColor = useTheme("colors.palette.background.paper");
  const {
    params: { id: currencyId },
  } = useRouteMatch();

  const { range, counterValue } = useSelector(
    state => state.market
  );

  const { rangeData } = useRange(range);

  const currencies: Array<MarketCurrency> = useMarketCurrencies({
    counterValueCurrency: counterValue.currency,
    ...rangeData,
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
      {/*{AccountBodyHeader ? (*/}
      {/*  <AccountBodyHeader account={account} parentAccount={parentAccount} />*/}
      {/*) : null}*/}
      {/*{isCompoundEnabled && account.type === "TokenAccount" && parentAccount ? (*/}
      {/*  <CompoundBodyHeader account={account} parentAccount={parentAccount} />*/}
      {/*) : null}*/}
      {/*{account.type === "Account" ? <TokensList account={account} /> : null}*/}
      {/*<OperationsList*/}
      {/*  account={account}*/}
      {/*  parentAccount={parentAccount}*/}
      {/*  title={t("account.lastOperations")}*/}
      {/*/>*/}
    </Box>
  );
};

const ConnectedCryptoCurrencyPage: React$ComponentType<{}> = compose(
  connect(),
  withTranslation()
)(CryptoCurrencyPage);

export default ConnectedCryptoCurrencyPage;
