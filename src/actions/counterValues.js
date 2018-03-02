// @flow

import axios from 'axios'
import moment from 'moment'
import { getDefaultUnitByCoinType } from '@ledgerhq/currencies'

import get from 'lodash/get'

import db from 'helpers/db'

type InitCounterValues = () => { type: string, payload: Object }
export const initCounterValues: InitCounterValues = () => ({
  type: 'UPDATE_COUNTER_VALUES',
  payload: db.get('counterValues'),
})

type UpdateCounterValues = Object => { type: string, payload: Object }
export const updateCounterValues: UpdateCounterValues = payload => ({
  type: 'DB:UPDATE_COUNTER_VALUES',
  payload,
})

type FetchCounterValues = (?number) => (Dispatch<*>, Function) => void
export const fetchCounterValues: FetchCounterValues = coinType => (dispatch, getState) => {
  const { accounts, counterValues } = getState()

  let coinTypes = []

  if (!coinType) {
    coinTypes = [...new Set(accounts.map(a => a.coinType))]
  } else {
    coinTypes = [coinType]
  }

  const today = moment().format('YYYY-MM-DD')

  const fetchCounterValuesByCoinType = coinType => {
    const { code } = getDefaultUnitByCoinType(coinType)
    const todayCounterValues = get(counterValues, `${code}-USD.${today}`, null)

    if (todayCounterValues !== null) {
      return {}
    }

    return axios
      .get(
        `https://min-api.cryptocompare.com/data/histoday?&extraParams=ledger-test&fsym=${code}&tsym=USD&allData=1`,
      )
      .then(({ data }) => ({
        symbol: `${code}-USD`,
        values: data.Data.reduce((result, d) => {
          const date = moment(d.time * 1000).format('YYYY-MM-DD')
          result[date] = d.close
          return result
        }, {}),
      }))
  }

  Promise.all(coinTypes.map(fetchCounterValuesByCoinType)).then(result => {
    const newCounterValues = result.reduce((r, v) => {
      r[v.symbol] = v.values
      return r
    }, {})
    dispatch(updateCounterValues(newCounterValues))
  })
}
