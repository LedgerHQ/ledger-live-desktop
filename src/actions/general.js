// @flow

import type { BigNumber } from 'bignumber.js'
import type { State } from 'reducers'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { createSelector } from 'reselect'
import CounterValues from 'helpers/countervalues'
import {
  intermediaryCurrency,
  exchangeSettingsForTickerSelector,
  getOrderAccounts,
  counterValueCurrencySelector,
  counterValueExchangeSelector,
} from 'reducers/settings'
import { accountsSelector } from 'reducers/accounts'
import {
  nestedSortAccounts,
  flattenSortAccounts,
  sortAccountsComparatorFromOrder,
} from '@ledgerhq/live-common/lib/account'

export const calculateCountervalueSelector = (state: State) => {
  const counterValueCurrency = counterValueCurrencySelector(state)
  const toExchange = counterValueExchangeSelector(state)
  return (currency: Currency, value: BigNumber): ?BigNumber => {
    const fromExchange = exchangeSettingsForTickerSelector(state, { ticker: currency.ticker })
    return CounterValues.calculateWithIntermediarySelector(state, {
      from: currency,
      fromExchange,
      intermediary: intermediaryCurrency,
      toExchange,
      to: counterValueCurrency,
      value,
      disableRounding: true,
    })
  }
}

export const sortAccountsComparatorSelector = createSelector(
  getOrderAccounts,
  calculateCountervalueSelector,
  sortAccountsComparatorFromOrder,
)

const nestedSortAccountsSelector = createSelector(
  accountsSelector,
  sortAccountsComparatorSelector,
  nestedSortAccounts,
)

export const flattenSortAccountsSelector = createSelector(
  accountsSelector,
  sortAccountsComparatorSelector,
  flattenSortAccounts,
)

export const refreshAccountsOrdering = () => (dispatch: *, getState: *) => {
  dispatch({
    type: 'DB:SET_ACCOUNTS',
    payload: nestedSortAccountsSelector(getState()),
  })
}
