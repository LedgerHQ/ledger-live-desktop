// @flow
import {
  getBalanceHistoryWithCountervalue,
  getCurrencyPortfolio,
  getPortfolio,
} from '@ledgerhq/live-common/lib/portfolio'
import type {
  Account,
  CryptoCurrency,
  PortfolioRange,
  TokenCurrency,
} from '@ledgerhq/live-common/lib/types'
import { flattenAccounts, getAccountCurrency } from '@ledgerhq/live-common/lib/account'
import {
  exchangeSettingsForPairSelector,
  counterValueCurrencySelector,
  intermediaryCurrency,
} from 'reducers/settings'
import CounterValues from 'helpers/countervalues'
import type { State } from 'reducers'
import { accountsSelector } from 'reducers/accounts'

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
  const currency = getAccountCurrency(account)
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
  )
  const counterValueCurrency = counterValueCurrencySelector(state)
  return getCurrencyPortfolio(accounts, range, (currency, value, date) => {
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
