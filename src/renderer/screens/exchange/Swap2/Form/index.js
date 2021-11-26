// @flow
import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
  usePollKYCStatus,
  useSwapTransaction,
} from "@ledgerhq/live-common/lib/exchange/swap/hooks";
import { KYC_STATUS } from "@ledgerhq/live-common/lib/exchange/swap/utils";
import type { KYCStatus } from "@ledgerhq/live-common/lib/exchange/swap/utils";
import { checkQuote } from "@ledgerhq/live-common/lib/exchange/swap";
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
import FormLoginBanner from "./FormLoginBanner";
import { swapKYCSelector } from "~/renderer/reducers/settings";
import { setSwapKYCStatus } from "~/renderer/actions/settings";
import ExchangeDrawer from "./ExchangeDrawer/index";
import TrackPage from "~/renderer/analytics/TrackPage";
import { track } from "~/renderer/analytics/segment";
import {
  SWAP_VERSION,
  trackSwapError,
  isJwtExpired,
  getKYCStatusFromCheckQuoteStatus,
} from "../utils/index";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import SwapConnectFTX from "../SwapConnectFTX";
import KYC from "../KYC";

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

const trackNoRates = ({ toState }) => {
  track("Page Swap Form - Error No Rate", {
    sourceCurrency: toState.currency?.name,
  });
};

