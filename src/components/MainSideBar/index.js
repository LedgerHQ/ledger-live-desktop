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

import { MODAL_RECEIVE, MODAL_SEND } from 'config/constants'
import { accountsSelector } from 'reducers/accounts'
import { openModal } from 'reducers/modals'
import { developerModeSelector } from 'reducers/settings'

import { SideBarList, SideBarListItem } from 'components/base/SideBar'
import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'
import Space from 'components/base/Space'
import UpdateDot from 'components/Updater/UpdateDot'
import IconManager from 'icons/Manager'
import IconWallet from 'icons/Wallet'
import IconPieChart from 'icons/PieChart'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'
import IconExchange from 'icons/Exchange'
import TopGradient from './TopGradient'
import KeyboardContent from '../KeyboardContent'
import useExperimental from '../../hooks/useExperimental'
import { darken } from '../../styles/helpers'

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
  developerMode: boolean,
}

const IconDev = () => (
  <div
    style={{
      width: 16,
      height: 16,
      fontSize: 10,
      fontFamily: 'monospace',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {'DEV'}
  </div>
)

const TagContainer = () => {
  const isExperimental = useExperimental()

  return isExperimental ? (
    <Box
      justifyContent="center"
      m={4}
      style={{
        flexGrow: 1,
        alignItems: 'center',
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
    this.push('/')
    this.props.openModal(MODAL_SEND)
  }
  handleOpenReceiveModal = () => {
    this.push('/')
    this.props.openModal(MODAL_RECEIVE)
  }
  handleClickManager = () => this.push('/manager')
  handleClickAccounts = () => this.push('/accounts')
  handleClickExchange = () => this.push('/partners')
  handleClickDev = () => this.push('/dev')

  render() {
    const { t, noAccounts, location, developerMode } = this.props
    const { pathname } = location

    return (
      <Box relative bg="white" style={{ width: 230 }}>
        <TopGradient />
        <GrowScroll>
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
            {developerMode && (
              <KeyboardContent sequence="DEVTOOLS">
                <SideBarListItem
                  label={t('sidebar.developer')}
                  icon={IconDev}
                  iconActiveColor="wallet"
                  onClick={this.handleClickDev}
                  isActive={pathname === '/dev'}
                />
              </KeyboardContent>
            )}
            <Space of={30} />
          </SideBarList>
          <Space grow />
          <TagContainer />
        </GrowScroll>
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
