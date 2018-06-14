// @flow

import logger from 'logger'
import React from 'react'
import { remote, webFrame } from 'electron'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import createHistory from 'history/createHashHistory'
import moment from 'moment'

import createStore from 'renderer/createStore'
import events from 'renderer/events'

import { enableGlobalTab, isGlobalTabEnabled } from 'config/global-tab'

import { fetchAccounts } from 'actions/accounts'
import { fetchSettings } from 'actions/settings'
import { isLocked } from 'reducers/application'
import { getLanguage, sentryLogsBooleanSelector } from 'reducers/settings'
import libcoreGetVersion from 'commands/libcoreGetVersion'

import db from 'helpers/db'
import dbMiddleware from 'middlewares/db'
import CounterValues from 'helpers/countervalues'
import hardReset from 'helpers/hardReset'

import sentry from 'sentry/browser'
import App from 'components/App'

import 'styles/global'

const rootNode = document.getElementById('app')

const TAB_KEY = 9

async function init() {
  if (process.env.LEDGER_RESET_ALL) {
    await hardReset()
  }

  // Init db with defaults if needed
  db.init('settings', {})

  const history = createHistory()
  const store = createStore({ history, dbMiddleware })

  const settings = db.get('settings')
  store.dispatch(fetchSettings(settings))

  const countervaluesData = db.get('countervalues')
  if (countervaluesData) {
    store.dispatch(CounterValues.importAction(countervaluesData))
  }

  const state = store.getState()
  const language = getLanguage(state)
  moment.locale(language)

  sentry(() => sentryLogsBooleanSelector(store.getState()))

  // FIXME IMO init() really should only be for window. any other case is a hack!
  const isMainWindow = remote.getCurrentWindow().name === 'MainWindow'

  if (!isLocked(store.getState())) {
    await store.dispatch(fetchAccounts())
  }

  r(<App store={store} history={history} language={language} />)

  // Only init events on MainWindow
  if (isMainWindow) {
    webFrame.setVisualZoomLevelLimits(1, 1)

    events({ store })

    const libcoreVersion = await libcoreGetVersion.send().toPromise()
    logger.log('libcore', libcoreVersion)

    window.addEventListener('keydown', (e: SyntheticKeyboardEvent<any>) => {
      if (e.which === TAB_KEY) {
        if (!isGlobalTabEnabled()) enableGlobalTab()
        logger.onTabKey(document.activeElement)
      }
    })
  }
}

function r(Comp) {
  if (rootNode) {
    render(<AppContainer>{Comp}</AppContainer>, rootNode)
  }
}

init().catch(e => {
  // for now we make the app crash instead of pending forever. later we can render the error OR try to recover, but probably this is unrecoverable cases.
  logger.error(e)
  process.exit(1)
})
