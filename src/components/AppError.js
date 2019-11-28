// @flow

import React from 'react'
import { I18nextProvider } from 'react-i18next'
import theme from 'styles/theme'
import i18n from 'renderer/i18n/electron'
import TriggerAppReady from './TriggerAppReady'
import RenderError from './RenderError'
import LiveThemeProvider from './LiveThemeProvider'

// Like App except it just render an error

const App = ({ language, error }: { error: Error, language: string }) => (
  <I18nextProvider i18n={i18n} initialLanguage={language}>
    <LiveThemeProvider theme={theme}>
      <RenderError withoutAppData error={error}>
        <TriggerAppReady />
      </RenderError>
    </LiveThemeProvider>
  </I18nextProvider>
)

export default App
