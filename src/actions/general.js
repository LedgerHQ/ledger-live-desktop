// @flow

import type { BigNumber } from 'bignumber.js'
import type { State } from 'reducers'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { createSelector } from 'reselect'
import CounterValues from 'helpers/countervalues'
import {
  intermediaryCurrency,
  exchangeSettingsForPairSelector,
  getOrderAccounts,
  counterValueCurrencySelector,
} from 'reducers/settings'
import { accountsSelector } from 'reducers/accounts'
import {
  nestedSortAccounts,
  flattenSortAccounts,
  sortAccountsComparatorFromOrder,
} from '@ledgerhq/live-common/lib/account'

export const calculateCountervalueSelector = (state: State) => {
  const counterValueCurrency = counterValueCurrencySelector(state)
  return (currency: Currency, value: BigNumber): ?BigNumber => {
    const intermediary = intermediaryCurrency(currency, counterValueCurrency)
    const fromExchange = exchangeSettingsForPairSelector(state, {
      from: currency,
      to: intermediary,
    })
    const toExchange = exchangeSettingsForPairSelector(state, {
      from: intermediary,
      to: counterValueCurrency,
    })
    return CounterValues.calculateWithIntermediarySelector(state, {
      from: currency,
      fromExchange,
      intermediary,
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

export const flattenSortAccountsEnforceHideEmptyTokenSelector = createSelector(
  accountsSelector,
  sortAccountsComparatorSelector,
  (accounts, comparator) =>
    flattenSortAccounts(accounts, comparator, { enforceHideEmptySubAccounts: true }),
)

export const refreshAccountsOrdering = () => (dispatch: *, getState: *) => {
  dispatch({
    type: 'DB:SET_ACCOUNTS',
    payload: nestedSortAccountsSelector(getState()),
  })
}
