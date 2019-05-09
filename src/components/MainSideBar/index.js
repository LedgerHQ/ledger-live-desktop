// @flow

import React, { PureComponent } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'

import type { Location } from 'react-router'
import type { Account } from '@ledgerhq/live-common/lib/types'

import type { T } from 'types/common'

import { MODAL_RECEIVE, MODAL_SEND } from 'config/constants'

import { accountsSelector } from 'reducers/accounts'
import { openModal } from 'reducers/modals'
import { developerModeSelector, dismissedBannersSelector } from 'reducers/settings'

import { SideBarList, SideBarListItem } from 'components/base/SideBar'

import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'
import Space from 'components/base/Space'
import UpdateDot, { Dot } from 'components/Updater/UpdateDot'
import IconManager from 'icons/Manager'
import IconWallet from 'icons/Wallet'
import IconPieChart from 'icons/PieChart'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'
import IconExchange from 'icons/Exchange'

import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { delay } from 'helpers/promise'
import TopGradient from './TopGradient'
import KeyboardContent from '../KeyboardContent'
import useExperimental from '../../hooks/useExperimental'
import { darken } from '../../styles/helpers'
import NewUpdateNotice from '../NewUpdateNotice'
import { dismissBanner } from '../../actions/settings'

const accountsBannerKey = 'accountsHelperBanner'
const mapStateToProps = state => ({
  accounts: accountsSelector(state),
  developerMode: developerModeSelector(state),
  showAccountsHelperBanner: !dismissedBannersSelector(state).includes(accountsBannerKey),
})

const mapDispatchToProps = {
  push,
  openModal,
  dismissBanner,
}

type Props = {
  t: T,
  accounts: Account[],
  location: Location,
  push: string => void,
  openModal: string => void,
  developerMode: boolean,
  showAccountsHelperBanner: boolean,
  dismissBanner: string => void,
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
  height: 22px;
  line-height: 22px;
  padding: 0 8px;
  border-radius: 4px;
  color: ${p => p.theme.colors.smoke};
  background-color: ${p => p.theme.colors.lightFog};
  text-decoration: none;

  &:hover {
    background-color: ${p => darken(p.theme.colors.lightFog, 0.05)};
  }
`

class MainSideBar extends PureComponent<Props, { reverseBanner: boolean }> {
  state = { reverseBanner: false }
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
  handleClickAccounts = () => {
    const { showAccountsHelperBanner, dismissBanner } = this.props
    if (showAccountsHelperBanner) dismissBanner(accountsBannerKey)

    this.push('/accounts')
  }
  handleClickExchange = () => this.push('/partners')
  handleClickDev = () => this.push('/dev')

  dismissUpdateBanner = () => {
    this.setState({ reverseBanner: true }, async () => {
      await delay(500)
      this.props.dismissBanner(accountsBannerKey)
    })
  }

  render() {
    const { t, accounts, location, developerMode, showAccountsHelperBanner } = this.props
    const { reverseBanner } = this.state
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
              NotifComponent={UpdateDot}
            />
            <SideBarListItem
              label={t('sidebar.accounts')}
              icon={IconWallet}
              iconActiveColor="wallet"
              isActive={pathname === '/accounts'}
              onClick={this.handleClickAccounts}
              NotifComponent={showAccountsHelperBanner ? Dot : undefined}
            />
            <SideBarListItem
              label={t('send.title')}
              icon={IconSend}
              iconActiveColor="wallet"
              onClick={this.handleOpenSendModal}
              disabled={accounts.length === 0}
            />
            <SideBarListItem
              label={t('receive.title')}
              icon={IconReceive}
              iconActiveColor="wallet"
              onClick={this.handleOpenReceiveModal}
              disabled={accounts.length === 0}
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
            {showAccountsHelperBanner && (
              <NewUpdateNotice
                reverse={reverseBanner}
                title={`${t('sidebar.newUpdate.title')}${'  '}🎉`}
                description={t('sidebar.newUpdate.description')}
                callback={this.dismissUpdateBanner}
              />
            )}
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
