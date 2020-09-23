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
import CounterValues from "../countervalues";

import {
  exchangeSettingsForPairSelector,
  counterValueCurrencySelector,
  intermediaryCurrency,
} from "./../reducers/settings";
import { accountsSelector } from "./../reducers/accounts";
import type { State } from "./../reducers";

export const balanceHistoryWithCountervalueSelector = (
  state: State,
  {
    account,
    range,
  }: {
    account: AccountLike,
    range: PortfolioRange,
  },
) => {
  const counterValueCurrency = counterValueCurrencySelector(state);
  const currency = getAccountCurrency(account);
  const intermediary = intermediaryCurrency(currency, counterValueCurrency);
  const exchange = exchangeSettingsForPairSelector(state, { from: currency, to: intermediary });
  const toExchange = exchangeSettingsForPairSelector(state, {
    from: intermediary,
    to: counterValueCurrency,
  });
  return getBalanceHistoryWithCountervalue(account, range, (_, value, date) =>
    CounterValues.calculateWithIntermediarySelector(state, {
      value,
      date,
      from: currency,
      fromExchange: exchange,
      intermediary,
      toExchange,
      to: counterValueCurrency,
    }),
  );
};

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
          value,
          from,
          to,
          disableRounding: true,
          date,
        });

        return typeof countervalue !== "undefined" ? BigNumber(countervalue) : countervalue;
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
          value,
          from,
          to,
          disableRounding: true,
          date,
        });

        return typeof countervalue !== "undefined" ? BigNumber(countervalue) : countervalue;
      }),
    [accounts, range, state, to],
  );
}

export const currencyPortfolioSelector = (
  state: State,
  {
    currency,
    range,
  }: {
    currency: CryptoCurrency | TokenCurrency,
    range: PortfolioRange,
  },
) => {
  const accounts = flattenAccounts(accountsSelector(state)).filter(
    a => getAccountCurrency(a) === currency,
  );
  const counterValueCurrency = counterValueCurrencySelector(state);
  return getCurrencyPortfolio(accounts, range, (currency, value, date) => {
    const intermediary = intermediaryCurrency(currency, counterValueCurrency);
    const toExchange = exchangeSettingsForPairSelector(state, {
      from: intermediary,
      to: counterValueCurrency,
    });
    return CounterValues.calculateWithIntermediarySelector(state, {
      value,
      date,
      from: currency,
      fromExchange: exchangeSettingsForPairSelector(state, { from: currency, to: intermediary }),
      intermediary,
      toExchange,
      to: counterValueCurrency,
    });
  });
};
