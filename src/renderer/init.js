// @flow

import React from 'react'
import { remote } from 'electron'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import createHistory from 'history/createHashHistory'

import createStore from 'renderer/createStore'
import events from 'renderer/events'

import { fetchAccounts } from 'actions/accounts'
import { fetchSettings } from 'actions/settings'
import { initCounterValues, fetchCounterValues } from 'actions/counterValues'
import { isLocked } from 'reducers/application'
import { getLanguage } from 'reducers/settings'

import db from 'helpers/db'

import App from 'components/App'

import 'styles/global'

// Init db with defaults if needed
db.init('settings', {})
db.init('counterValues', {})

const history = createHistory()
const store = createStore(history)
const rootNode = document.getElementById('app')

store.dispatch(fetchSettings())
store.dispatch(initCounterValues())

const state = store.getState() || {}
const language = getLanguage(state)
const locked = isLocked(state)

if (!locked) {
  // Init accounts with defaults if needed
  db.init('accounts', [])

  store.dispatch(fetchAccounts())
  store.dispatch(fetchCounterValues())
}

function r(Comp) {
  if (rootNode) {
    render(<AppContainer>{Comp}</AppContainer>, rootNode)
  }
}

r(<App store={store} history={history} language={language} />)

// Only init events on MainWindow
if (remote.getCurrentWindow().name === 'MainWindow') {
  events({ store, locked })
}

if (module.hot) {
  module.hot.accept('../components/App', () => {
    const NewApp = require('../components/App').default
    r(<NewApp store={store} history={history} language={language} />)
  })
}
