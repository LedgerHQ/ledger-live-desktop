// @flow

import type { Dispatch } from 'redux'
import { fetchHistodayRates } from '@ledgerhq/live-common/lib/api/countervalue'
import type { CryptoCurrency, Currency } from '@ledgerhq/live-common/lib/types'

import { counterValueCurrencySelector } from 'reducers/settings'
import { currenciesSelector } from 'reducers/accounts'
import db from 'helpers/db'
import type { State } from 'reducers'

export type InitCounterValues = () => { type: string, payload: Object }
export const initCounterValues: InitCounterValues = () => ({
  type: 'UPDATE_COUNTER_VALUES',
  payload: db.get('counterValues'),
})

export type UpdateCounterValues = Object => { type: string, payload: Object }
export const updateCounterValues: UpdateCounterValues = payload => ({
  type: 'DB:UPDATE_COUNTER_VALUES',
  payload,
})

function cryptoCurrenciesToCurrencies(currencies: CryptoCurrency[]): Currency[] {
  // $FlowFixMe this function is just to fix flow types. array contravariant issue.
  return currencies
}

export type FetchCounterValues = (
  currencies?: Currency[],
) => (Dispatch<*>, () => State) => Promise<any>

export const fetchCounterValues: FetchCounterValues = currencies => async (dispatch, getState) => {
  const state = getState()
  const currency = counterValueCurrencySelector(state)
  if (!currency) return
  if (!currencies) {
    // TODO this should be default, there is no need to provide the currencies in parameter
    currencies = cryptoCurrenciesToCurrencies(currenciesSelector(state))
  }
  const counterValues = await fetchHistodayRates(currencies, currency)
  dispatch(updateCounterValues(counterValues))
}
