// @flow
import { useMemo } from "react";
import { listCryptoCurrencies, listTokens } from "@ledgerhq/live-common/lib/currencies";
import { useCurrenciesByMarketcap } from "@ledgerhq/live-common/lib/currencies/sortByMarketcap";

import { supportedBuyCurrenciesIds, supportedSellCurrenciesIds } from "./config";
import useEnv from "@ledgerhq/live-common/lib/hooks/useEnv";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types/currencies";
import type { AccountLike } from "@ledgerhq/live-common/lib/types/account";
import { useSelector } from "react-redux";
import { blacklistedTokenIdsSelector } from "~/renderer/reducers/settings";

export const useCoinifyCurrencies = (mode: "BUY" | "SELL") => {
  const devMode = useEnv("MANAGER_DEV_MODE");

  // fetching all live supported currencies including tokens
  const cryptoCurrencies = useMemo(() => listCryptoCurrencies(devMode).concat(listTokens()), [
    devMode,
  ]);

  // sorting them by marketcap
  const sortedCryptoCurrencies = useCurrenciesByMarketcap(cryptoCurrencies);

  const blacklistedTokenIds = useSelector(blacklistedTokenIdsSelector);
  // cherry picking only those available in coinify

  const supportedCurrenciesIds =
    mode === "BUY" ? supportedBuyCurrenciesIds : supportedSellCurrenciesIds;
  /** $FlowFixMe */
  const supportedCryptoCurrencies = sortedCryptoCurrencies.filter(
    currency =>
      supportedCurrenciesIds.includes(currency.id) && !blacklistedTokenIds.includes(currency.id),
  );

  return supportedCryptoCurrencies;
};

export const getAccountsForCurrency = (
  currency: CryptoCurrency | TokenCurrency,
  allAccounts: AccountLike[],
): AccountLike[] => {
  return allAccounts.filter(
    account =>
      (account.type === "TokenAccount" ? account.token.id : account.currency.id) === currency.id,
  );
};
