// @flow

import React, { useState, useCallback } from "react";
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

const BuyContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
`;

const Coinify = ({ defaultCurrencyId, defaultAccountId, rampCatalog, defaultTicker }: DProps) => {
  const [state, setState] = useState({
    account: undefined,
    parentAccount: undefined,
  });

  const { account, parentAccount } = state;

  const dispatch = useDispatch();

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

  const allCurrencies = useRampCatalogCurrencies(rampCatalog.value.offRamp);
  const allCurrenciesFiltered = defaultTicker
    ? allCurrencies.filter(currency => currency.ticker === defaultTicker)
    : allCurrencies;

  const fiatCurrency = useSelector(counterValueCurrencySelector);

  return (
    <BuyContainer>
      <TrackPage category="Sell Crypto" />
      {account ? (
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
          allCurrencies={allCurrenciesFiltered}
          defaultCurrencyId={defaultCurrencyId}
          defaultAccountId={defaultAccountId}
          confirmCb={confirmButtonTracking}
          flow="sell"
        />
      )}
    </BuyContainer>
  );
};

export default Coinify;
