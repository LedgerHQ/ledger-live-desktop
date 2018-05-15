// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withRouter } from 'react-router'
import { ipcRenderer } from 'electron'

import type { Location, RouterHistory } from 'react-router'
import type { T } from 'types/common'

import { rgba } from 'styles/helpers'
import { lock } from 'reducers/application'
import { hasPassword } from 'reducers/settings'

import IconActivity from 'icons/Activity'
import IconDevices from 'icons/Devices'
import IconLock from 'icons/Lock'
import IconSettings from 'icons/Settings'

import Box from 'components/base/Box'
import GlobalSearch from 'components/GlobalSearch'

import CounterValues from 'helpers/countervalues'

const Container = styled(Box).attrs({
  px: 6,
})`
  height: ${p => p.theme.sizes.topBarHeight}px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 20;
`

const Inner = styled(Box).attrs({
  horizontal: true,
  grow: true,
  flow: 4,
})`
  border-bottom: 1px solid ${p => rgba(p.theme.colors.black, 0.15)};
`

const Bar = styled.div`
  height: 15px;
  width: 1px;
  background: ${p => p.theme.colors.fog};
`

const Activity = styled.div`
  background: ${p =>
    p.progress === true
      ? p.theme.colors.wallet
      : p.fail === true
        ? p.theme.colors.alertRed
        : p.theme.colors.positiveGreen};
  border-radius: 50%;
  bottom: 20px;
  height: 4px;
  position: absolute;
  right: -2px;
  width: 4px;
  cursor: pointer;
`

const mapStateToProps = state => ({
  hasPassword: hasPassword(state),
})

const mapDispatchToProps = {
  lock,
}

type Props = {
  hasPassword: boolean,
  history: RouterHistory,
  location: Location,
  lock: Function,
  t: T,
}

type State = {
  sync: {
    progress: null | boolean,
    fail: boolean,
  },
}

class TopBar extends PureComponent<Props, State> {
  state = {
    sync: {
      progress: null,
      fail: false,
    },
  }

  componentDidMount() {
    ipcRenderer.on('msg', this.handleAccountSync)
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('msg', this.handleAccountSync)
  }

  handleAccountSync = (e, { type }) => {
    if (type === 'accounts.sync.progress') {
      this.setState({
        sync: {
          progress: true,
          fail: false,
        },
      })
    }

    if (type === 'accounts.sync.fail') {
      this.setState({
        sync: {
          progress: null,
          fail: true,
        },
      })
    }

    if (type === 'accounts.sync.success') {
      this.setState({
        sync: {
          progress: false,
          fail: false,
        },
      })
    }
  }

  handleLock = () => this.props.lock()

  navigateToSettings = () => {
    const { location, history } = this.props
    const url = '/settings'

    if (location.pathname !== url) {
      history.push(url)
    }
  }
  render() {
    const { hasPassword, t } = this.props
    const { sync } = this.state

    return (
      <Container bg="lightGrey" color="graphite">
        <Inner>
          <Box grow horizontal flow={4}>
            <GlobalSearch t={t} isHidden />
            <Box justifyContent="center">
              <IconDevices size={16} />
            </Box>
            <CounterValues.PollingConsumer>
              {polling => (
                <Box
                  justifyContent="center"
                  relative
                  cursor="pointer"
                  onClick={() => polling.poll()}
                >
                  <IconActivity size={16} />
                  <Activity
                    progress={polling.pending || sync.progress}
                    fail={polling.error || sync.fail}
                  />
                </Box>
              )}
            </CounterValues.PollingConsumer>
            <Box justifyContent="center">
              <Bar />
            </Box>
            <Box justifyContent="center" onClick={this.navigateToSettings}>
              <IconSettings size={16} />
            </Box>
            {hasPassword && (
              <Fragment>
                <Box justifyContent="center">
                  <Bar />
                </Box>
                <Box justifyContent="center" onClick={this.handleLock}>
                  <IconLock size={16} />
                </Box>
              </Fragment>
            )}
          </Box>
        </Inner>
      </Container>
    )
  }
}

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps), translate())(
  TopBar,
)
