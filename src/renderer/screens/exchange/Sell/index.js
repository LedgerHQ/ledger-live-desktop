// @flow

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { getAccountCurrency, isAccountEmpty } from "@ledgerhq/live-common/lib/account/helpers";
import SelectAccountAndCurrency from "~/renderer/components/SelectAccountAndCurrency";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import TrackPage from "~/renderer/analytics/TrackPage";
import { track } from "~/renderer/analytics/segment";
import type { DProps } from "~/renderer/screens/exchange";
import { ProviderList } from "../ProviderList";
import { useRampCatalogCurrencies } from "../hooks";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";
import { currenciesByMarketcap } from "@ledgerhq/live-common/lib/currencies";
import BigSpinner from "~/renderer/components/BigSpinner";

const BuyContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
`;

const OffRamp = ({ defaultCurrencyId, defaultAccountId, defaultTicker, rampCatalog }: DProps) => {
  const [sortedCurrencies, setSortedCurrencies] = useState([]);

  const allCurrencies = useRampCatalogCurrencies(rampCatalog.value.offRamp);

  useEffect(() => {
    const filteredCurrencies = defaultTicker
      ? allCurrencies.filter(currency => currency.ticker === defaultTicker)
      : allCurrencies;

    currenciesByMarketcap(filteredCurrencies).then(sortedCurrencies => {
      setSortedCurrencies(sortedCurrencies);
    });
  }, []);

  console.log({ sortedCurrencies });

  const fiatCurrency = useSelector(counterValueCurrencySelector);

  const [state, setState] = useState({
    account: undefined,
    parentAccount: undefined,
  });

  const dispatch = useDispatch();

  const { account, parentAccount } = state;

  const reset = useCallback(() => {
    track("Page Sell Reset");
    setState({
      account: undefined,
      parentAccount: undefined,
    });
  }, []);

  const selectAccount = useCallback(
    (account, parentAccount) => {
      setState(oldState => ({
        ...oldState,
        account: account,
        parentAccount: parentAccount,
      }));
    },
    [dispatch],
  );

  const confirmButtonTracking = useCallback(account => {
    track("Sell Crypto Continue Button", {
      currencyName: getAccountCurrency(account).name,
      isEmpty: isAccountEmpty(account),
    });
  }, []);

  return (
    <BuyContainer>
      <TrackPage category="Multibuy" name="SellPage" />
      {sortedCurrencies.length === 0 ? (
        <BigSpinner size={42} />
      ) : account ? (
        <ProviderList
          account={account}
          parentAccount={parentAccount}
          providers={rampCatalog.value.offRamp}
          onBack={reset}
          trade={{
            type: "offRamp",
            cryptoCurrencyId: account.token ? account.token.id : account.currency.id,
            fiatCurrencyId: fiatCurrency.ticker,
            fiatAmount: 400,
          }}
        />
      ) : (
        <SelectAccountAndCurrency
          selectAccount={selectAccount}
          allCurrencies={sortedCurrencies}
          defaultCurrencyId={defaultCurrencyId}
          defaultAccountId={defaultAccountId}
          confirmCb={confirmButtonTracking}
          flow="sell"
        />
      )}
    </BuyContainer>
  );
};

export default OffRamp;
