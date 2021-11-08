// @flow

import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { getAccountCurrency, isAccountEmpty } from "@ledgerhq/live-common/lib/account/helpers";
import SelectAccountAndCurrency from "~/renderer/components/SelectAccountAndCurrency";
import CoinifyWidget from "../CoinifyWidget";
import { useExchangeProvider, useCoinifyCurrencies } from "../hooks";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { openModal } from "~/renderer/actions/modals";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types/account";
import { useDispatch } from "react-redux";
import TrackPage from "~/renderer/analytics/TrackPage";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { track } from "~/renderer/analytics/segment";

const BuyContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

type Props = {
  defaultCurrency?: ?(CryptoCurrency | TokenCurrency),
  defaultAccount?: ?Account,
};

const Buy = ({ defaultCurrency, defaultAccount }: Props) => {
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

export default Buy;
