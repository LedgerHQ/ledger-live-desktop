// @flow
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import * as providerIcons from "~/renderer/icons/providers";
import type { ExchangeRate } from "@ledgerhq/live-common/lib/exchange/swap/types";
import { SwapExchangeRateAmountTooLow } from "@ledgerhq/live-common/lib/errors";
import { NotEnoughBalance } from "@ledgerhq/errors";
import { track } from "~/renderer/analytics/segment";

export const SWAP_VERSION = "2.34";

export const useRedirectToSwapForm = () => {
  const history = useHistory();

  return useCallback(() => {
    history.push("/swap");
  }, [history]);
};

export const useRedirectToSwapHistory = () => {
  const history = useHistory();

  return useCallback(
    ({ swapId }: { swapId?: string } = {}) => {
      history.push({ pathname: "/swap/history", state: { swapId } });
    },
    [history],
  );
};

export const iconByProviderName = Object.entries(providerIcons).reduce(
  (obj, [key, value]) => ({
    ...obj,
    [key.toLowerCase()]: value,
  }),
  {},
);

export const getProviderIcon = (exchangeRate: ExchangeRate) =>
  iconByProviderName[exchangeRate.provider.toLowerCase()];

export const trackSwapError = (error: *, properties: * = {}) => {
  if (!error) return;
  if (error instanceof SwapExchangeRateAmountTooLow) {
    track("Page Swap Form - Error Less Mini", {
      ...properties,
    });
  }
  if (error instanceof NotEnoughBalance) {
    track("Page Swap Form - Error No Funds", {
      ...properties,
    });
  }
};
