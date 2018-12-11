// @flow

import React from 'react'
import { ThemeProvider } from 'styled-components'
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { hot } from 'react-hot-loader'

import theme from 'styles/theme'

import i18n from 'renderer/i18n/electron'

import ThrowBlock from 'components/ThrowBlock'
import Default from 'components/layout/Default'
import CounterValues from 'helpers/countervalues'
import { BridgeSyncProvider } from 'bridge/BridgeSyncContext'
import { UpdaterProvider } from 'components/Updater/UpdaterContext'

const App = ({
  store,
  history,
  language,
}: {
  store: Object,
  history: Object,
  language: string,
}) => (
  <Provider store={store}>
    <BridgeSyncProvider>
      <CounterValues.PollingProvider>
        <I18nextProvider i18n={i18n} initialLanguage={language}>
          <ThemeProvider theme={theme}>
            <UpdaterProvider>
              <ThrowBlock>
                <ConnectedRouter history={history}>
                  <Switch>
                    <Route component={Default} />
                  </Switch>
                </ConnectedRouter>
              </ThrowBlock>
            </UpdaterProvider>
          </ThemeProvider>
        </I18nextProvider>
      </CounterValues.PollingProvider>
    </BridgeSyncProvider>
  </Provider>
)

export default hot(module)(App)
