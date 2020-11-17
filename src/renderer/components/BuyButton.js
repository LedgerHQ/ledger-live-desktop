// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import Button from "~/renderer/components/Button";
import { useHistory } from "react-router-dom";
import { closeAllModal } from "~/renderer/actions/modals";
import { useDispatch } from "react-redux";
import type { Account, CryptoCurrency } from "@ledgerhq/live-common/lib/types";

const BuyButton = ({ currency, account }: { currency: CryptoCurrency, account: Account }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    dispatch(closeAllModal());
    history.push({
      pathname: "/exchange",
      state: {
        tab: 0,
        defaultCurrency: currency,
        defaultAccount: account,
        source: "send flow",
      },
    });
  }, [account, currency, dispatch, history]);

  return (
    <Button mr={1} primary inverted onClick={onClick}>
      <Trans i18nKey="buy.buyCTA" values={{ currencyTicker: currency.ticker }} />
    </Button>
  );
};

export default BuyButton;
