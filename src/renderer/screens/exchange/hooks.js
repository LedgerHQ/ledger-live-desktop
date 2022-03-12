// @flow
import { useCallback, useMemo } from "react";
import { listCryptoCurrencies, listTokens } from "@ledgerhq/live-common/lib/currencies";

import useEnv from "@ledgerhq/live-common/lib/hooks/useEnv";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types/currencies";
import type { AccountLike } from "@ledgerhq/live-common/lib/types/account";
import { useSelector } from "react-redux";
import { blacklistedTokenIdsSelector } from "~/renderer/reducers/settings";
import { RampCatalogEntry } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider/types";
import { getAllSupportedCryptoCurrencyIds } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider/helpers";

import coinifyIcon from "~/renderer/images/coinifyLogo.png";

export const useRampCatalogCurrencies = (entries: RampCatalogEntry[]) => {
  const devMode = useEnv("MANAGER_DEV_MODE");

  // fetching all live supported currencies including tokens
  const cryptoCurrencies = useMemo(() => listCryptoCurrencies(devMode).concat(listTokens()), [
    devMode,
  ]);

  const blacklistedTokenIds = useSelector(blacklistedTokenIdsSelector);
  // cherry picking only those available in coinify

  const supportedCurrenciesIds = getAllSupportedCryptoCurrencyIds(entries);
  /** $FlowFixMe */
  const supportedCryptoCurrencies = cryptoCurrencies.filter(
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

const PROVIDERS = {
  COINIFY: {
    id: "Coinify",
    iconResource: coinifyIcon,
  },
};

let exchangeProvider = PROVIDERS.COINIFY;

// @TODO move this switch logic in settings maybe
export const useExchangeProvider = () => {
  const setProvider = useCallback(
    (p: { id: string, iconResource: any }) => (exchangeProvider = p),
    [],
  );

  return [exchangeProvider, setProvider];
};
