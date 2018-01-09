// @flow

import React from 'react'
import { ThemeProvider } from 'styled-components'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'
import { Route } from 'react-router'

import theme from 'styles/theme'
import Home from 'components/Home'

export default ({ store, history }: { store: Object, history: Object }) => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <ConnectedRouter history={history}>
        <Route path="/" component={Home} />
      </ConnectedRouter>
    </ThemeProvider>
  </Provider>
)
