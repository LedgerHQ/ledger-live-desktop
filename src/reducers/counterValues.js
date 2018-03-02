// @flow

import { handleActions } from 'redux-actions'

export type CounterValuesState = {}

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

export default handleActions(handlers, state)
