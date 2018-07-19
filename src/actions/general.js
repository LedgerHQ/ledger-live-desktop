// @flow

import { createSelector, createStructuredSelector } from 'reselect'
import CounterValues from 'helpers/countervalues'
import {
  intermediaryCurrency,
  currencySettingsForAccountSelector,
  getOrderAccounts,
} from 'reducers/settings'
import { accountsSelector } from 'reducers/accounts'
import { sortAccounts } from 'helpers/accountOrdering'

const accountsBtcBalanceSelector = createSelector(
  accountsSelector,
  state => state,
  (accounts, state) =>
    accounts.map(account => {
      const { exchange } = currencySettingsForAccountSelector(state, { account })
      return CounterValues.calculateSelector(state, {
        from: account.currency,
        to: intermediaryCurrency,
        exchange,
        value: account.balance,
      })
    }),
)

const selectAccountsBalanceAndOrder = createStructuredSelector({
  accounts: accountsSelector,
  accountsBtcBalance: accountsBtcBalanceSelector,
  orderAccounts: getOrderAccounts,
})

export const refreshAccountsOrdering = () => (dispatch: *, getState: *) => {
  const all = selectAccountsBalanceAndOrder(getState())
  const allRatesAvailable = all.accountsBtcBalance.every(b => typeof b === 'number')
  if (allRatesAvailable) {
    dispatch({
      type: 'DB:REORDER_ACCOUNTS',
      payload: sortAccounts(all),
    })
  }
}
