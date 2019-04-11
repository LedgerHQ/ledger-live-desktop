// @flow

import 'helpers/live-common-setup'
import 'helpers/experimental'

import logger from 'logger'
import LoggerTransport from 'logger/logger-transport-renderer'
import React from 'react'
import { remote, webFrame } from 'electron'
import { render } from 'react-dom'
import createHistory from 'history/createHashHistory'
import moment from 'moment'
import { runMigrations } from 'migrations'

import createStore from 'renderer/createStore'
import events from 'renderer/events'

import { enableGlobalTab, disableGlobalTab, isGlobalTabEnabled } from 'config/global-tab'

import { fetchAccounts } from 'actions/accounts'
import { fetchSettings } from 'actions/settings'
import { lock } from 'reducers/application'
import { languageSelector, sentryLogsSelector } from 'reducers/settings'
import { commandsById } from 'commands'
import libcoreGetVersion from 'commands/libcoreGetVersion'

import resolveUserDataDirectory from 'helpers/resolveUserDataDirectory'
import db from 'helpers/db'
import dbMiddleware from 'middlewares/db'
import CounterValues from 'helpers/countervalues'

import { decodeAccountsModel, encodeAccountsModel } from 'reducers/accounts'

import sentry from 'sentry/browser'
import App from 'components/App'
import AppError from 'components/AppError'

import 'styles/global'

logger.add(new LoggerTransport())

const rootNode = document.getElementById('app')
const userDataDirectory = resolveUserDataDirectory()

const TAB_KEY = 9

db.init(userDataDirectory)

async function init() {
  await runMigrations()
  db.init(userDataDirectory)
  db.registerTransform('app', 'accounts', { get: decodeAccountsModel, set: encodeAccountsModel })

  const history = createHistory()
  const store = createStore({ history, dbMiddleware })

  const settings = await db.getKey('app', 'settings')
  store.dispatch(fetchSettings(settings))

  const countervaluesData = await db.getKey('app', 'countervalues')
  if (countervaluesData) {
    store.dispatch(CounterValues.importAction(countervaluesData))
  }

  const state = store.getState()
  const language = languageSelector(state)
  moment.locale(language)

  sentry(() => sentryLogsSelector(store.getState()))

  // FIXME IMO init() really should only be for window. any other case is a hack!
  const isMainWindow = remote.getCurrentWindow().name === 'MainWindow'

  const isAccountsDecrypted = await db.hasBeenDecrypted('app', 'accounts')
  if (!isAccountsDecrypted) {
    store.dispatch(lock())
  } else {
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

    window.addEventListener('click', () => {
      if (isGlobalTabEnabled()) disableGlobalTab()
    })
  }
  document.addEventListener(
    'dragover',
    (event: Event) => {
      event.preventDefault()
      return false
    },
    false,
  )

  document.addEventListener(
    'drop',
    (event: Event) => {
      event.preventDefault()
      return false
    },
    false,
  )

  // expose stuff in Windows for DEBUG purpose

  window.ledger = {
    commands: commandsById,
    store,
    db,
  }
}

function r(Comp) {
  if (rootNode) {
    render(Comp, rootNode)
  }
}

init()
  .catch(e => {
    logger.critical(e)
    r(<AppError error={e} language="en" />)
  })
  .catch(error => {
    // catch the catch! (e.g. react fails to render)
    const pre = document.createElement('pre')
    pre.innerHTML = `Ledger Live crashed. Please contact Ledger support.
${String(error)}
${String((error && error.stack) || 'no stacktrace')}`
    if (document.body) {
      document.body.style.padding = '50px'
      document.body.innerHTML = ''
      document.body.appendChild(pre)
    }
  })
