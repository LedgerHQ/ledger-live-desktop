// @flow

import React from 'react'
import { ThemeProvider } from 'styled-components'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'
import { Route } from 'react-router'

import theme from 'styles/theme'

import Box from 'components/base/Box'
import SideBar from 'components/SideBar'
import TopBar from 'components/TopBar'
import Home from 'components/Home'

export default ({ store, history }: { store: Object, history: Object }) => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <ConnectedRouter history={history}>
        <Box grow horizontal>
          <SideBar />
          <Box grow bg="cream">
            <TopBar />
            <Route path="/" component={Home} />
          </Box>
        </Box>
      </ConnectedRouter>
    </ThemeProvider>
  </Provider>
)
