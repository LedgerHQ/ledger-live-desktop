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
import type { UpdateStatus } from 'reducers/update'

import { MODAL_RECEIVE, MODAL_SEND } from 'config/constants'

import { accountsSelector } from 'reducers/accounts'
import { openModal } from 'reducers/modals'
import { getUpdateStatus } from 'reducers/update'

import { SideBarList, SideBarListItem } from 'components/base/SideBar'
import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'
import Space from 'components/base/Space'

import IconManager from 'icons/Manager'
import IconPieChart from 'icons/PieChart'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'
import IconExchange from 'icons/Exchange'

import AccountListItem from './AccountListItem'
import AddAccountButton from './AddAccountButton'
import TopGradient from './TopGradient'

const mapStateToProps = state => ({
  accounts: accountsSelector(state),
  updateStatus: getUpdateStatus(state),
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
  updateStatus: UpdateStatus,
}

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
  handleOpenSendModal = () => this.props.openModal(MODAL_SEND)
  handleOpenReceiveModal = () => this.props.openModal(MODAL_RECEIVE)
  handleClickManager = () => this.push('/manager')
  handleClickExchange = () => this.push('/exchange')
  handleOpenImportModal = () => this.props.openModal('importAccounts')

  render() {
    const { t, accounts, location, updateStatus } = this.props
    const { pathname } = location

    const addAccountButton = (
      <AddAccountButton
        tooltipText={t('app:importAccounts.title')}
        onClick={this.handleOpenImportModal}
      />
    )

    return (
      <Box relative bg="white" style={{ width: 230 }}>
        <TopGradient />
        <GrowScroll>
          <Space of={70} />
          <SideBarList title={t('app:sidebar.menu')}>
            <SideBarListItem
              label={t('app:dashboard.title')}
              icon={IconPieChart}
              iconActiveColor={'wallet'}
              onClick={this.handleClickDashboard}
              isActive={pathname === '/'}
              hasNotif={updateStatus === 'downloaded'}
            />
            <SideBarListItem
              label={t('app:send.title')}
              icon={IconSend}
              iconActiveColor={'wallet'}
              onClick={this.handleOpenSendModal}
              disabled={accounts.length === 0}
            />
            <SideBarListItem
              label={t('app:receive.title')}
              icon={IconReceive}
              iconActiveColor={'wallet'}
              onClick={this.handleOpenReceiveModal}
              disabled={accounts.length === 0}
            />
            <SideBarListItem
              label={t('app:sidebar.manager')}
              icon={IconManager}
              iconActiveColor={'wallet'}
              onClick={this.handleClickManager}
              isActive={pathname === '/manager'}
            />
            <SideBarListItem
              label={t('app:sidebar.exchange')}
              icon={IconExchange}
              iconActiveColor={'wallet'}
              onClick={this.handleClickExchange}
              isActive={pathname === '/exchange'}
            />
          </SideBarList>
          <Space of={40} />
          <SideBarList
            title={t('app:sidebar.accounts', { count: accounts.length })}
            titleRight={addAccountButton}
            emptyText={t('app:emptyState.sidebar.text')}
          >
            {accounts.map(account => (
              <AccountListItem
                key={account.id}
                account={account}
                push={this.push}
                isActive={pathname === `/account/${account.id}`}
              />
            ))}
          </SideBarList>
          <Space of={30} />
        </GrowScroll>
      </Box>
    )
  }
}

const decorate = compose(
  withRouter,
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)
export default decorate(MainSideBar)
