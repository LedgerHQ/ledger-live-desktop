// @flow

import React, { Fragment, Component } from 'react'
import { Route } from 'react-router'
import { translate } from 'react-i18next'

import * as modals from 'components/modals'
import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'

import AccountPage from 'components/AccountPage'
import DashboardPage from 'components/DashboardPage'
import SettingsPage from 'components/SettingsPage'
import UpdateNotifier from 'components/UpdateNotifier'

import AppRegionDrag from 'components/AppRegionDrag'
import IsUnlocked from 'components/IsUnlocked'
import SideBar from 'components/SideBar'
import TopBar from 'components/TopBar'

class Wrapper extends Component<{}> {
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

                <Box shrink grow bg="cream" color="grey">
                  <TopBar />
                  <Box grow relative>
                    {__PROD__ && <UpdateNotifier />}
                    <GrowScroll p={4}>
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
