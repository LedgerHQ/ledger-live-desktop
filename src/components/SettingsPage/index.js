// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import type { MapStateToProps } from 'react-redux'
import type { Settings, T } from 'types/common'
import type { SaveSettings } from 'actions/settings'

import { saveSettings } from 'actions/settings'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Tabs from 'components/base/Tabs'

import TabDisplay from './Display'
import TabProfile from './Profile'

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  settings: state.settings,
})

const mapDispatchToProps = {
  saveSettings,
}

type Props = {
  i18n: Object,
  saveSettings: SaveSettings,
  settings: Settings,
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
    const { saveSettings, i18n, settings } = this.props

    if (newSettings.language !== settings.language) {
      i18n.changeLanguage(newSettings.language)
    }

    saveSettings(newSettings)
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
        <Text fontSize={7}>{t('settings.title')}</Text>
        <Tabs
          index={tab}
          onTabClick={this.handleChangeTab}
          items={[
            {
              key: 'display',
              title: t('settings.tabs.display'),
              render: () => <TabDisplay {...props} />,
            },
            {
              key: 'money',
              isDisabled: true,
              title: t('settings.tabs.money'),
              render: () => <div>{'Monnaie'}</div>,
            },
            {
              key: 'material',
              isDisabled: true,
              title: t('settings.tabs.material'),
              render: () => <div>{'Matériel'}</div>,
            },
            {
              key: 'app',
              isDisabled: true,
              title: t('settings.tabs.app'),
              render: () => <div>{'App (beta)'}</div>,
            },
            {
              key: 'tools',
              isDisabled: true,
              title: t('settings.tabs.tools'),
              render: () => <div>{'Outils'}</div>,
            },
            {
              key: 'blockchain',
              isDisabled: true,
              title: t('settings.tabs.blockchain'),
              render: () => <div>{'Blockchain'}</div>,
            },
            {
              key: 'profile',
              title: t('settings.tabs.profile'),
              render: () => <TabProfile {...props} />,
            },
          ]}
        />
      </Box>
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(SettingsPage)
