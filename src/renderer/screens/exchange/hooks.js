// @flow

import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/data/cryptocurrencies";
import { useMemo } from "react";
import { listTokens } from "@ledgerhq/live-common/lib/data/tokens";
import { useCurrenciesByMarketcap } from "@ledgerhq/live-common/lib/currencies/sortByMarketcap";

import { supportedCurrenciesIds } from "./config";
import useEnv from "@ledgerhq/live-common/lib/hooks/useEnv";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types/currencies";
import type { Account } from "@ledgerhq/live-common/lib/types/account";

export const useCoinifyCurrencies = () => {
  const devMode = useEnv("MANAGER_DEV_MODE");

  // fetching all live supported currencies including tokens
  const cryptoCurrencies = useMemo(() => listCryptoCurrencies(devMode).concat(listTokens()), [
    devMode,
  ]);

  // sorting them by marketcap
  const sortedCryptoCurrencies = useCurrenciesByMarketcap(cryptoCurrencies);

  // cherry picking only those available in coinify

  /** $FlowFixMe */
  const supportedCryptoCurrencies = sortedCryptoCurrencies.filter(currency =>
    supportedCurrenciesIds.includes(currency.id),
  );

  return supportedCryptoCurrencies;
};

export const getAccountsForCurrency = (
  currency: CryptoCurrency | TokenCurrency,
  allAccounts: Account[],
): Account[] => {
  return allAccounts.filter(
    account =>
      (account.type === "TokenAccount" ? account.token.id : account.currency.id) === currency.id,
  );
};
