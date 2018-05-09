import React from 'react'
import { configure, addDecorator } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { setOptions } from '@storybook/addon-options'
import { ThemeProvider } from 'styled-components'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'

import 'babel-polyfill'
import 'globals'
import 'styles/global'
import theme from 'styles/theme'
import i18n from 'renderer/i18n/storybook'
import createStore from 'renderer/createStore'

import state from '__mocks__/storybook-state'

const req = require.context('../src', true, /.stories.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

const store = createStore({ state })

addDecorator(story => (
  <I18nextProvider i18n={i18n} initialLanguage="en">
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <div style={{ padding: 20 }}>{story()}</div>
      </Provider>
    </ThemeProvider>
  </I18nextProvider>
))

addDecorator(withKnobs)

const { name, repository: url } = require('../package.json')

setOptions({
  name,
  url,
})

configure(loadStories, module)
