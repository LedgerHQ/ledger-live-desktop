// @flow

import React, { PureComponent } from 'react'
import { ipcRenderer } from 'electron'
import { Route } from 'react-router'
import { translate } from 'react-i18next'

import Box from 'components/base/Box'

import DashboardPage from 'components/DashboardPage'
import SettingsPage from 'components/SettingsPage'
import AccountPage from 'components/AccountPage'
import SendModal from 'components/SendModal'
import ReceiveModal from 'components/ReceiveModal'
import UpdateNotifier from 'components/UpdateNotifier'

import SideBar from 'components/SideBar'
import TopBar from 'components/TopBar'

class Wrapper extends PureComponent<{}> {
  componentDidMount() {
    ipcRenderer.send('renderer-ready')
  }

  render() {
    return (
      <Box grow horizontal>
        <SideBar />
        <Box shrink grow bg="cream">
          <TopBar />
          <Route path="/" component={DashboardPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/account/:account" component={AccountPage} />
        </Box>

        <SendModal />
        <ReceiveModal />

        <UpdateNotifier />
      </Box>
    )
  }
}

export default translate()(Wrapper)
