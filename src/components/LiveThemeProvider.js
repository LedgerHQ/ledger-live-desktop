// @flow
import React from 'react'
import { connect } from 'react-redux'
import { themeSelector } from 'reducers/settings'
import { ThemeProvider } from 'styled-components'
import theme, { colors } from 'styles/theme'
import palette from 'styles/palette'

type Props = {
  children: any,
  themeConfig: ?string,
}

const LiveThemeProvider = ({ children, themeConfig }: Props) => {
  const themePalette = palette[themeConfig || 'light']

  const liveTheme = {
    ...theme,
    colors: {
      ...colors,
      palette: themePalette,
    },
  }

  return <ThemeProvider theme={liveTheme}>{children}</ThemeProvider>
}

const mapStateToProps = state => ({
  themeConfig: themeSelector(state),
})

export default connect(mapStateToProps)(LiveThemeProvider)
