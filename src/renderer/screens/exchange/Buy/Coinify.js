// @flow

import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { getAccountCurrency, isAccountEmpty } from "@ledgerhq/live-common/lib/account/helpers";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types/account";
import SelectAccountAndCurrency from "~/renderer/components/SelectAccountAndCurrency";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { openModal } from "~/renderer/actions/modals";
import TrackPage from "~/renderer/analytics/TrackPage";
import { track } from "~/renderer/analytics/segment";
import type { DProps } from "~/renderer/screens/exchange";
import { useExchangeProvider, useCoinifyCurrencies } from "../hooks";
import CoinifyWidget from "../CoinifyWidget";

const BuyContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
`;

const Coinify = ({ defaultCurrency, defaultAccount }: DProps) => {
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

  const confirmAccount = useCallback((account: AccountLike, parentAccount: Account) => {
    setState(oldState => ({
      ...oldState,
      account: account,
      parentAccount: parentAccount,
    }));
  }, []);

  const selectAccount = useCallback(
    (account, parentAccount) => {
      dispatch(
        openModal("MODAL_EXCHANGE_CRYPTO_DEVICE", {
          account,
          parentAccount,
          onResult: confirmAccount,
          flow: "buy",
        }),
      );
    },
    [dispatch, confirmAccount],
  );

  const confirmButtonTracking = useCallback(account => {
    track("Buy Crypto Continue Button", {
      currencyName: getAccountCurrency(account).name,
      isEmpty: isAccountEmpty(account),
    });
  }, []);

  const allCurrencies = useCoinifyCurrencies("BUY");
  const [provider] = useExchangeProvider();

  return (
    <BuyContainer>
      <TrackPage category="Buy Crypto" />
      {account ? (
        <CoinifyWidget account={account} parentAccount={parentAccount} mode="buy" onReset={reset} />
      ) : (
        <SelectAccountAndCurrency
          selectAccount={selectAccount}
          allCurrencies={allCurrencies}
          defaultCurrency={defaultCurrency}
          defaultAccount={defaultAccount}
          confirmCb={confirmButtonTracking}
          provider={provider}
          flow="buy"
        />
      )}
    </BuyContainer>
  );
};

export default Coinify;
