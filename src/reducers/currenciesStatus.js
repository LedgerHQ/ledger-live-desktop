// @flow

import { handleActions, createAction } from 'redux-actions'
import { createSelector } from 'reselect'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'

import network from 'api/network'
import { urls } from 'config/urls'
import logger from 'logger'

import type { State } from './index'

export type CurrencyStatus = {
  id: string, // the currency id
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
    if (Array.isArray(data)) {
      dispatch(setCurrenciesStatus(data))
    }
  } catch (err) {
    logger.error(err)
  }
}

// Selectors

export const currenciesStatusSelector = (state: State) => state.currenciesStatus

// if there is a status, it means that currency is disrupted, the status is returned.
export const currencyDownStatusLocal = (
  currenciesStatus: CurrenciesStatusState,
  currency: CryptoCurrency,
): ?CurrencyStatus => currenciesStatus.find(c => c.id === currency.id)

export const currencyDownStatus = createSelector(
  currenciesStatusSelector,
  (_, { currency }) => currency,
  currencyDownStatusLocal,
)

// Exporting reducer

export default handleActions(handlers, state)
