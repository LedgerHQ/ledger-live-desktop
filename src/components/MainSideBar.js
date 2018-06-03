// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { getCryptoCurrencyIcon } from '@ledgerhq/live-common/lib/react'

import type { Location } from 'react-router'
import type { Account } from '@ledgerhq/live-common/lib/types'

import type { T } from 'types/common'
import type { UpdateStatus } from 'reducers/update'

import { MODAL_RECEIVE, MODAL_SEND } from 'config/constants'

import { accountsSelector } from 'reducers/accounts'
import { openModal } from 'reducers/modals'
import { getUpdateStatus } from 'reducers/update'

import { SideBarList } from 'components/base/SideBar'
import Box, { Tabbable } from 'components/base/Box'
import Space from 'components/base/Space'
import FormattedVal from 'components/base/FormattedVal'

import IconManager from 'icons/Manager'
import IconPieChart from 'icons/PieChart'
import IconPlus from 'icons/Plus'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'
import IconExchange from 'icons/Exchange'

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
  push(to: string) {
    const { push } = this.props
    const {
      location: { pathname },
    } = this.props
    if (pathname === to) {
      return
    }
    push(to)
  }

  render() {
    const { t, accounts, openModal, location, updateStatus } = this.props
    const { pathname } = location

    const navigationItems = [
      {
        value: 'dashboard',
        label: t('dashboard:title'),
        icon: IconPieChart,
        iconActiveColor: 'wallet',
        onClick: () => this.push('/'),
        isActive: pathname === '/',
        hasNotif: updateStatus === 'downloaded',
      },
      {
        value: 'send',
        label: t('send:title'),
        icon: IconSend,
        iconActiveColor: 'wallet',
        onClick: () => openModal(MODAL_SEND),
      },
      {
        value: 'receive',
        label: t('receive:title'),
        icon: IconReceive,
        iconActiveColor: 'wallet',
        onClick: () => openModal(MODAL_RECEIVE),
      },
      {
        value: 'manager',
        label: t('sidebar:manager'),
        icon: IconManager,
        iconActiveColor: 'wallet',
        onClick: () => this.push('/manager'),
        isActive: pathname === '/manager',
      },
      {
        value: 'exchange',
        label: t('sidebar:exchange'),
        icon: IconExchange,
        iconActiveColor: 'wallet',
        onClick: () => this.push('/exchange'),
        isActive: pathname === '/exchange',
      },
    ]

    const accountsItems = accounts.map(account => {
      const accountURL = `/account/${account.id}`
      return {
        value: account.id,
        label: account.name,
        desc: () => (
          <FormattedVal
            alwaysShowSign={false}
            color="graphite"
            unit={account.unit}
            showCode
            val={account.balance || 0}
          />
        ),
        iconActiveColor: account.currency.color,
        icon: getCryptoCurrencyIcon(account.currency),
        onClick: () => this.push(accountURL),
        isActive: pathname === accountURL,
      }
    })

    return (
      <Box bg="white" style={{ width: 230 }}>
        <Space of={60} />
        <SideBarList items={navigationItems} />
        <Space of={40} />
        <SideBarList
          scroll
          title={t('sidebar:menu')}
          titleRight={
            <PlusWrapper onClick={() => openModal('importAccounts')}>
              <IconPlus size={16} />
            </PlusWrapper>
          }
          items={accountsItems}
        />
      </Box>
    )
  }
}

const PlusWrapper = styled(Tabbable).attrs({
  p: 1,
  cursor: 'pointer',
  borderRadius: 1,
})`
  opacity: 0.4;
  &:hover {
    opacity: 1;
  }

  border: 1px dashed rgba(0, 0, 0, 0);
  &:focus {
    border: 1px dashed rgba(0, 0, 0, 0.2);
    outline: none;
  }
`

const decorate = compose(withRouter, translate(), connect(mapStateToProps, mapDispatchToProps))
export default decorate(MainSideBar)
