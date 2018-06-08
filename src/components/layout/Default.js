// @flow

import React, { Fragment, Component } from 'react'
import { compose } from 'redux'
import styled from 'styled-components'
import { Route, withRouter } from 'react-router'
import { translate } from 'react-i18next'

import type { Location } from 'react-router'

import * as modals from 'components/modals'
import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'

import AccountPage from 'components/AccountPage'
import DashboardPage from 'components/DashboardPage'
import ManagerPage from 'components/ManagerPage'
import ExchangePage from 'components/ExchangePage'
import SettingsPage from 'components/SettingsPage'

import AppRegionDrag from 'components/AppRegionDrag'
import IsUnlocked from 'components/IsUnlocked'
import SideBar from 'components/MainSideBar'
import TopBar from 'components/TopBar'

const Container = styled(GrowScroll).attrs({
  p: 6,
})`
  padding-top: ${p => p.theme.sizes.topBarHeight + p.theme.space[7]}px;
`

type Props = {
  location: Location,
}

class Default extends Component<Props> {
  componentDidMount() {
    window.requestAnimationFrame(() => (this._timeout = setTimeout(() => window.onAppReady(), 300)))
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      if (this._scrollContainer) {
        this._scrollContainer._scrollbar.scrollTo(0, 0)
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timeout)
  }

  handleScroll = () => {
    document.querySelectorAll('.tippy-popper').forEach((p: any) => {
      const instance = p._tippy

      if (instance.state.visible) {
        instance.popperInstance.disableEventListeners()
        instance.hide(0)
      }
    })
  }

  _timeout = undefined
  _scrollContainer = null

  render() {
    return (
      <Fragment>
        {process.platform === 'darwin' && <AppRegionDrag />}

        <IsUnlocked>
          {Object.entries(modals).map(([name, ModalComponent]: [string, any]) => (
            <ModalComponent key={name} />
          ))}

          <Box grow horizontal bg="white">
            <SideBar />

            <Box shrink grow bg="lightGrey" color="grey" relative>
              <TopBar />
              <Container innerRef={n => (this._scrollContainer = n)} onScroll={this.handleScroll}>
                <Route path="/" exact component={DashboardPage} />
                <Route path="/settings" component={SettingsPage} />
                <Route path="/manager" component={ManagerPage} />
                <Route path="/exchange" component={ExchangePage} />
                <Route path="/account/:id" component={AccountPage} />
              </Container>
            </Box>
          </Box>
        </IsUnlocked>
      </Fragment>
    )
  }
}

export default compose(
  withRouter,
  translate(),
)(Default)
