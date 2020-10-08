// @flow
import { BigNumber } from "bignumber.js";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  getBalanceHistoryWithCountervalue,
  getCurrencyPortfolio,
  getPortfolio,
} from "@ledgerhq/live-common/lib/portfolio";
import type {
  CryptoCurrency,
  PortfolioRange,
  TokenCurrency,
  AccountLike,
} from "@ledgerhq/live-common/lib/types";
import { flattenAccounts, getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import { useCountervaluesState } from "@ledgerhq/live-common/lib/countervalues/react";
import { calculate } from "@ledgerhq/live-common/lib/countervalues/logic";
import { selectedTimeRangeSelector } from "~/renderer/reducers/settings";

import { counterValueCurrencySelector } from "./../reducers/settings";
import { accountsSelector } from "./../reducers/accounts";

export function useBalanceHistoryWithCountervalue({
  account,
  range,
}: {
  account: AccountLike,
  range: PortfolioRange,
}) {
  const from = getAccountCurrency(account);
  const to = useSelector(counterValueCurrencySelector);
  const state = useCountervaluesState();

  return useMemo(
    () =>
      getBalanceHistoryWithCountervalue(account, range, (_, value, date) => {
        const countervalue = calculate(state, {
          value: value.toNumber(),
          from,
          to,
          disableRounding: true,
          date,
        });

        return typeof countervalue === "number" ? BigNumber(countervalue) : countervalue;
      }),
    [account, from, to, range, state],
  );
}

export function usePortfolio() {
  const to = useSelector(counterValueCurrencySelector);
  const accounts = useSelector(accountsSelector);
  const range = useSelector(selectedTimeRangeSelector);
  const state = useCountervaluesState();

  return useMemo(
    () =>
      getPortfolio(accounts, range, (from, value, date) => {
        const countervalue = calculate(state, {
          value: value.toNumber(),
          from,
          to,
          disableRounding: true,
          date,
        });

        return typeof countervalue === "number" ? BigNumber(countervalue) : countervalue;
      }),
    [accounts, range, state, to],
  );
}

export function useCurrencyPortfolio({
  currency,
  range,
}: {
  currency: CryptoCurrency | TokenCurrency,
  range: PortfolioRange,
}) {
  const rawAccounts = useSelector(accountsSelector);
  const accounts = flattenAccounts(rawAccounts).filter(a => getAccountCurrency(a) === currency);
  const to = useSelector(counterValueCurrencySelector);
  const state = useCountervaluesState();

  return useMemo(
    () =>
      getCurrencyPortfolio(accounts, range, (from, value, date) => {
        const countervalue = calculate(state, {
          value: value.toNumber(),
          from,
          to,
          disableRounding: true,
          date,
        });

        return typeof countervalue === "number" ? BigNumber(countervalue) : countervalue;
      }),
    [accounts, range, state, to],
  );
}
