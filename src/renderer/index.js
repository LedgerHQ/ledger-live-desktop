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

import App from 'components/App'

import 'styles/global'

if (__PROD__ && __SENTRY_URL__) {
  Raven.config(__SENTRY_URL__).install()
  window.addEventListener('unhandledrejection', event => Raven.captureException(event.reason))
}

const history = createHistory()
const store = createStore(history)
const rootNode = document.getElementById('app')

store.dispatch(fetchSettings())

const state = store.getState() || {}

if (!isLocked(state)) {
  store.dispatch(fetchAccounts())
}

events(store)

function r(Comp) {
  if (rootNode) {
    render(<AppContainer>{Comp}</AppContainer>, rootNode)
  }
}

r(<App store={store} history={history} />)

if (module.hot) {
  module.hot.accept('../components/App', () => {
    const NewApp = require('../components/App').default // eslint-disable-line global-require
    r(<NewApp store={store} history={history} />)
  })
}
