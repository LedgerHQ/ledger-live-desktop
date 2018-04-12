import React from 'react'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import { ThemeProvider } from 'styled-components'
import { I18nextProvider } from 'react-i18next'

import createStore from 'renderer/createStore'
import i18n from 'renderer/i18n/electron'

import theme from 'styles/theme'

export default function render(component, state) {
  const store = createStore({ state })
  return renderer
    .create(
      <I18nextProvider i18n={i18n} initialLanguage="en">
        <Provider store={store}>
          <ThemeProvider theme={theme}>{component}</ThemeProvider>
        </Provider>
      </I18nextProvider>,
    )
    .toJSON()
}
