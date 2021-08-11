// @flow

import { useMemo } from "react";
import { getCurrencyColor as commonGetCurrencyColor } from "@ledgerhq/live-common/lib/currencies";
import type { Currency } from "@ledgerhq/live-common/lib/types/currencies";

import ensureContrast from "~/renderer/ensureContrast";

export const getCurrencyColor = (currency: Currency, bg: ?string) => {
  const currencyColor = commonGetCurrencyColor(currency);

  return bg ? ensureContrast(currencyColor, bg) : currencyColor;
};

export const useCurrencyColor = (currency: Currency, bg: ?string) => {
  return useMemo(() => {
    const currencyColor = commonGetCurrencyColor(currency);
    return bg ? ensureContrast(currencyColor, bg) : currencyColor;
  }, [currency, bg]);
};
