// @flow

import { remote } from 'electron'
import React, { Fragment, Component } from 'react'
import { compose } from 'redux'
import styled from 'styled-components'
import { Route, withRouter, Switch } from 'react-router'
import { translate } from 'react-i18next'
import { SYNC_PENDING_INTERVAL } from 'config/constants'
import { connect } from 'react-redux'

import type { Location } from 'react-router'

import * as modals from 'components/modals'
import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'
import Track from 'analytics/Track'
import Idler from 'components/Idler'

import AccountPage from 'components/AccountPage'
import DashboardPage from 'components/DashboardPage'
import ManagerPage from 'components/ManagerPage'
import AccountsPage from 'components/AccountsPage'
import PartnersPage from 'components/PartnersPage'
import SettingsPage from 'components/SettingsPage'
import AssetPage from 'components/AssetPage'
import KeyboardContent from 'components/KeyboardContent'
import PerfIndicator from 'components/PerfIndicator'
import LibcoreBusyIndicator from 'components/LibcoreBusyIndicator'
import DeviceBusyIndicator from 'components/DeviceBusyIndicator'
import TriggerAppReady from 'components/TriggerAppReady'
import ExportLogsBtn from 'components/ExportLogsBtn'
import OnboardingOrElse from 'components/OnboardingOrElse'
import AppRegionDrag from 'components/AppRegionDrag'
import IsUnlocked from 'components/IsUnlocked'
import SideBar from 'components/MainSideBar'
import TopBar from 'components/TopBar'
import SyncBackground from 'components/SyncBackground'
import DebugUpdater from 'components/Updater/DebugUpdater'
import ListenDevices from 'components/ListenDevices'
import IsNewVersion from 'components/IsNewVersion'

import SyncContinuouslyPendingOperations from '../SyncContinouslyPendingOperations'
import HSMStatusBanner from '../HSMStatusBanner'
import type { State } from '../../reducers'

const Main = styled(GrowScroll).attrs(() => ({
  px: 6,
}))`
  outline: none;
  padding-top: ${p => p.theme.sizes.topBarHeight + p.theme.space[6]}px;
`

type Props = {
  location: Location,
  visibleModals: any[],
  i18n: {
    reloadResources: Function,
  },
}

class Default extends Component<Props> {
  componentDidMount() {
    window.addEventListener('keydown', this.kbShortcut)
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.location !== prevProps.location &&
      this.ref &&
      this.ref.scrollContainer &&
      this.ref.scrollContainer.scrollTo
    ) {
      this.ref.scrollContainer.scrollTo(0, 0)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.kbShortcut) // Prevents adding multiple listeners when hot reloading
  }

  kbShortcut = event => {
    if (event.ctrlKey && event.key === 'l') {
      this.props.i18n.reloadResources()
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
      remote.getCurrentWindow().webContents.reload()
    }
  }

  ref = null

  render() {
    const { visibleModals } = this.props

    return (
      <Fragment>
        <TriggerAppReady />
        <ListenDevices />
        {process.platform === 'darwin' && <AppRegionDrag />}
        <ExportLogsBtn hookToShortcut />
        <Track mandatory onMount event="App Starts" />
        <Idler />

        <IsUnlocked>
          <OnboardingOrElse>
            {visibleModals.map(([name, ModalComponent]) => (
              <ModalComponent key={name} />
            ))}

            <IsNewVersion />

            {process.env.DEBUG_UPDATE && <DebugUpdater />}

            <SyncContinuouslyPendingOperations priority={20} interval={SYNC_PENDING_INTERVAL} />
            <SyncBackground />

            <div id="sticky-back-to-top-root" />

            <Box grow horizontal bg="palette.background.paper">
              <SideBar />

              <Box
                className={'main-container'}
                shrink
                grow
                bg="palette.background.default"
                color="palette.text.shade60"
                overflow="visible"
                relative
              >
                <HSMStatusBanner />
                <TopBar />
                <Main ref={n => (this.ref = n)} tabIndex={-1}>
                  <Switch>
                    <Route path="/" exact component={DashboardPage} />
                    <Route path="/settings" component={SettingsPage} />
                    <Route path="/accounts" component={AccountsPage} />
                    <Route path="/manager" component={ManagerPage} />
                    <Route path="/partners" component={PartnersPage} />
                    <Route path="/account/:parentId/:id" component={AccountPage} />
                    <Route path="/account/:id" component={AccountPage} />
                    <Route path="/asset/:assetId+" component={AssetPage} />
                  </Switch>
                </Main>
              </Box>
            </Box>

            <LibcoreBusyIndicator />
            <DeviceBusyIndicator />
            <KeyboardContent sequence="BJBJBJ">
              <PerfIndicator />
            </KeyboardContent>
          </OnboardingOrElse>
        </IsUnlocked>
      </Fragment>
    )
  }
}
const mapStateToProps = (state: State): * => ({
  visibleModals: Object.entries(modals).reduce((visible, [name, ModalComponent]: [string, any]) => {
    if (state.modals.hasOwnProperty(name) && state.modals[name].isOpened) {
      visible.push([name, ModalComponent])
    }
    return visible
  }, []),
})

export default compose(
  connect(mapStateToProps),
  // $FlowFixMe
  withRouter,
  translate(),
)(Default)
