// @flow

import React from 'react'
import Raven from 'raven-js'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import createHistory from 'history/createHashHistory'

import createStore from 'renderer/createStore'
import events from 'renderer/events'

import { fetchAccounts } from 'actions/accounts'
import { fetchSettings } from 'actions/settings'
import { isLocked } from 'reducers/application'
import { getLanguage } from 'reducers/settings'

import App from 'components/App'

import 'styles/global'

if (__PROD__ && __SENTRY_URL__) {
  Raven.config(__SENTRY_URL__, { allowSecretKey: true }).install()
  window.addEventListener('unhandledrejection', event => Raven.captureException(event.reason))
}

const history = createHistory()
const store = createStore(history)
const rootNode = document.getElementById('app')

store.dispatch(fetchSettings())

const state = store.getState() || {}
const language = getLanguage(state)
const locked = isLocked(state)

if (!locked) {
  store.dispatch(fetchAccounts())
}

events({ store, locked })

function r(Comp) {
  if (rootNode) {
    render(<AppContainer>{Comp}</AppContainer>, rootNode)
  }
}

r(<App store={store} history={history} language={language} />)

if (module.hot) {
  module.hot.accept('../components/App', () => {
    const NewApp = require('../components/App').default // eslint-disable-line global-require
    r(<NewApp store={store} history={history} language={language} />)
  })
}
