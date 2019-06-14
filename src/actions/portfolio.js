// @flow
import {
  getBalanceHistory,
  getBalanceHistoryWithCountervalue,
  getPortfolio,
} from '@ledgerhq/live-common/lib/portfolio'
import type { Account, PortfolioRange } from '@ledgerhq/live-common/lib/types'
import {
  exchangeSettingsForPairSelector,
  counterValueCurrencySelector,
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
  const currency = account.type === 'Account' ? account.currency : account.token
  const intermediary = intermediaryCurrency(currency, counterValueCurrency)
  const exchange = exchangeSettingsForPairSelector(state, { from: currency, to: intermediary })
  const toExchange = exchangeSettingsForPairSelector(state, {
    from: intermediary,
    to: counterValueCurrency,
  })
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
  return getPortfolio(accounts, range, (currency, value, date) => {
    const intermediary = intermediaryCurrency(currency, counterValueCurrency)
    const toExchange = exchangeSettingsForPairSelector(state, {
      from: intermediary,
      to: counterValueCurrency,
    })
    return CounterValues.calculateWithIntermediarySelector(state, {
      value,
      date,
      from: currency,
      fromExchange: exchangeSettingsForPairSelector(state, { from: currency, to: intermediary }),
      intermediary,
      toExchange,
      to: counterValueCurrency,
    })
  })
}
