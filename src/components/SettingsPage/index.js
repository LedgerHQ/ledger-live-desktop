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

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Tabs from 'components/base/Tabs'

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

  handleChangeTab = (tab: number) => this.setState({ tab })

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

    return (
      <Box flow={6}>
        <Text fontSize={7}>{t('settings:title')}</Text>
        <Tabs
          index={tab}
          onTabClick={this.handleChangeTab}
          items={[
            {
              key: 'display',
              title: t('settings:tabs.display'),
              render: () => <TabDisplay {...props} />,
            },
            {
              key: 'money',
              title: t('settings:tabs.money'),
              render: () => <TabMoney {...props} />,
            },
            {
              key: 'material',
              isDisabled: true,
              title: t('settings:tabs.material'),
              render: () => <div>{'Matériel'}</div>,
            },
            {
              key: 'app',
              isDisabled: true,
              title: t('settings:tabs.app'),
              render: () => <div>{'App (beta)'}</div>,
            },
            {
              key: 'tools',
              title: t('settings:tabs.tools'),
              render: () => <TabTools {...props} />,
            },
            {
              key: 'blockchain',
              isDisabled: true,
              title: t('settings:tabs.blockchain'),
              render: () => <div>{'Blockchain'}</div>,
            },
            {
              key: 'profile',
              title: t('settings:tabs.profile'),
              render: () => <TabProfile {...props} />,
            },
          ]}
        />
      </Box>
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(SettingsPage)
