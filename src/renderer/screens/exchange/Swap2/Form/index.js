// @flow
import React, { useEffect } from "react";
import SwapFormSummary from "./FormSummary";
import SwapFormSelectors from "./FormSelectors";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import ButtonBase from "~/renderer/components/Button";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { context } from "~/renderer/drawers/Provider";
import { useTranslation } from "react-i18next";
import {
  useSwapProviders,
  usePickExchangeRate,
  usePollKYCStatus,
} from "~/renderer/screens/exchange/Swap2/utils/shared/hooks";
import { KYC_STATUS } from "~/renderer/screens/exchange/Swap2/utils/shared";
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
import FormKYCBanner from "./FormKYCBanner";
import { swapKYCSelector } from "~/renderer/reducers/settings";
import { setSwapKYCStatus } from "~/renderer/actions/settings";
import ExchangeDrawer from "./ExchangeDrawer/index";

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
  const { t } = useTranslation();
  const { providers, error: providersError } = useSwapProviders();
  const dispatch = useDispatch();
  const storedProviders = useSelector(providersSelector);
  const exchangeRate = useSelector(rateSelector);
  const swapTransaction = useSwapTransaction();
  const exchangeRatesState = swapTransaction.swap?.rates;
  const swapKYC = useSelector(swapKYCSelector);
  const provider = exchangeRate?.provider;
  const providerKYC = swapKYC?.[provider];
  const kycStatus = providerKYC?.status;
  const showWyreKYCBanner = provider === "wyre" && kycStatus !== KYC_STATUS.approved;
  const { setDrawer } = React.useContext(context);

  useEffect(() => {
    if (providers) dispatch(updateProvidersAction(providers));
  }, [providers]);

  useEffect(() => {
    if (providersError) dispatch(resetSwapAction());
  }, [providersError]);

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

  usePollKYCStatus(
    {
      provider,
      kyc: providerKYC,
      onChange: res => {
        dispatch(
          setSwapKYCStatus({
            provider: provider,
            id: res?.id,
            status: res?.status,
          }),
        );
      },
    },
    [dispatch],
  );
  const swapError = swapTransaction.fromAmountError || exchangeRatesState?.error;

  const isSwapReady =
    !swapTransaction.bridgePending &&
    exchangeRatesState.status !== "loading" &&
    swapTransaction.transaction &&
    !providersError &&
    !swapError &&
    !showWyreKYCBanner &&
    exchangeRate;

  const onSubmit = () => {
    setDrawer(ExchangeDrawer, {
      swapTransaction,
      exchangeRate,
    });
  };

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
          fromAmountError={swapError}
          isSwapReversable={swapTransaction.swap.isSwapReversable}
          reverseSwap={swapTransaction.reverseSwap}
          loadingRates={swapTransaction.swap.rates.status === "loading"}
        />
        <SwapFormSummary
          swapTransaction={swapTransaction}
          kycStatus={kycStatus}
          provider={provider}
        />
        {showWyreKYCBanner ? <FormKYCBanner provider={provider} status={kycStatus} /> : null}
        <Button primary disabled={!isSwapReady} onClick={onSubmit}>
          {t("common.exchange")}
        </Button>
      </Wrapper>
    );

  // TODO: ensure that the error is catch by Sentry in this case
  if (providersError) return <FormNotAvailable />;
  if (storedProviders?.length === 0) return <FormNotAvailable />;

  return <FormLoading />;
};

export default SwapForm;
