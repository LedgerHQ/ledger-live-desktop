// @flow
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import * as providerIcons from "~/renderer/icons/providers";
import type { ExchangeRate } from "@ledgerhq/live-common/lib/exchange/swap/types";

export const useRedirectToSwapForm = () => {
  const history = useHistory();

  return useCallback(
    _ => {
      history.push("/swap");
    },
    [history],
  );
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
