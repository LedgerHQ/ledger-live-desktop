// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import type { MapStateToProps } from 'react-redux'
import type { Settings, T } from 'types/common'

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
  t: T,
  settings: Settings,
  saveSettings: Function,
}

type State = {
  tab: number,
}

class SettingsPage extends PureComponent<Props, State> {
  state = {
    tab: 0,
  }

  handleChangeTab = (tab: number) => this.setState({ tab })

  handleSaveSettings = settings => this.props.saveSettings(settings)

  render() {
    const { settings, t } = this.props
    const { tab } = this.state

    const props = {
      settings,
      onSaveSettings: this.handleSaveSettings,
    }

    return (
      <Box flow={4}>
        <Text fontSize={5}>{t('settings.title')}</Text>
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
              title: t('settings.tabs.money'),
              render: () => <div>{'Monnaie'}</div>,
            },
            {
              key: 'material',
              title: t('settings.tabs.material'),
              render: () => <div>{'Matériel'}</div>,
            },
            {
              key: 'app',
              title: t('settings.tabs.app'),
              render: () => <div>{'App (beta)'}</div>,
            },
            {
              key: 'tools',
              title: t('settings.tabs.tools'),
              render: () => <div>{'Outils'}</div>,
            },
            {
              key: 'blockchain',
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
