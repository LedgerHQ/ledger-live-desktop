// @flow
import React, { useState, useEffect } from "react";
import SwapFormSummary from "./FormSummary";
import SwapFormSelectors from "./FormSelectors";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import ButtonBase from "~/renderer/components/Button";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { useTranslation } from "react-i18next";
import {
  useSwapProviders,
  usePickExchangeRate,
} from "~/renderer/screens/exchange/Swap2/utils/shared/hooks";
import useSwapTransaction from "~/renderer/screens/exchange/Swap2/utils/shared/useSwapTransaction";

import { useDispatch, useSelector } from "react-redux";
import {
  updateProvidersAction,
  resetSwapAction,
  providersSelector,
  updateTransactionAction,
  updateRateAction,
  rateSelector,
} from "~/renderer/actions/swap";
import FormLoading from "./FormLoading";
import FormNotAvailable from "./FormNotAvailable";

const Wrapper: ThemedComponent<{}> = styled(Box).attrs({
  p: 20,
  mt: 35,
})`
  row-gap: 1.75rem;
  max-width: 27.5rem;
`;

const Button = styled(ButtonBase)`
  justify-content: center;
`;

const SwapForm = () => {
  // SWAP MOCK - PLEASE REMOVE ME ASA LOGIC IS IMPLEMENTED
  const [isSwapReady] = useState(false);
  const { t } = useTranslation();
  const { providers, error } = useSwapProviders();
  const dispatch = useDispatch();
  const storedProviders = useSelector(providersSelector);
  const exchangeRate = useSelector(rateSelector);
  const swapTransaction = useSwapTransaction();
  const exchangeRatesState = swapTransaction.swap?.rates;

  // SWAP MOCK - PLEASE REMOVE ME ASA LOGIC IS IMPLEMENTED
  const onSubmit = () => {};

  useEffect(() => {
    if (providers) dispatch(updateProvidersAction(providers));
  }, [providers]);

  useEffect(() => {
    if (error) dispatch(resetSwapAction());
  }, [error]);

  useEffect(() => {
    dispatch(updateTransactionAction(swapTransaction.transaction));
    // eslint-disable-next-line
  }, [swapTransaction.transaction]);

  usePickExchangeRate({
    exchangeRates: exchangeRatesState?.value,
    exchangeRate,
    setExchangeRate: rate => {
      dispatch(updateRateAction(rate));
    },
  });

  if (providers?.length)
    return (
      <Wrapper>
        <SwapFormSelectors
          fromAccount={swapTransaction.swap.from.account}
          fromAmount={swapTransaction.swap.from.amount}
          toCurrency={swapTransaction.swap.to.currency}
          toAmount={exchangeRate?.toAmount || null}
          setFromAccount={swapTransaction.setFromAccount}
          setFromAmount={swapTransaction.setFromAmount}
          setToAccount={swapTransaction.setToAccount}
          isMaxEnabled={swapTransaction.swap.isMaxEnabled}
          toggleMax={swapTransaction.toggleMax}
          fromAmountError={swapTransaction.fromAmountError || exchangeRatesState?.error}
          // TODO: implement the "to" currency input loader
          // loadingRates={swapTransaction.swap.rates.status === "loading"}
        />
        <SwapFormSummary swapTransaction={swapTransaction} />
        <Button primary disabled={!isSwapReady} onClick={onSubmit}>
          {t("common.exchange")}
        </Button>
      </Wrapper>
    );

  // TODO: ensure that the error is catch by Sentry in this case
  if (error) return <FormNotAvailable />;
  if (storedProviders?.length === 0) return <FormNotAvailable />;

  return <FormLoading />;
};

export default SwapForm;
