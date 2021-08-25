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
import { useHistory } from "react-router-dom";
import { closeAllModal } from "~/renderer/actions/modals";
import { useDispatch } from "react-redux";

import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { isCurrencySupported } from "~/renderer/screens/exchange/config";

const ErrorBox: ThemedComponent<{}> = styled(Box).attrs(p => ({ horizontal: true, width: "100%" }))`
  color: ${props => props.theme.colors.alertRed};
  column-gap: 0.25rem;
`;

const getErrorTranslationKey = (error: Error, isCurrencySupported: boolean) => {
  const suffix = isCurrencySupported ? "_withCta" : "";

  switch (true) {
    case error instanceof NotEnoughBalance:
      return {
        i18nKey: `swap2.form.from.errors.notEnoughBalance${suffix}`,
      };
    case error instanceof NotEnoughGas:
      return {
        i18nKey: `swap2.form.from.errors.notEnoughGas${suffix}`,
      };
    case error instanceof SwapExchangeRateAmountTooLow:
      return {
        i18nKey: `swap2.form.from.errors.exchangeAmountTooLow${suffix}`,
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

type BuyButtonProps = {
  currency: CryptoCurrency,
  account: Account,
  children?: React$Node,
  isCurrencyPurchasable: boolean,
};
const BuyButton = ({ currency, account, isCurrencyPurchasable, children }: BuyButtonProps) => {
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
  }, [account, currency]);

  if (!isCurrencyPurchasable) return null;

  return (
    <span role="button" onClick={onClick} style={{ display: "inline-block", cursor: "pointer" }}>
      <Text ff="Inter" fontSize="10px" lineHeight="1.4" color="palette.primary.main">
        {children}
      </Text>
    </span>
  );
};

const SwapFormError = ({ error, account }: { error: Error, account: Account | TokenAccount }) => {
  const currency = account?.currency ?? account?.token;
  const isCurrencyPurchasable = isCurrencySupported("BUY", currency);
  const { i18nKey } = getErrorTranslationKey(error, isCurrencyPurchasable);

  return (
    <ErrorBox>
      <ExclamationCircle size={12} />
      <Text ff="Inter" fontSize="0.6875rem" lineHeight="1.4">
        <Trans
          i18nKey={i18nKey}
          values={{ currencyTicker: currency.ticker }}
          components={{
            cta: (
              <BuyButton
                currency={currency}
                account={account}
                isCurrencyPurchasable={isCurrencyPurchasable}
              />
            ),
          }}
        />
      </Text>
    </ErrorBox>
  );
};

export default SwapFormError;
