// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'

import type { Location } from 'react-router'
import type { Account } from '@ledgerhq/live-common/lib/types'

import type { T } from 'types/common'

import { MODAL_RECEIVE, MODAL_SEND, MODAL_ADD_ACCOUNTS } from 'config/constants'

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

const mapStateToProps = state => ({
  accounts: accountsSelector(state),
  developerMode: developerModeSelector(state),
})

const mapDispatchToProps = {
  push,
  openModal,
}

type Props = {
  t: T,
  accounts: Account[],
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
  handleOpenImportModal = () => {
    this.push('/')
    this.props.openModal(MODAL_ADD_ACCOUNTS)
  }

  render() {
    const { t, accounts, location, developerMode } = this.props
    const { pathname } = location

    // const addAccountButton = (
    //   <AddAccountButton tooltipText={t('addAccounts.title')} onClick={this.handleOpenImportModal} />
    // )
    //
    // const emptyState = (
    //   <Box relative pr={3}>
    //     <img style={{ position: 'absolute', top: -10, right: 5 }} alt="" src={i('arrow-add.svg')} />
    //     <Trans i18nKey="emptyState.sidebar.text" />
    //   </Box>
    // )

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
          </SideBarList>
          <Space of={40} />
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
