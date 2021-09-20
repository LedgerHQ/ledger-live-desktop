// @flow

import type { ExchangeRate } from "@ledgerhq/live-common/lib/types";

export const KYC_STATUS = {
  pending: "pending",
  rejected: "closed",
  approved: "approved",
};

export type KYCStatus = $Keys<typeof KYC_STATUS>;

export const pickExchangeRate = (
  exchangeRates: ExchangeRate[],
  exchangeRate: ExchangeRate,
  setExchangeRate: (?ExchangeRate) => void,
) => {
  const hasRates = exchangeRates?.length > 0;
  // If the user picked an exchange rate before, try to select the new one that matches.
  // Otherwise pick the first one.
  const rate =
    hasRates &&
    ((exchangeRate &&
      exchangeRates.find(
        ({ tradeMethod, provider }) =>
          tradeMethod === exchangeRate.tradeMethod && provider === exchangeRate.provider,
      )) ||
      exchangeRates[0]);
  setExchangeRate(rate || null);
};
