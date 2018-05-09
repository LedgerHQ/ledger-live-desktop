// @flow

import CounterValues from 'helpers/countervalues'

import type { Currency } from '@ledgerhq/live-common/lib/types'
import type { State } from 'reducers'

// FIXME DEPRECATED approach. we will move to use calculateSelector everywhere.. it's just easier to process for now.

export const calculateCounterValueSelector = (state: State) => (
  from: Currency,
  to: Currency,
  exchange: string,
) => (value: number, date?: Date, disableRounding?: boolean): ?number =>
  CounterValues.calculateSelector(state, { from, to, exchange, value, date, disableRounding })

export const reverseCounterValueSelector = (state: State) => (
  from: Currency,
  to: Currency,
  exchange: string,
) => (value: number, date?: Date, disableRounding?: boolean): ?number =>
  CounterValues.reverseSelector(state, { from, to, exchange, value, date, disableRounding })
