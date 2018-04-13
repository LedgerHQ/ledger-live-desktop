// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import moment from 'moment'

import type { Settings, T } from 'types/common'
import type { SaveSettings } from 'actions/settings'
import type { FetchCounterValues } from 'actions/counterValues'

import { saveSettings } from 'actions/settings'
import { fetchCounterValues } from 'actions/counterValues'

import Pills from 'components/base/Pills'
import Box from 'components/base/Box'

import TabDisplay from './Display'
import TabProfile from './Profile'
import TabTools from './Tools'
import TabMoney from './Money'

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
    const { fetchCounterValues, saveSettings, i18n, settings } = this.props

    saveSettings(newSettings)

    if (newSettings.language !== settings.language) {
      i18n.changeLanguage(newSettings.language)
      moment.locale(newSettings.language)
    }

    if (newSettings.counterValue !== settings.counterValue) {
      fetchCounterValues()
    }
  }

  render() {
    const { settings, t } = this.props
    const { tab } = this.state

    const props = {
      t,
      settings,
      onSaveSettings: this.handleSaveSettings,
    }

    this._items = [
      {
        key: 'display',
        label: t('settings:tabs.display'),
        value: () => <TabDisplay {...props} />,
      },
      {
        key: 'money',
        label: t('settings:tabs.money'),
        value: () => <TabMoney {...props} />,
      },
      {
        key: 'material',
        isDisabled: true,
        label: t('settings:tabs.material'),
        value: () => <div>{'Matériel'}</div>,
      },
      {
        key: 'app',
        isDisabled: true,
        label: t('settings:tabs.app'),
        value: () => <div>{'App (beta)'}</div>,
      },
      {
        key: 'tools',
        label: t('settings:tabs.tools'),
        value: () => <TabTools {...props} />,
      },
      {
        key: 'blockchain',
        isDisabled: true,
        label: t('settings:tabs.blockchain'),
        value: () => <div>{'Blockchain'}</div>,
      },
      {
        key: 'profile',
        label: t('settings:tabs.profile'),
        value: () => <TabProfile {...props} />,
      },
    ]

    const item = this._items[tab]

    return (
      <Box>
        <Box fontSize={7} mb={4}>
          {t('settings:title')}
        </Box>
        <Pills mb={6} items={this._items} activeKey={item.key} onChange={this.handleChangeTab} />
        {item.value && item.value()}
      </Box>
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(SettingsPage)
