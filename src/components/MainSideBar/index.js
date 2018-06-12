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
import Space from 'components/base/Space'

import IconManager from 'icons/Manager'
import IconPieChart from 'icons/PieChart'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'
import IconExchange from 'icons/Exchange'

import AccountListItem from './AccountListItem'
import AddAccountButton from './AddAccountButton'

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

    const navigationItems = [
      {
        key: 'dashboard',
        label: t('dashboard:title'),
        icon: IconPieChart,
        iconActiveColor: 'wallet',
        onClick: this.handleClickDashboard,
        isActive: pathname === '/',
        hasNotif: updateStatus === 'downloaded',
      },
      {
        key: 'send',
        label: t('send:title'),
        icon: IconSend,
        iconActiveColor: 'wallet',
        onClick: this.handleOpenSendModal,
      },
      {
        key: 'receive',
        label: t('receive:title'),
        icon: IconReceive,
        iconActiveColor: 'wallet',
        onClick: this.handleOpenReceiveModal,
      },
      {
        key: 'manager',
        label: t('sidebar:manager'),
        icon: IconManager,
        iconActiveColor: 'wallet',
        onClick: this.handleClickManager,
        isActive: pathname === '/manager',
      },
      {
        key: 'exchange',
        label: t('sidebar:exchange'),
        icon: IconExchange,
        iconActiveColor: 'wallet',
        onClick: this.handleClickExchange,
        isActive: pathname === '/exchange',
      },
    ]

    return (
      <Box bg="white" style={{ width: 230 }}>
        <Space of={70} />
        <SideBarList title={t('sidebar:menu')}>
          {navigationItems.map(item => <SideBarListItem key={item.key} {...item} />)}
        </SideBarList>

        <Space of={40} />

        <SideBarList
          scroll
          title={t('sidebar:accounts')}
          titleRight={
            <AddAccountButton
              tooltipText={t('importAccounts:title')}
              onClick={this.handleOpenImportModal}
            />
          }
          emptyText={t('emptyState:sidebar.text')}
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
