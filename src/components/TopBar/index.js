// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withRouter } from 'react-router'

import type { Location, RouterHistory } from 'react-router'
import type { T } from 'types/common'

import { lock } from 'reducers/application'
import { hasPasswordSelector } from 'reducers/settings'
import { hasAccountsSelector } from 'reducers/accounts'
import { openModal } from 'reducers/modals'

import IconLock from 'icons/Lock'
import IconSettings from 'icons/Settings'

import Box from 'components/base/Box'
import GlobalSearch from 'components/GlobalSearch'
import Tooltip from 'components/base/Tooltip'

import ActivityIndicator from './ActivityIndicator'
import ItemContainer from './ItemContainer'

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
  align: 'center',
})`
  border-bottom: 1px solid ${p => p.theme.colors.fog};
`

const Bar = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  height: 15px;
  width: 1px;
  background: ${p => p.theme.colors.fog};
`

const mapStateToProps = state => ({
  hasPassword: hasPasswordSelector(state),
  hasAccounts: hasAccountsSelector(state),
})

const mapDispatchToProps = {
  lock,
  openModal,
}

type Props = {
  hasPassword: boolean,
  hasAccounts: boolean,
  history: RouterHistory,
  location: Location,
  lock: Function,
  openModal: string => void,
  t: T,
}

let settingsClickTimes = []

class TopBar extends PureComponent<Props> {
  handleLock = () => this.props.lock()

  navigateToSettings = () => {
    const { location, history } = this.props
    const url = '/settings'

    const now = Date.now()
    settingsClickTimes = settingsClickTimes.filter(t => now - t < 3000).concat(now)
    if (settingsClickTimes.length === 7) {
      settingsClickTimes = []
      this.props.openModal('MODAL_DEBUG')
    }

    if (location.pathname !== url) {
      history.push(url)
    }
  }
  render() {
    const { hasPassword, hasAccounts, t } = this.props

    return (
      <Container bg="lightGrey" color="graphite">
        <Inner>
          <Box grow horizontal>
            <GlobalSearch t={t} isHidden />
            {hasAccounts && (
              <Fragment>
                <ActivityIndicator />
                <Box justifyContent="center">
                  <Bar />
                </Box>
              </Fragment>
            )}
            <Tooltip render={() => t('app:settings.title')}>
              <ItemContainer isInteractive onClick={this.navigateToSettings}>
                <IconSettings size={16} />
              </ItemContainer>
            </Tooltip>
            {hasPassword && ( // FIXME this should be a dedicated component. therefore this component don't need to connect()
              <Fragment>
                <Box justifyContent="center">
                  <Bar />
                </Box>
                <Tooltip render={() => t('app:common.lock')}>
                  <ItemContainer isInteractive justifyContent="center" onClick={this.handleLock}>
                    <IconLock size={16} />
                  </ItemContainer>
                </Tooltip>
              </Fragment>
            )}
          </Box>
        </Inner>
      </Container>
    )
  }
}

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(TopBar)
