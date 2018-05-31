// @flow

import React from 'react'
import { remote } from 'electron'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import createHistory from 'history/createHashHistory'
import moment from 'moment'
import { delay } from 'helpers/promise'

import createStore from 'renderer/createStore'
import events from 'renderer/events'

import { fetchAccounts } from 'actions/accounts'
import { fetchSettings } from 'actions/settings'
import { isLocked } from 'reducers/application'
import { getLanguage } from 'reducers/settings'
import libcoreGetVersion from 'commands/libcoreGetVersion'

import db from 'helpers/db'
import dbMiddleware from 'middlewares/db'
import CounterValues from 'helpers/countervalues'

import App from 'components/App'

import 'styles/global'

if (process.env.LEDGER_RESET_ALL) {
  db.resetAll()
}

// Init db with defaults if needed
db.init('settings', {})

const history = createHistory()
const store = createStore({ history, dbMiddleware })
const rootNode = document.getElementById('app')

const settings = db.get('settings')
if (Object.keys(settings).length !== 0) {
  store.dispatch(fetchSettings(settings))
}

const countervaluesData = db.get('countervalues')
if (countervaluesData) {
  store.dispatch(CounterValues.importAction(countervaluesData))
}

const state = store.getState()
const language = getLanguage(state)
const locked = isLocked(state)

moment.locale(language)

function r(Comp) {
  if (rootNode) {
    render(<AppContainer>{Comp}</AppContainer>, rootNode)
  }
}

async function init() {
  // FIXME IMO init() really should only be for window. any other case is a hack!
  const isMainWindow = remote.getCurrentWindow().name === 'MainWindow'

  if (!locked) {
    // Init accounts with defaults if needed
    db.init('accounts', [])

    await store.dispatch(fetchAccounts())
  }

  r(<App store={store} history={history} language={language} />)

  // Only init events on MainWindow
  if (isMainWindow) {
    events({ store, locked })

    const libcoreVersion = await Promise.race([
      libcoreGetVersion.send().toPromise(),
      delay(10000).then(() => Promise.reject(new Error("timeout: can't load libcore"))),
    ])
    console.log('libcore', libcoreVersion)
  }
}

init().catch(e => {
  // for now we make the app crash instead of pending forever. later we can render the error OR try to recover, but probably this is unrecoverable cases.
  console.error(e)
  process.exit(1)
})
