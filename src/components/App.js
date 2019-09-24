// @flow

import React from 'react'
import { ThemeProvider } from 'styled-components'
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'

import theme from 'styles/theme'

import i18n from 'renderer/i18n/electron'

import ThrowBlock from 'components/ThrowBlock'
import Default from 'components/layout/Default'
import CounterValues from 'helpers/countervalues'
import { BridgeSyncProvider } from 'bridge/BridgeSyncContext'
import { UpdaterProvider } from 'components/Updater/UpdaterContext'
import ContextMenuWrapper from './ContextMenu/ContextMenuWrapper'
import DeviceContextProvider from './DeviceContextProvider'

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
            <DeviceContextProvider>
              <ThrowBlock>
                <UpdaterProvider>
                  <ConnectedRouter history={history}>
                    <Switch>
                      <ContextMenuWrapper>
                        <Route component={Default} />
                      </ContextMenuWrapper>
                    </Switch>
                  </ConnectedRouter>
                </UpdaterProvider>
              </ThrowBlock>
            </DeviceContextProvider>
          </ThemeProvider>
        </I18nextProvider>
      </CounterValues.PollingProvider>
    </BridgeSyncProvider>
  </Provider>
)

export default App
