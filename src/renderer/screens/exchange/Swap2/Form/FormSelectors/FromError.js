// @flow
import React, { useCallback } from "react";
import ExclamationCircle from "~/renderer/icons/ExclamationCircle";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import type { Account, TokenAccount, CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { NotEnoughBalance, NotEnoughGas } from "@ledgerhq/errors";
import {
  SwapExchangeRateAmountTooLow,
  SwapExchangeRateAmountTooHigh,
} from "@ledgerhq/live-common/lib/errors";
import Button from "~/renderer/components/Button";
import { useHistory } from "react-router-dom";
import { closeAllModal } from "~/renderer/actions/modals";
import { useDispatch } from "react-redux";

import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { isCurrencySupported } from "~/renderer/screens/exchange/config";

const ErrorBox: ThemedComponent<{}> = styled(Box).attrs(p => ({ horizontal: true, width: "100%" }))`
  color: ${props => props.theme.colors.alertRed};
  column-gap: 0.25rem;
`;

const getError = (error, account) => {
  switch (true) {
    case error instanceof NotEnoughBalance:
      return {
        i18nKey: "swap2.form.from.errors.notEnoughBalance",
      };
    case error instanceof NotEnoughGas:
      return {
        i18nKey: "swap2.form.from.errors.notEnoughGas",
      };
    case error instanceof SwapExchangeRateAmountTooLow:
      return {
        i18nKey: "swap2.form.from.errors.exchangeAmountTooLow",
      };
    case error instanceof SwapExchangeRateAmountTooHigh:
      return {
        i18nKey: "swap2.form.from.errors.exchangeAmountTooHigh",
      };
    default:
      return {
        i18nKey: "swap2.form.from.errors.default",
      };
  }
};

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
    <Button onClick={onClick}>
      <Trans i18nKey="buy.buyCTA" values={{ currencyTicker: currency.ticker }} />
    </Button>
  );
};

const SwapFormError = ({ error, account }: { error: Error, account: Account | TokenAccount }) => {
  const { i18nKey } = getError(error, account);

  return (
    <ErrorBox>
      <ExclamationCircle size={12} />
      <Text ff="Inter" fontSize="0.6875rem" lineHeight="1.4">
        <Trans
          i18nKey={i18nKey}
          components={{
            cta: <BuyButton currency={account?.currency ?? account?.token} account={account} />,
          }}
        />
      </Text>
    </ErrorBox>
  );
};

export default SwapFormError;
