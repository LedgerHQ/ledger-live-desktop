// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import type { Settings, T } from 'types/common'
import type { SaveSettings } from 'actions/settings'
import type { FetchCounterValues } from 'actions/counterValues'

import { saveSettings } from 'actions/settings'
import { fetchCounterValues } from 'actions/counterValues'

import Pills from 'components/base/Pills'
import Box from 'components/base/Box'

import SectionDisplay from './sections/Display'
import SectionCurrencies from './sections/Currencies'
import SectionProfile from './sections/Profile'
import SectionAbout from './sections/About'

const mapStateToProps = state => ({
  settings: state.settings,
})

const mapDispatchToProps = {
  fetchCounterValues,
  saveSettings,
}

type Props = {
  i18n: Object,
  saveSettings: SaveSettings,
  settings: Settings,
  fetchCounterValues: FetchCounterValues,
  t: T,
}

type State = {
  tab: number,
}

class SettingsPage extends PureComponent<Props, State> {
  state = {
    tab: 0,
  }

  _items = []

  handleChangeTab = (item: any) => {
    const tab = this._items.indexOf(item)
    this.setState({ tab })
  }

  handleSaveSettings = newSettings => {
    const { fetchCounterValues, saveSettings, settings } = this.props

    saveSettings(newSettings)

    if (newSettings.counterValue !== settings.counterValue) {
      fetchCounterValues()
    }
  }

  render() {
    const { settings, t, i18n, saveSettings } = this.props
    const { tab } = this.state

    const props = {
      t,
      settings,
      saveSettings,
    }

    this._items = [
      {
        key: 'display',
        label: t('settings:tabs.display'),
        value: () => <SectionDisplay {...props} i18n={i18n} />,
      },
      {
        key: 'currencies',
        label: t('settings:tabs.currencies'),
        value: () => <SectionCurrencies {...props} />,
      },
      {
        key: 'profile',
        label: t('settings:tabs.profile'),
        value: () => <SectionProfile {...props} />,
      },
      {
        key: 'about',
        label: t('settings:tabs.about'),
        value: () => <SectionAbout {...props} />,
      },
    ]

    const item = this._items[tab]

    return (
      <Box>
        <Box ff="Museo Sans|Regular" color="dark" fontSize={7} mb={5}>
          {t('settings:title')}
        </Box>
        <Pills mb={4} items={this._items} activeKey={item.key} onChange={this.handleChangeTab} />
        {item.value && item.value()}
      </Box>
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(SettingsPage)