export const useProviders = () => {
  const dispatch = useDispatch();
  const { providers, error: providersError } = useSwapProviders();
  const storedProviders = useSelector(providersSelector);

  useEffect(() => {
    if (providers) dispatch(updateProvidersAction(providers));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providers]);

  useEffect(() => {
    if (providersError) dispatch(resetSwapAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providersError]);

  return {
    storedProviders,
    providers,
    providersError,
  };
};

const shouldShowLoginBanner = ({ provider, token }: { provider: string, token: string }) => {
  if (!["ftx"].includes(provider)) {
    return false;
  }

  return !token || isJwtExpired(token);
};

const shouldShowKYCBanner = ({
  provider,
  kycStatus,
}: {
  provider: string,
  kycStatus: KYCStatus,
}) => {
  if (!["ftx", "wyre"].includes(provider)) {
    return false;
  }

  return kycStatus !== KYC_STATUS.approved;
};

const SwapForm = () => {
  const [isInLoginFlow, setIsInLoginFlow] = useState(false);
  const [isInKycFlow, setIsInKycFlow] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { state: locationState } = useLocation();
  const accounts = useSelector(shallowAccountsSelector);
  const { storedProviders, providers, providersError } = useProviders();
  const exchangeRate = useSelector(rateSelector);
  const setExchangeRate = useCallback(
    rate => {
      dispatch(updateRateAction(rate));
    },
    [dispatch],
  );
  const swapTransaction = useSwapTransaction({
    accounts,
    exchangeRate,
    setExchangeRate,
    onNoRates: trackNoRates,
    ...locationState,
  });

  const exchangeRatesState = swapTransaction.swap?.rates;
  const swapKYC = useSelector(swapKYCSelector);
  const provider = exchangeRate?.provider;
  const providerKYC = swapKYC?.[provider];
  const kycStatus = providerKYC?.status;

  const showLoginBanner = shouldShowLoginBanner({ provider, token: providerKYC?.id });

  // we display the KYC banner component if partner requiers KYC and is not yet approved
  // we don't display it if user needs to login first
  const showKYCBanner = !showLoginBanner && shouldShowKYCBanner({ provider, kycStatus });

  const { setDrawer } = React.useContext(context);

  useEffect(() => {
    dispatch(updateTransactionAction(swapTransaction.transaction));
    // eslint-disable-next-line
  }, [swapTransaction.transaction]);

  useEffect(() => {
    // Whenever an account is added, reselect the currency to pick a default target account.
    // (possibly the one that got created)
    if (swapTransaction.swap.to.currency && !swapTransaction.swap.to.account) {
      swapTransaction.setToCurrency(swapTransaction.swap.to.currency);
    }
    // eslint-disable-next-line
  }, [accounts]);

  // FIXME: update usePollKYCStatus to use checkQuote for KYC status (?)
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

  // Track errors
  useEffect(
    () => {
      swapError &&
        trackSwapError(swapError, {
          sourcecurrency: swapTransaction.swap.from.currency?.name,
          provider,
          swapVersion: SWAP_VERSION,
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [swapError],
  );

  // FIXME: Too complicated, seems to handle to much things (KYC status + non KYC related errors)
  useEffect(() => {
    if (!providerKYC?.id || !exchangeRate?.rateId) {
      return;
    }

    const userId = providerKYC.id;

    const handleCheckQuote = async () => {
      const status = await checkQuote({
        quoteId: exchangeRate.rateId,
        bearerToken: userId,
      });

      if (status.code === "OK") {
        if (kycStatus === KYC_STATUS.approved) {
          return;
        }
        dispatch(setSwapKYCStatus({ provider, id: userId, status: KYC_STATUS.approved }));
      }

      // Handle all non KYC related errors
      if (!status.code.startsWith("KYC_")) {
        // FIXME: handle error messages
        console.log("TEST --- ERROR", { status });
        return;
      }

      // Handle all KYC related errors
      if (status.code.startsWith("KYC_")) {
        const updatedKycStatus = getKYCStatusFromCheckQuoteStatus(status);
        if (updatedKycStatus !== kycStatus) {
          dispatch(setSwapKYCStatus({ provider, id: userId, status: updatedKycStatus }));
        }
      }
    };

    handleCheckQuote();
  }, [providerKYC, exchangeRate, dispatch, provider, kycStatus]);

  const isSwapReady =
    !swapTransaction.bridgePending &&
    exchangeRatesState.status !== "loading" &&
    swapTransaction.transaction &&
    !providersError &&
    !swapError &&
    !showLoginBanner &&
    !showKYCBanner &&
    exchangeRate &&
    swapTransaction.swap.to.account;

  const onSubmit = () => {
    track("Page Swap Form - Request", {
      sourceCurrency: sourceCurrency?.name,
      targetCurrency: targetCurrency?.name,
      provider,
      swapVersion: SWAP_VERSION,
    });
    setDrawer(ExchangeDrawer, { swapTransaction, exchangeRate }, { preventBackdropClick: true });
  };

  const sourceAccount = swapTransaction.swap.from.account;
  const sourceCurrency = swapTransaction.swap.from.currency;
  const targetCurrency = swapTransaction.swap.to.currency;

  if (isInLoginFlow) {
    return (
      <SwapConnectFTX provider={provider} type="login" onClose={() => setIsInLoginFlow(false)} />
    );
  }

  if (isInKycFlow) {
    return <KYC provider={provider} onClose={() => setIsInKycFlow(false)} />;
  }

  if (providers?.length)
    return (
      <Wrapper>
        <TrackPage category="Swap" name="Form" provider={provider} swapVersion={SWAP_VERSION} />
        <SwapFormSelectors
          fromAccount={sourceAccount}
          toAccount={swapTransaction.swap.to.account}
          fromAmount={swapTransaction.swap.from.amount}
          toCurrency={targetCurrency}
          toAmount={exchangeRate?.toAmount || null}
          setFromAccount={swapTransaction.setFromAccount}
          setFromAmount={swapTransaction.setFromAmount}
          setToAccount={swapTransaction.setToAccount}
          setToCurrency={swapTransaction.setToCurrency}
          isMaxEnabled={swapTransaction.swap.isMaxEnabled}
          toggleMax={swapTransaction.toggleMax}
          fromAmountError={swapError}
          isSwapReversable={swapTransaction.swap.isSwapReversable}
          reverseSwap={swapTransaction.reverseSwap}
          provider={provider}
          loadingRates={swapTransaction.swap.rates.status === "loading"}
        />
        <SwapFormSummary
          swapTransaction={swapTransaction}
          kycStatus={kycStatus}
          provider={provider}
        />

        {showLoginBanner ? (
          <FormLoginBanner provider={provider} onClick={() => setIsInLoginFlow(true)} />
        ) : null}

        {showKYCBanner ? (
          <FormKYCBanner
            provider={provider}
            status={kycStatus}
            onClick={() => setIsInKycFlow(true)}
          />
        ) : null}

        <Button primary disabled={!isSwapReady} onClick={onSubmit} data-test-id="exchange-button">
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
