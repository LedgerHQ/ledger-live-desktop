// @flow

import React from 'react'
import { ThemeProvider } from 'styled-components'
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'

import theme from 'styles/theme'

import i18n from 'renderer/i18n/electron'

import Default from 'components/layout/Default'
import Dev from 'components/layout/Dev'
import Print from 'components/layout/Print'

const { DEV_TOOLS } = process.env

export default ({
  store,
  history,
  language,
}: {
  store: Object,
  history: Object,
  language: string,
}) => (
  <Provider store={store}>
    <I18nextProvider i18n={i18n} initialLanguage={language}>
      <ThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <Switch>
            {(__DEV__ || DEV_TOOLS) && <Route path="/dev" component={Dev} />}
            <Route path="/print" component={Print} />
            <Route component={Default} />
          </Switch>
        </ConnectedRouter>
      </ThemeProvider>
    </I18nextProvider>
  </Provider>
)
