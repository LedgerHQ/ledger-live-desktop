// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import Button from "~/renderer/components/Button";
import { useHistory } from "react-router-dom";
import { closeAllModal } from "~/renderer/actions/modals";
import { useDispatch } from "react-redux";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

const BuyButton = ({ currency }: { currency: CryptoCurrency }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    dispatch(closeAllModal());
    history.push({
      pathname: "/exchange",
      state: {
        defaultCurrency: currency,
      },
    });
  }, [currency, dispatch, history]);

  return (
    <Button mr={1} primary inverted onClick={onClick}>
      <Trans i18nKey="buy.buyCTA" values={{ currencyTicker: currency.ticker }} />
    </Button>
  );
};

export default BuyButton;
