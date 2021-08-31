// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import Button from "~/renderer/components/Button";
import { useHistory } from "react-router-dom";
import { closeAllModal } from "~/renderer/actions/modals";
import { useDispatch } from "react-redux";
import type { Account, CryptoCurrency } from "@ledgerhq/live-common/lib/types";

import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { isCurrencySupported } from "~/renderer/screens/exchange/config";

const BuyButton = ({ currency, account }: { currency: CryptoCurrency, account: Account }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    dispatch(closeAllModal());
    setTrackingSource("send flow");
    history.push({
      pathname: "/exchange",
      state: {
        tab: 0,
        defaultCurrency: currency,
        defaultAccount: account,
      },
    });
  }, [account, currency, dispatch, history]);

  if (!isCurrencySupported("BUY", currency)) {
    return null;
  }

  return (
    <Button mr={1} primary inverted onClick={onClick}>
      <Trans i18nKey="buy.buyCTA" values={{ currencyTicker: currency.ticker }} />
    </Button>
  );
};

export default BuyButton;
