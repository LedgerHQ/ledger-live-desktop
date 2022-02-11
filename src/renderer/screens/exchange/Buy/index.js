// @flow

import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { getAccountCurrency, isAccountEmpty } from "@ledgerhq/live-common/lib/account/helpers";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types/account";
import SelectAccountAndCurrency from "~/renderer/components/SelectAccountAndCurrency";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import TrackPage from "~/renderer/analytics/TrackPage";
import { track } from "~/renderer/analytics/segment";
import type { DProps } from "~/renderer/screens/exchange";
import { ProviderList } from "../ProviderList";
import { useRampCatalogCurrencies } from "../hooks";
import { useRampCatalog } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider";

const BuyContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
`;

const Coinify = ({ defaultCurrency, defaultAccount, rampCatalog }: DProps) => {
  const [state, setState] = useState({
    account: undefined,
    parentAccount: undefined,
  });

  const { account, parentAccount } = state;

  const dispatch = useDispatch();

  const reset = useCallback(() => {
    track("Page Buy Reset");
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
    track("Buy Crypto Continue Button", {
      currencyName: getAccountCurrency(account).name,
      isEmpty: isAccountEmpty(account),
    });
  }, []);

  const allCurrencies = useRampCatalogCurrencies(rampCatalog.value.onRamp);

  return (
    <BuyContainer>
      <TrackPage category="Buy Crypto" />
      {account ? (
        <ProviderList
          account={account}
          parentAccount={parentAccount}
          providers={rampCatalog.value.onRamp}
          onBack={reset}
          trade={{
            type: "onRamp",
            cryptoCurrencyId: account.token ? account.token.id : account.currency.id,
          }}
        />
      ) : (
        <SelectAccountAndCurrency
          selectAccount={selectAccount}
          allCurrencies={allCurrencies}
          defaultCurrency={defaultCurrency}
          defaultAccount={defaultAccount}
          confirmCb={confirmButtonTracking}
          flow="buy"
        />
      )}
    </BuyContainer>
  );
};

export default Coinify;
