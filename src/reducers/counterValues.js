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
  UPDATE_LAST_COUNTER_VALUE: (
    state: CounterValuesState,
    { payload: { symbol, value } }: { payload: { symbol: string, value: number } },
  ): CounterValuesState => {
    // We update only last value (newer)
    if (state[symbol]) {
      const [date] = state[symbol].list[0]
      // [0] date, [1] value, only update value
      state[symbol].list[0][1] = value
      // Keep the same value for byDate object
      state[symbol].byDate[date] = value

      // Update reference for a proper update
      return { ...state }
    }

    return state
  },
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
