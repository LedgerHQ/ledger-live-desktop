// @flow

import React, { useState, useCallback } from "react";
import SelectAccountAndCurrency from "./SelectAccountAndCurrency";
import styled from "styled-components";
import CoinifyWidget from "../CoinifyWidget";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { openModal } from "~/renderer/actions/modals";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types/account";
import { useDispatch } from "react-redux";
import TrackPage from "~/renderer/analytics/TrackPage";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";

const BuyContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

type Props = {
  defaultCurrency?: ?(CryptoCurrency | TokenCurrency),
};

const Buy = ({ defaultCurrency }: Props) => {
  const [state, setState] = useState({
    account: undefined,
    parentAccount: undefined,
  });

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
      dispatch(
        openModal("MODAL_EXCHANGE_CRYPTO_DEVICE", {
          account,
          parentAccount,
          onResult: confirmAccount,
        }),
      );
    },
    [dispatch, confirmAccount],
  );

  return (
    <BuyContainer>
      <TrackPage category="Buy Crypto" />
      {account ? (
        <CoinifyWidget account={account} parentAccount={parentAccount} mode="buy" onReset={reset} />
      ) : (
        <SelectAccountAndCurrency selectAccount={selectAccount} defaultCurrency={defaultCurrency} />
      )}
    </BuyContainer>
  );
};

export default Buy;
