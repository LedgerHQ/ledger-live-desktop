// @flow

import { handleActions, createAction } from 'redux-actions'

export type CounterValuesState = {}

const state: CounterValuesState = {}

const handlers = {
  SET_COUNTER_VALUES: (
    state: CounterValuesState,
    { payload: counterValues }: { payload: CounterValuesState },
  ): CounterValuesState => counterValues,
}

// Actions

export const setCounterValues = createAction('SET_COUNTER_VALUES', counterValues => counterValues)

// Selectors

// Exporting reducer

export default handleActions(handlers, state)
