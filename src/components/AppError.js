// @flow

import React from 'react'
import { ThemeProvider } from 'styled-components'
import { I18nextProvider } from 'react-i18next'
import theme, { colors } from 'styles/theme'
import palette from 'styles/palette'
import i18n from 'renderer/i18n/electron'
import TriggerAppReady from './TriggerAppReady'
import RenderError from './RenderError'

// Like App except it just render an error

const themePalette = palette.light
const lightLiveTheme = {
  ...theme,
  colors: {
    ...colors,
    palette: themePalette,
  },
}

const App = ({ language, error }: { error: Error, language: string }) => (
  <I18nextProvider i18n={i18n} initialLanguage={language}>
    <ThemeProvider theme={lightLiveTheme}>
      <RenderError withoutAppData error={error}>
        <TriggerAppReady />
      </RenderError>
    </ThemeProvider>
  </I18nextProvider>
)

export default App
