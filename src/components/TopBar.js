// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withRouter } from 'react-router'

import type { Location, RouterHistory } from 'react-router'
import type { T } from 'types/common'

import { rgba, darken } from 'styles/helpers'
import { lock } from 'reducers/application'
import { hasPassword } from 'reducers/settings'

import IconDevices from 'icons/Devices'
import IconLock from 'icons/Lock'
import IconSettings from 'icons/Settings'

import Box from 'components/base/Box'
import GlobalSearch from 'components/GlobalSearch'

import ActivityIndicator from './ActivityIndicator'

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

const SettingButtonContainer = styled(Box).attrs({
  px: 4,
  ml: 0,
  justifyContent: 'center',
  cursor: 'pointer',
})`
  &:hover > * {
    color: ${p => darken(p.theme.colors.graphite, 0.15)};
    cursor: pointer;
  }
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

class TopBar extends PureComponent<Props> {
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

    return (
      <Container bg="lightGrey" color="graphite">
        <Inner>
          <Box grow horizontal flow={4}>
            <GlobalSearch t={t} isHidden />
            <Box justifyContent="center">
              <IconDevices size={16} />
            </Box>
            <ActivityIndicator />
            <Box justifyContent="center">
              <Bar />
            </Box>
            <SettingButtonContainer onClick={this.navigateToSettings}>
              <IconSettings size={16} />
            </SettingButtonContainer>
            {hasPassword && ( // FIXME this should be a dedicated component. therefore this component don't need to connect()
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
