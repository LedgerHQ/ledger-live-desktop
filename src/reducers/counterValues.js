// @flow

import { handleActions } from 'redux-actions'
import merge from 'lodash/merge'
import get from 'lodash/get'
import {
  makeCalculateCounterValue,
  makeReverseCounterValue,
  formatCounterValueDay,
} from '@ledgerhq/live-common/lib/helpers/countervalue'

import type { CalculateCounterValue } from '@ledgerhq/live-common/lib/types'
import type { State } from 'reducers'

export type CounterValuesState = {}
const state: CounterValuesState = {}

const handlers = {
  UPDATE_COUNTER_VALUES: (state, { payload: counterValues }) => merge({ ...state }, counterValues),
}

const getPairHistory = state => (coinTicker, fiat) => {
  const byDate = get(state, `counterValues.${coinTicker}.${fiat}`)
  return date => {
    if (!byDate) {
      return 0
    }
    if (!date) {
      return byDate.latest || 0
    }
    return byDate[formatCounterValueDay(date)] || 0
  }
}

export const calculateCounterValueSelector = (state: State): CalculateCounterValue =>
  makeCalculateCounterValue(getPairHistory(state))

export const reverseCounterValueSelector = (state: State): CalculateCounterValue =>
  makeReverseCounterValue(getPairHistory(state))

export default handleActions(handlers, state)
