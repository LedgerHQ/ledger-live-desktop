// @flow

import React from 'react'
import { ThemeProvider } from 'styled-components'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'

import Box from 'components/base/Box'

import theme from 'styles/theme'

export default ({ store, history }: { store: Object, history: Object }) => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <ConnectedRouter history={history}>
        <Box grow p={2} flow={2} bg="grey20" align="center" justify="center">
          {'...'}
        </Box>
      </ConnectedRouter>
    </ThemeProvider>
  </Provider>
)
