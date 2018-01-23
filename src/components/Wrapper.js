// @flow

import React, { Fragment, Component } from 'react'
import { ipcRenderer } from 'electron'
import { Route } from 'react-router'
import { translate } from 'react-i18next'

import * as modals from 'components/modals'
import Box, { GrowScroll } from 'components/base/Box'

import AccountPage from 'components/AccountPage'
import DashboardPage from 'components/DashboardPage'
import SettingsPage from 'components/SettingsPage'
import UpdateNotifier from 'components/UpdateNotifier'

import AppRegionDrag from 'components/AppRegionDrag'
import IsUnlocked from 'components/IsUnlocked'
import SideBar from 'components/SideBar'
import TopBar from 'components/TopBar'

class Wrapper extends Component<{}> {
  componentDidMount() {
    ipcRenderer.send('renderer-ready')
  }

  render() {
    return (
      <Fragment>
        {process.platform === 'darwin' && <AppRegionDrag />}

        <IsUnlocked
          render={() => (
            <Fragment>
              {Object.entries(modals).map(([name, ModalComponent]: [string, any]) => (
                <ModalComponent key={name} />
              ))}

              <Box grow horizontal>
                <SideBar />

                <Box shrink grow bg="cream">
                  <TopBar />
                  <Box grow relative>
                    <UpdateNotifier />
                    <GrowScroll p={3}>
                      <Route path="/" exact component={DashboardPage} />
                      <Route path="/settings" component={SettingsPage} />
                      <Route path="/account/:id" component={AccountPage} />
                    </GrowScroll>
                  </Box>
                </Box>
              </Box>
            </Fragment>
          )}
        />
      </Fragment>
    )
  }
}

export default translate()(Wrapper)
