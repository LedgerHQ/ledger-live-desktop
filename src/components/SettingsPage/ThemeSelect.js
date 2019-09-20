// @flow

import React from 'react'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import { connect } from 'react-redux'
import map from 'lodash/map'
import { setTheme } from 'actions/settings'
import { themeSelector } from 'reducers/settings'
import Track from 'analytics/Track'
import Select from 'components/base/Select'

type Props = {
  t: T,
  setTheme: (?string) => void,
  theme: string,
}

const themeLabels = {
  light: 'theme.light',
  dusk: 'theme.dusk',
  dark: 'theme.dark',
}

const ThemeSelect = ({ setTheme, theme, t }: Props) => {
  const system = { value: null, label: t(`theme.system`) }

  const options = [system].concat(
    map(themeLabels, (value, key) => ({
      value: key,
      label: t(themeLabels[key]),
    })),
  )

  const handleChangeTheme = ({ value: themeKey }: *) => {
    setTheme(themeKey)
    window.localStorage.setItem('theme', themeKey)
  }

  const currentTheme = options.find(option => option.value === theme)
  return (
    <>
      <Track onUpdate event="ThemeSelect" currentTheme={theme} />
      <Select
        small
        minWidth={260}
        isSearchable={false}
        onChange={handleChangeTheme}
        value={currentTheme}
        options={options}
      />
    </>
  )
}

const mapStateToProps = state => ({
  theme: themeSelector(state),
})

export default translate()(
  connect(
    mapStateToProps,
    {
      setTheme,
    },
  )(ThemeSelect),
)
