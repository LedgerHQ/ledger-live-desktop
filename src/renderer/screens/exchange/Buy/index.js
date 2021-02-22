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
import { track } from "~/renderer/analytics/segment";
import { useOnClearOverlays, useSetOverlays } from "~/renderer/components/ProductTour/hooks";

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
  useSetOverlays(!account, {
    selector: "#exchange-form",
    i18nKey: "productTour.flows.buy.overlays.form",
    config: { top: true, withFeedback: true, padding: 20 },
  });
  const onModalShownHideOverlay = useOnClearOverlays();

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
      onModalShownHideOverlay();
      dispatch(
        openModal("MODAL_EXCHANGE_CRYPTO_DEVICE", {
          account,
          parentAccount,
          onResult: confirmAccount,
        }),
      );
    },
    [onModalShownHideOverlay, dispatch, confirmAccount],
  );

  return (
    <BuyContainer>
      <TrackPage category="Buy Crypto" />
      {account ? (
        <CoinifyWidget account={account} parentAccount={parentAccount} mode="buy" onReset={reset} />
      ) : (
        <SelectAccountAndCurrency
          id={"exchange-form"}
          selectAccount={selectAccount}
          defaultCurrency={defaultCurrency}
          defaultAccount={defaultAccount}
        />
      )}
    </BuyContainer>
  );
};

export default Buy;
