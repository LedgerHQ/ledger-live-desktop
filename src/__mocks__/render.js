import React from 'react'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import { ThemeProvider } from 'styled-components'

import createStore from 'renderer/createStore'

import theme from 'styles/theme'

export default function render(component, state) {
  const store = createStore({ state })
  return renderer
    .create(
      <Provider store={store}>
        <ThemeProvider theme={theme}>{component}</ThemeProvider>
      </Provider>,
    )
    .toJSON()
}
