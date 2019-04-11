// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { translate, Trans } from 'react-i18next'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import type { Location, RouterHistory } from 'react-router'

import type { T } from 'types/common'
import { darken } from 'styles/helpers'
import useExperimental from 'hooks/useExperimental'

import { lock } from 'reducers/application'
import { hasPasswordSelector } from 'reducers/settings'
import { hasAccountsSelector } from 'reducers/accounts'
import { openModal } from 'reducers/modals'

import IconLock from 'icons/Lock'
import IconSettings from 'icons/Settings'

import Box from 'components/base/Box'
import Tooltip from 'components/base/Tooltip'
import CurrenciesStatusBanner from 'components/CurrenciesStatusBanner'

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
})``

const Tag = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Open Sans';
  font-weight: bold;
  font-size: 10px;
  height: 22px;
  line-height: 22px;
  padding: 0 10px;
  border-radius: 16px;
  color: ${p => p.theme.colors.white};
  background-color: ${p => p.theme.colors.experimentalBlue};
  text-decoration: none;

  &:hover {
    background-color: ${p => darken(p.theme.colors.experimentalBlue, 0.05)};
  }
`

const TagContainer = () => {
  const isExperimental = useExperimental()

  return isExperimental ? (
    <Box justifyContent="center">
      <Tag to="/settings/experimental">
        <Trans i18nKey="common.experimentalFeature" />
      </Tag>
    </Box>
  ) : null
}

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
            <TagContainer />
            <Box grow />
            <CurrenciesStatusBanner />
            {hasAccounts && (
              <Fragment>
                <ActivityIndicator />
                <Box justifyContent="center">
                  <Bar />
                </Box>
              </Fragment>
            )}
            <Tooltip render={() => t('settings.title')} data-e2e="setting_button">
              <ItemContainer isInteractive onClick={this.navigateToSettings}>
                <IconSettings size={16} />
              </ItemContainer>
            </Tooltip>
            {hasPassword && ( // FIXME this should be a dedicated component. therefore this component don't need to connect()
              <Fragment>
                <Box justifyContent="center">
                  <Bar />
                </Box>
                <Tooltip render={() => t('common.lock')}>
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
  // $FlowFixMe
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(TopBar)
