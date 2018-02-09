// @flow

import React from 'react'
import { ThemeProvider } from 'styled-components'
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'

import theme from 'styles/theme'

import i18n from 'renderer/i18n'

import Wrapper from 'components/Wrapper'
import PrintWrapper from 'components/PrintWrapper'

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
            <Route path="/print" component={PrintWrapper} />
            <Route component={Wrapper} />
          </Switch>
        </ConnectedRouter>
      </ThemeProvider>
    </I18nextProvider>
  </Provider>
)
