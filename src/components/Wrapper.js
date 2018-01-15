// @flow

import React from 'react'
import { Route } from 'react-router'
import { translate } from 'react-i18next'

import Box from 'components/base/Box'

import DashboardPage from 'components/DashboardPage'
import SettingsPage from 'components/SettingsPage'
import AccountPage from 'components/AccountPage'
import SendModal from 'components/SendModal'
import ReceiveModal from 'components/ReceiveModal'

import SideBar from 'components/SideBar'
import TopBar from 'components/TopBar'

const Wrapper = () => (
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
  </Box>
)

export default translate()(Wrapper)
