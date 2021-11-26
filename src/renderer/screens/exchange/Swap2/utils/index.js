// @flow
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import * as providerIcons from "~/renderer/icons/providers";
import type { ExchangeRate, CheckQuoteStatus } from "@ledgerhq/live-common/lib/exchange/swap/types";
import type { KYCStatus } from "@ledgerhq/live-common/lib/exchange/swap/utils";
import { KYC_STATUS } from "@ledgerhq/live-common/lib/exchange/swap/utils";
import { SwapExchangeRateAmountTooLow } from "@ledgerhq/live-common/lib/errors";
import { NotEnoughBalance } from "@ledgerhq/errors";
import { track } from "~/renderer/analytics/segment";
import jwtDecode from "jwt-decode";

export const SWAP_VERSION = "2.34";

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

// FIXME: should move to LLC
export const isJwtExpired = (jwtToken: string) => {
  const { exp } = jwtDecode(jwtToken);

  const currentTime = new Date().getTime() / 1000;

  return currentTime > exp;
};

// FIXME: should move to LLC
export const getKYCStatusFromCheckQuoteStatus = (
  checkQuoteStatus: CheckQuoteStatus,
): KYCStatus | null => {
  switch (checkQuoteStatus.code) {
    case "KYC_PENDING":
      return KYC_STATUS.pending;

    case "KYC_FAILED":
      return KYC_STATUS.rejected;

    case "KYC_UNDEFINED":
    case "KYC_UPGRADE_REQUIRED":
      return KYC_STATUS.upgradeRequierd;

    case "OK":
      return KYC_STATUS.approved;

    // FIXME: should handle all other non KYC related error cases somewhere
    default:
      return null;
  }
};

// FIXME: should move to LLC
export type WidgetType = "login" | "kyc";
export const getFTXURL = (type: WidgetType) => {
  // TODO: fetch domain (.com vs .us) through API
  const domain = "ftx.com";
  return `https://${domain}/${type}?hideFrame=true&ledgerLive=true`;
};
