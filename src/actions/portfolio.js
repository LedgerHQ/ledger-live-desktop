// @flow
import {
  getBalanceHistory,
  getBalanceHistoryWithCountervalue,
  getPortfolio,
} from '@ledgerhq/live-common/lib/portfolio'
import type { Account, PortfolioRange } from '@ledgerhq/live-common/lib/types'
import {
  exchangeSettingsForAccountSelector,
  counterValueCurrencySelector,
  counterValueExchangeSelector,
  intermediaryCurrency,
} from 'reducers/settings'
import CounterValues from 'helpers/countervalues'
import type { State } from 'reducers'

export const balanceHistorySelector = (
  state: State,
  {
    account,
    range,
  }: {
    account: Account,
    range: PortfolioRange,
  },
) => getBalanceHistory(account, range)

export const balanceHistoryWithCountervalueSelector = (
  state: State,
  {
    account,
    range,
  }: {
    account: Account,
    range: PortfolioRange,
  },
) => {
  const counterValueCurrency = counterValueCurrencySelector(state)
  const counterValueExchange = counterValueExchangeSelector(state)
  const accountExchange = exchangeSettingsForAccountSelector(state, { account })
  return getBalanceHistoryWithCountervalue(account, range, (_, value, date) =>
    CounterValues.calculateWithIntermediarySelector(state, {
      value,
      date,
      from: account.currency,
      fromExchange: accountExchange,
      intermediary: intermediaryCurrency,
      toExchange: counterValueExchange,
      to: counterValueCurrency,
    }),
  )
}

export const portfolioSelector = (
  state: State,
  {
    accounts,
    range,
  }: {
    accounts: Account[],
    range: PortfolioRange,
  },
) => {
  const counterValueCurrency = counterValueCurrencySelector(state)
  const counterValueExchange = counterValueExchangeSelector(state)
  return getPortfolio(accounts, range, (account, value, date) =>
    CounterValues.calculateWithIntermediarySelector(state, {
      value,
      date,
      from: account.currency,
      fromExchange: exchangeSettingsForAccountSelector(state, { account }),
      intermediary: intermediaryCurrency,
      toExchange: counterValueExchange,
      to: counterValueCurrency,
    }),
  )
}
