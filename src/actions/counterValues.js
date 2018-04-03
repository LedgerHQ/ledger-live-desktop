// @flow

import { getFiatUnit } from '@ledgerhq/currencies'
import { fetchHistodayRates } from '@ledgerhq/wallet-common/lib/api/countervalue'

import type { Currency } from '@ledgerhq/currencies'
import type { Dispatch } from 'redux'

import db from 'helpers/db'

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

export type FetchCounterValues = (?(Currency[])) => (Dispatch<*>, Function) => Promise<any>
export const fetchCounterValues: FetchCounterValues = (currencies: ?(Currency[])) => async (
  dispatch,
  getState,
) => {
  const { accounts, settings } = getState()
  if (!currencies) {
    currencies = accounts.map(a => a.currency)
  }

  const { counterValue } = settings
  const fiatUnit = getFiatUnit(counterValue)
  const counterValues = await fetchHistodayRates(currencies, fiatUnit)
  dispatch(updateCounterValues(counterValues))
}
