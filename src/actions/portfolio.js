// @flow
import {
  getBalanceHistory,
  getBalanceHistoryWithCountervalue,
  getPortfolio,
} from '@ledgerhq/live-common/lib/portfolio'
import type { Account, PortfolioRange } from '@ledgerhq/live-common/lib/types'
import {
  exchangeSettingsForTickerSelector,
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
  const currency = account.type === 'Account' ? account.currency : account.token
  const exchange = exchangeSettingsForTickerSelector(state, { ticker: currency.ticker })
  return getBalanceHistoryWithCountervalue(account, range, (_, value, date) =>
    CounterValues.calculateWithIntermediarySelector(state, {
      value,
      date,
      from: currency,
      fromExchange: exchange,
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
  return getPortfolio(accounts, range, (currency, value, date) =>
    CounterValues.calculateWithIntermediarySelector(state, {
      value,
      date,
      from: currency,
      fromExchange: exchangeSettingsForTickerSelector(state, { ticker: currency.ticker }),
      intermediary: intermediaryCurrency,
      toExchange: counterValueExchange,
      to: counterValueCurrency,
    }),
  )
}
