// @flow

import { handleActions, createAction } from 'redux-actions'
import type { Currency } from '@ledgerhq/live-common/lib/types'

import network from 'api/network'
import { urls } from 'config/urls'
import logger from 'logger'

import type { State } from './index'

export type CurrencyStatus = {
  id: string, // the currency id
  status: 'KO' | 'OK',
  message: string,
  link: string,
  nonce: number,
}

export type CurrenciesStatusState = CurrencyStatus[]

const state: CurrenciesStatusState = []

const handlers = {
  CURRENCIES_STATUS_SET: (
    state: CurrenciesStatusState,
    { payload }: { payload: CurrenciesStatusState },
  ) => payload,
}

// Actions

const setCurrenciesStatus = createAction('CURRENCIES_STATUS_SET')
export const fetchCurrenciesStatus = () => async (dispatch: *) => {
  try {
    const { data } = await network({
      method: 'GET',
      url: process.env.LL_STATUS_ENDPOINT || urls.currenciesStatus,
    })
    dispatch(setCurrenciesStatus(data))
  } catch (err) {
    logger.error(err)
  }
}

// Selectors

export const currenciesStatusSelector = (state: State) => state.currenciesStatus

// It's not a *real* selector, but it's better than having this logic inside component
export const getIsCurrencyDown = (currenciesStatus: CurrenciesStatusState, currency: Currency) => {
  const item = currenciesStatus.find(c => c.id === currency.id)
  return !!item && item.status === 'KO'
}

// Exporting reducer

export default handleActions(handlers, state)
