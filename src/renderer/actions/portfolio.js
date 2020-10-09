// @flow
import { useSelector } from "react-redux";
import type {
  CryptoCurrency,
  PortfolioRange,
  TokenCurrency,
  AccountLike,
} from "@ledgerhq/live-common/lib/types";
import {
  useBalanceHistoryWithCountervalue as useBalanceHistoryWithCountervalueCommon,
  usePortfolio as usePortfolioCommon,
  useCurrencyPortfolio as useCurrencyPortfolioCommon,
} from "@ledgerhq/live-common/lib/countervalues/react";
import { selectedTimeRangeSelector } from "~/renderer/reducers/settings";
import { counterValueCurrencySelector } from "./../reducers/settings";
import { accountsSelector } from "./../reducers/accounts";

// provide redux states via custom hook wrapper

export function useBalanceHistoryWithCountervalue({
  account,
  range,
}: {
  account: AccountLike,
  range: PortfolioRange,
}) {
  const to = useSelector(counterValueCurrencySelector);
  return useBalanceHistoryWithCountervalueCommon({ account, range, to });
}

export function usePortfolio() {
  const to = useSelector(counterValueCurrencySelector);
  const accounts = useSelector(accountsSelector);
  const range = useSelector(selectedTimeRangeSelector);
  return usePortfolioCommon({ accounts, range, to });
}

export function useCurrencyPortfolio({
  currency,
  range,
}: {
  currency: CryptoCurrency | TokenCurrency,
  range: PortfolioRange,
}) {
  const accounts = useSelector(accountsSelector);
  const to = useSelector(counterValueCurrencySelector);
  return useCurrencyPortfolioCommon({ accounts, range, to, currency });
}
