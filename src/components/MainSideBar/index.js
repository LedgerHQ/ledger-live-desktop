// @flow

import React, { PureComponent } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import type { Location } from 'react-router'
import type { T } from 'types/common'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { MODAL_RECEIVE, MODAL_SEND, MAIN_SIDEBAR_WIDTH } from 'config/constants'
import { accountsSelector } from 'reducers/accounts'
import { openModal } from 'reducers/modals'
import { developerModeSelector } from 'reducers/settings'

import { SideBarList, SideBarListItem } from 'components/base/SideBar'
import Box from 'components/base/Box'
import Space from 'components/base/Space'
import UpdateDot from 'components/Updater/UpdateDot'
import IconManager from 'icons/Manager'
import IconWallet from 'icons/Wallet'
import IconPieChart from 'icons/PieChart'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'
import IconExchange from 'icons/Exchange'
import TopGradient from './TopGradient'
import useExperimental from '../../hooks/useExperimental'
import { darken } from '../../styles/helpers'
import Stars from '../Stars'

const mapStateToProps = state => ({
  noAccounts: accountsSelector(state).length === 0,
  developerMode: developerModeSelector(state),
})

const mapDispatchToProps = {
  push,
  openModal,
}

type Props = {
  t: T,
  noAccounts: boolean,
  location: Location,
  push: string => void,
  openModal: string => void,
}

const TagContainer = () => {
  const isExperimental = useExperimental()

  return isExperimental ? (
    <Box
      justifyContent="center"
      m={2}
      style={{
        flexGrow: 1,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <Tag to="/settings/experimental">
        <Trans i18nKey="common.experimentalFeature" />
      </Tag>
    </Box>
  ) : null
}

const Tag = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Open Sans';
  font-weight: bold;
  font-size: 10px;
  padding: 2px 8px;
  min-height: 22px;
  border-radius: 4px;
  color: ${p => p.theme.colors.smoke};
  background-color: ${p => p.theme.colors.lightFog};
  text-decoration: none;

  &:hover {
    background-color: ${p => darken(p.theme.colors.lightFog, 0.05)};
  }
`

class MainSideBar extends PureComponent<Props> {
  push = (to: string) => {
    const { push } = this.props
    const {
      location: { pathname },
    } = this.props
    if (pathname === to) {
      return
    }
    push(to)
  }

  handleClickDashboard = () => this.push('/')
  handleOpenSendModal = () => {
    this.maybeRedirectToAccounts()
    this.props.openModal(MODAL_SEND)
  }
  handleOpenReceiveModal = () => {
    this.maybeRedirectToAccounts()
    this.props.openModal(MODAL_RECEIVE)
  }
  handleClickManager = () => this.push('/manager')
  handleClickAccounts = () => this.push('/accounts')
  handleClickExchange = () => this.push('/partners')
  handleClickDev = () => this.push('/dev')
  maybeRedirectToAccounts = () => {
    this.props.location.pathname === '/manager' && this.push('/accounts')
  }

  render() {
    const { t, noAccounts, location } = this.props
    const { pathname } = location

    return (
      <Box relative bg="white" style={{ width: MAIN_SIDEBAR_WIDTH }}>
        <TopGradient />
        <Space of={70} />
        <SideBarList title={t('sidebar.menu')}>
          <SideBarListItem
            label={t('dashboard.title')}
            icon={IconPieChart}
            iconActiveColor="wallet"
            onClick={this.handleClickDashboard}
            isActive={pathname === '/'}
            NotifComponent={noAccounts ? undefined : UpdateDot}
            disabled={noAccounts}
          />
          <SideBarListItem
            label={t('sidebar.accounts')}
            icon={IconWallet}
            iconActiveColor="wallet"
            isActive={pathname === '/accounts'}
            onClick={this.handleClickAccounts}
            NotifComponent={noAccounts ? UpdateDot : undefined}
          />
          <SideBarListItem
            label={t('send.title')}
            icon={IconSend}
            iconActiveColor="wallet"
            onClick={this.handleOpenSendModal}
            disabled={noAccounts}
          />
          <SideBarListItem
            label={t('receive.title')}
            icon={IconReceive}
            iconActiveColor="wallet"
            onClick={this.handleOpenReceiveModal}
            disabled={noAccounts}
          />
          <SideBarListItem
            label={t('sidebar.manager')}
            icon={IconManager}
            iconActiveColor="wallet"
            onClick={this.handleClickManager}
            isActive={pathname === '/manager'}
          />
          <SideBarListItem
            label={t('sidebar.exchange')}
            icon={IconExchange}
            iconActiveColor="wallet"
            onClick={this.handleClickExchange}
            isActive={pathname === '/partners'}
          />
          <Space of={30} />
        </SideBarList>

        <SideBarList scroll title={t('sidebar.stars')}>
          <Stars pathname={pathname} />
          <TagContainer />
        </SideBarList>
      </Box>
    )
  }
}

const decorate = compose(
  // $FlowFixMe
  withRouter,
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)
export default decorate(MainSideBar)
