// @flow

import { createSelector } from 'reselect'
import createCounterValues from '@ledgerhq/live-common/lib/countervalues'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import { makeLRUCache } from '@ledgerhq/live-common/lib/cache'
import uniq from 'lodash/uniq'
import { LEDGER_COUNTERVALUES_API } from 'config/constants'
import { listCryptoCurrencies } from 'config/cryptocurrencies'
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

// $FlowFixMe
const CounterValues = createCounterValues({
  log: (...args) => logger.log('CounterValues:', ...args),
  getAPIBaseURL: () => LEDGER_COUNTERVALUES_API,
  storeSelector: state => state.countervalues,
  pairsSelector,
  setExchangePairsAction,
  addExtraPollingHooks,
  network,
})

let sortCache
export const getFullListSortedCryptoCurrencies: (
  withDevCrypto?: boolean,
  onlyTerminated?: boolean,
  onlySupported?: boolean,
) => Promise<CryptoCurrency[]> = makeLRUCache(
  (withDevCrypto = false, onlyTerminated = false, onlySupported = false) => {
    if (!sortCache) {
      sortCache = CounterValues.fetchTickersByMarketcap().then(
        tickers => {
          const list = listCryptoCurrencies(withDevCrypto, onlyTerminated, onlySupported).slice(0)
          const prependList = []
          tickers.forEach(ticker => {
            const item = list.find(c => c.ticker === ticker)
            if (item) {
              list.splice(list.indexOf(item), 1)
              prependList.push(item)
            }
          })
          return prependList.concat(list)
        },
        () => {
          sortCache = null // reset the cache for the next time it comes here to "try again"
          return listCryptoCurrencies() // fallback on default sort
        },
      )
    }

    return sortCache
  },
  (withDevCrypto, onlyTerminated, onlySupported) =>
    `${withDevCrypto ? '1' : '0'}_${onlyTerminated ? '1' : '0'}_${onlySupported ? '1' : '0'}`,
)

export default CounterValues
