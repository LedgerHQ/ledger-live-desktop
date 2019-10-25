// @flow

import { createSelector } from 'reselect'
import { getEnv } from '@ledgerhq/live-common/lib/env'
import { implementCountervalues, getCountervalues } from '@ledgerhq/live-common/lib/countervalues'
import uniq from 'lodash/uniq'
import { setExchangePairsAction } from 'actions/settings'
import { currenciesSelector } from 'reducers/accounts'
import {
  counterValueCurrencySelector,
  exchangeSettingsForPairSelector,
  intermediaryCurrency,
} from 'reducers/settings'
import logger from 'logger'
import network from '../api/network'

export const pairsSelector = createSelector(
  currenciesSelector,
  counterValueCurrencySelector,
  state => state,
  (currencies, counterValueCurrency, state) => {
    if (currencies.length === 0) return []
    const intermediaries = uniq(
      currencies.map(c => intermediaryCurrency(c, counterValueCurrency)),
    ).filter(c => c !== counterValueCurrency)
    return intermediaries
      .map(from => ({
        from,
        to: counterValueCurrency,
        exchange: exchangeSettingsForPairSelector(state, { from, to: counterValueCurrency }),
      }))
      .concat(
        currencies
          .map(from => {
            if (intermediaries.includes(from) || from.disableCountervalue) return null
            const to = intermediaryCurrency(from, counterValueCurrency)
            if (from === to) return null
            const exchange = exchangeSettingsForPairSelector(state, { from, to })
            return { from, to, exchange }
          })
          .filter(p => p),
      )
  },
)

const addExtraPollingHooks = (schedulePoll, cancelPoll) => {
  // TODO hook to net info of Electron ? retrieving network should trigger a poll

  // provide a basic mecanism to stop polling when you leave the tab
  // & immediately poll when you come back.
  function onWindowBlur() {
    cancelPoll()
  }
  function onWindowFocus() {
    schedulePoll(1000)
  }
  window.addEventListener('blur', onWindowBlur)
  window.addEventListener('focus', onWindowFocus)

  return () => {
    window.removeEventListener('blur', onWindowBlur)
    window.removeEventListener('focus', onWindowFocus)
  }
}

implementCountervalues({
  log: (...args) => logger.log('CounterValues:', ...args),
  getAPIBaseURL: () => getEnv('LEDGER_COUNTERVALUES_API'),
  storeSelector: state => state.countervalues,
  pairsSelector,
  setExchangePairsAction,
  addExtraPollingHooks,
  network,
})

const CounterValues = getCountervalues()

export default CounterValues
