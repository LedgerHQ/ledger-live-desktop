import React from 'react'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import { ThemeProvider } from 'styled-components'
import createHistory from 'history/createHashHistory'

import createStore from 'renderer/createStore'

import theme from 'styles/theme'

export default function render(component, state) {
  const history = createHistory()
  const store = createStore(history, state)
  return renderer
    .create(
      <Provider store={store}>
        <ThemeProvider theme={theme}>{component}</ThemeProvider>
      </Provider>,
    )
    .toJSON()
}
