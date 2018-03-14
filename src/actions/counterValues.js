// @flow

import axios from 'axios'
import moment from 'moment'
import { getDefaultUnitByCoinType } from '@ledgerhq/currencies'

import type { Dispatch } from 'redux'

import { serializeCounterValues } from 'reducers/counterValues'

import get from 'lodash/get'

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

export type UpdateLastCounterValueBySymbol = (string, Object) => { type: string, payload: Object }
export const updateLastCounterValueBySymbol: UpdateLastCounterValueBySymbol = (symbol, value) => ({
  type: 'DB:UPDATE_LAST_COUNTER_VALUE',
  payload: {
    symbol,
    value,
  },
})

export type FetchCounterValues = (?number) => (Dispatch<*>, Function) => Promise<any>
export const fetchCounterValues: FetchCounterValues = coinType => (dispatch, getState) => {
  const { accounts, counterValues, settings } = getState()
  const { counterValue } = settings

  let coinTypes = []

  if (!coinType) {
    coinTypes = [...new Set(accounts.map(a => a.coinType))]
  } else {
    coinTypes = [coinType]
  }

  const today = moment().format('YYYY-MM-DD')

  const fetchCounterValuesByCoinType = coinType => {
    const { code } = getDefaultUnitByCoinType(coinType)
    const todayCounterValues = get(counterValues, `${code}-${counterValue}.${today}`, null)

    if (todayCounterValues !== null) {
      return null
    }

    return axios
      .get(
        `https://min-api.cryptocompare.com/data/histoday?&extraParams=ledger-test&fsym=${code}&tsym=${counterValue}&allData=1`,
      )
      .then(({ data }) => ({
        symbol: `${code}-${counterValue}`,
        values: data.Data.map(d => [moment(d.time * 1000).format('YYYY-MM-DD'), d.close]),
      }))
  }

  return Promise.all(coinTypes.map(fetchCounterValuesByCoinType)).then(results => {
    const newCounterValues = serializeCounterValues(
      results.reduce((r, v) => {
        if (v !== null) {
          r[v.symbol] = v.values
        }
        return r
      }, {}),
    )

    if (Object.keys(newCounterValues).length !== 0) {
      dispatch(updateCounterValues(newCounterValues))
    }
  })
}
