// @flow

import { createSelector } from 'reselect'
import createCounterValues from '@ledgerhq/live-common/lib/countervalues'
import { setExchangePairsAction } from 'actions/settings'
import { currenciesSelector } from 'reducers/accounts'
import {
  counterValueCurrencySelector,
  counterValueExchangeSelector,
  currencySettingsSelector,
  intermediaryCurrency,
} from 'reducers/settings'

const pairsSelector = createSelector(
  currenciesSelector,
  counterValueCurrencySelector,
  counterValueExchangeSelector,
  state => state,
  (currencies, counterValueCurrency, counterValueExchange, state) =>
    [
      { from: intermediaryCurrency, to: counterValueCurrency, exchange: counterValueExchange },
    ].concat(
      currencies.filter(c => c !== intermediaryCurrency).map(currency => ({
        from: currency,
        to: intermediaryCurrency,
        exchange: currencySettingsSelector(state, { currency }).exchange,
      })),
    ),
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

const CounterValues = createCounterValues({
  log: (...args) => console.log('CounterValues:', ...args), // eslint-disable-line no-console
  getAPIBaseURL: () => 'https://ledger-countervalue-poc.herokuapp.com',
  storeSelector: state => state.countervalues,
  pairsSelector,
  setExchangePairsAction,
  addExtraPollingHooks,
})

export default CounterValues
