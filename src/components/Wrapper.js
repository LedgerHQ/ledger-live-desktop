// @flow

import React, { Fragment, Component } from 'react'
import styled from 'styled-components'
import { ipcRenderer } from 'electron'
import { Route } from 'react-router'
import { translate } from 'react-i18next'

import * as modals from 'components/modals'
import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'

import AccountPage from 'components/AccountPage'
import DashboardPage from 'components/DashboardPage'
import SettingsPage from 'components/SettingsPage'

import AppRegionDrag from 'components/AppRegionDrag'
import DevToolbar from 'components/DevToolbar'
import IsUnlocked from 'components/IsUnlocked'
import SideBar from 'components/SideBar'
import TopBar from 'components/TopBar'
import UpdateNotifier from 'components/UpdateNotifier'

const Container = styled(GrowScroll).attrs({
  p: 6,
})`
  padding-top: ${p => p.theme.sizes.topBarHeight + p.theme.space[7]}px;
`

class Wrapper extends Component<{}> {
  componentDidMount() {
    window.requestAnimationFrame(
      () => (this._timeout = setTimeout(() => ipcRenderer.send('app-finish-rendering'), 300)),
    )
  }

  componentWillUnmount() {
    clearTimeout(this._timeout)
  }

  _timeout = undefined

  render() {
    return (
      <Fragment>
        {process.platform === 'darwin' && <AppRegionDrag />}
        {__DEV__ && <DevToolbar />}

        <IsUnlocked>
          {Object.entries(modals).map(([name, ModalComponent]: [string, any]) => (
            <ModalComponent key={name} />
          ))}

          <Box grow horizontal bg="white">
            <SideBar />

            <Box shrink grow bg="cream" color="grey" relative>
              <TopBar />
              <UpdateNotifier />
              <Container>
                <Route path="/" exact component={DashboardPage} />
                <Route path="/settings" component={SettingsPage} />
                <Route path="/account/:id" component={AccountPage} />
              </Container>
            </Box>
          </Box>
        </IsUnlocked>
      </Fragment>
    )
  }
}

export default translate()(Wrapper)
