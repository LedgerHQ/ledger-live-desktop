// @flow

import { handleActions } from 'redux-actions'

export type CounterValuesState = {
  [string]: {
    byDate: Object,
    list: Array<[string, number]>,
  },
}

const state: CounterValuesState = {}

const handlers = {
  UPDATE_COUNTER_VALUES: (
    state: CounterValuesState,
    { payload: counterValues }: { payload: CounterValuesState },
  ): CounterValuesState => ({
    ...state,
    ...counterValues,
  }),
}

export function getLastCounterValueBySymbol(
  symbol: string,
  state: { counterValues: CounterValuesState },
): number {
  return state.counterValues[symbol].list[0][1]
}

export function serializeCounterValues(counterValues: Object) {
  return Object.keys(counterValues).reduce((result, key) => {
    const counterValue = counterValues[key].sort(([dateA], [dateB]) => (dateA < dateB ? 1 : -1))

    result[key] = {
      byDate: counterValue.reduce((r, [date, value]) => {
        r[date] = value
        return r
      }, {}),
      list: counterValue,
    }

    return result
  }, {})
}

export function deserializeCounterValues(counterValues: Object) {
  return Object.keys(counterValues).reduce((result, key) => {
    const counterValue = counterValues[key]
    result[key] = counterValue.list
    return result
  }, {})
}

export default handleActions(handlers, state)
