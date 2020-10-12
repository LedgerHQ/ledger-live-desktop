// @flow

import React, { useState, useCallback, useMemo } from "react";
import SelectAccountAndCurrency from "./SelectAccountAndCurrency";
import styled from "styled-components";
import CoinifyWidget from "../CoinifyWidget";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types/account";
import { useDispatch, useSelector } from "react-redux";
import TrackPage from "~/renderer/analytics/TrackPage";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { getCurrenciesWithStatus } from "@ledgerhq/live-common/lib/swap/logic";
import { swapSupportedCurrenciesSelector } from "~/renderer/reducers/settings";

import { accountsSelector } from "~/renderer/reducers/accounts";

const SellContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

type Props = {
  defaultCurrency?: ?(CryptoCurrency | TokenCurrency),
  defaultAccount?: ?Account,
};

const Sell = ({ defaultCurrency, defaultAccount, installedApps }: Props) => {
  const [state, setState] = useState({
    account: undefined,
    parentAccount: undefined,
  });

  const accounts = useSelector(accountsSelector);

  const selectableCurrencies = useSelector(swapSupportedCurrenciesSelector);

  const currenciesStatus = useMemo(
    () =>
      getCurrenciesWithStatus({
        accounts,
        installedApps,
        selectableCurrencies,
      }),
    [accounts, installedApps, selectableCurrencies],
  );

  const { account, parentAccount } = state;

  const dispatch = useDispatch();

  const reset = useCallback(() => {
    setState({
      account: undefined,
      parentAccount: undefined,
    });
  }, []);

  const confirmAccount = useCallback((account: AccountLike, parentAccount: Account) => {
    setState(oldState => ({
      ...oldState,
      account: account,
      parentAccount: parentAccount,
    }));
  }, []);

  const selectAccount = useCallback(
    (account, parentAccount) => {
      // hook here for the pre validation
      //       dispatch(
      //         openModal("MODAL_SELL_CRYPTO_DEVICE", {
      //           account,
      //           parentAccount,
      //           onResult: confirmAccount,
      //         }),
      //       );
      confirmAccount(account, parentAccount)
    },
    [dispatch, confirmAccount],
  );

  return (
    <SellContainer>
      <TrackPage category="Sell Crypto" />
      {account ? (
        <CoinifyWidget account={account} parentAccount={parentAccount} mode="sell" onReset={reset} />
      ) : (
        <SelectAccountAndCurrency
          selectAccount={selectAccount}
          defaultCurrency={defaultCurrency}
          defaultAccount={defaultAccount}
          currenciesStatus={currenciesStatus}
          allAccounts={accounts}
        />
      )}
    </SellContainer>
  );
};

export default Sell;
