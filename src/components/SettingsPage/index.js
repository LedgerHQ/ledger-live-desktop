// @flow

import React, { PureComponent } from 'react'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Tabs from 'components/base/Tabs'

import TabProfile from './Profile'

class SettingsPage extends PureComponent<Props, State> {
  state = {
    tab: 'profile',
  }

  handleChangeTab = tab => this.setState({ tab })

  render() {
    const { tab } = this.state

    return (
      <Box p={3} flow={4}>
        <Text fontSize={5}>{'Settings'}</Text>
        <Tabs
          index={tab}
          onTabClick={this.handleChangeTab}
          items={[
            {
              key: 'display',
              title: 'Affichage',
              render: () => <div>{'Affichage'}</div>,
            },
            {
              key: 'money',
              title: 'Monnaie',
              render: () => <div>{'Monnaie'}</div>,
            },
            {
              key: 'material',
              title: 'Matériel',
              render: () => <div>{'Matériel'}</div>,
            },
            {
              key: 'app',
              title: 'App (beta)',
              render: () => <div>{'App (beta)'}</div>,
            },
            {
              key: 'tools',
              title: 'Outils',
              render: () => <div>{'Outils'}</div>,
            },
            {
              key: 'blockchain',
              title: 'Blockchain',
              render: () => <div>{'Blockchain'}</div>,
            },
            {
              key: 'profile',
              title: 'Profil',
              render: () => <TabProfile />,
            },
          ]}
        />
      </Box>
    )
  }
}

export default SettingsPage
