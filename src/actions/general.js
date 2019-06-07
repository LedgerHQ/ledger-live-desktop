// @flow

import { createSelector, createStructuredSelector } from 'reselect'
import CounterValues from 'helpers/countervalues'
import {
  intermediaryCurrency,
  exchangeSettingsForTickerSelector,
  getOrderAccounts,
} from 'reducers/settings'
import { accountsSelector } from 'reducers/accounts'
import { sortAccounts } from '@ledgerhq/live-common/lib/account'

const accountsBtcBalanceSelector = createSelector(
  accountsSelector,
  state => state,
  (accounts, state) =>
    accounts.map(account => {
      const currency = account.currency
      const exchange = exchangeSettingsForTickerSelector(state, { ticker: currency.ticker })
      return CounterValues.calculateSelector(state, {
        from: currency,
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
  dispatch({
    type: 'DB:REORDER_ACCOUNTS',
    payload: sortAccounts(all),
  })
}
