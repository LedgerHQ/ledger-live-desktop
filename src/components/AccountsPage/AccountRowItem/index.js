// @flow

import React, { PureComponent } from 'react'
import Box from 'components/base/Box'
import type { Account } from '@ledgerhq/live-common/lib/types/account'
import type { PortfolioRange } from '@ledgerhq/live-common/lib/types/portfolio'
import { openModal } from 'reducers/modals'
import { connect } from 'react-redux'
import { GenericBox } from '../index'
import CryptoCurrencyIcon from '../../CryptoCurrencyIcon'
import Ellipsis from '../../base/Ellipsis'
import Balance from './Balance'
import Countervalue from './Countervalue'
import Delta from './Delta'
import AccountSyncStatusIndicator from '../AccountSyncStatusIndicator'
import ContextMenuItem from '../../ContextMenu/ContextMenuItem'
import IconSend from '../../../icons/Send'
import IconReceive from '../../../icons/Receive'
import IconAccountSettings from '../../../icons/AccountSettings'
import { MODAL_RECEIVE, MODAL_SEND, MODAL_SETTINGS_ACCOUNT } from '../../../config/constants'

type Props = {
  account: Account,
  onClick: Account => void,
  hidden?: boolean,
  range: PortfolioRange,
  openModal: Function,
}

const mapDispatchToProps = {
  openModal,
}

class AccountRowItem extends PureComponent<Props> {
  onClick = () => {
    const { account, onClick } = this.props
    onClick(account)
  }

  contextMenuItems = [
    {
      label: 'accounts.contextMenu.send',
      Icon: IconSend,
      callback: () => this.props.openModal(MODAL_SEND, { account: this.props.account }),
    },
    {
      label: 'accounts.contextMenu.receive',
      Icon: IconReceive,
      callback: () => this.props.openModal(MODAL_RECEIVE, { account: this.props.account }),
    },
    {
      label: 'accounts.contextMenu.edit',
      Icon: IconAccountSettings,
      callback: () => this.props.openModal(MODAL_SETTINGS_ACCOUNT, { account: this.props.account }),
    },
  ]

  render() {
    const { account, range, hidden } = this.props
    return (
      <ContextMenuItem items={this.contextMenuItems}>
        <GenericBox style={{ display: hidden && 'none' }} flex={1} onClick={this.onClick}>
          <Box horizontal ff="Open Sans|SemiBold" flow={3} flex="30%" alignItems="center">
            <Box
              alignItems="center"
              justifyContent="center"
              style={{ color: account.currency.color }}
            >
              <CryptoCurrencyIcon currency={account.currency} size={20} />
            </Box>
            <Box grow>
              <Box style={{ textTransform: 'uppercase' }} fontSize={9} color="graphite">
                {account.currency.name}
              </Box>
              <Ellipsis fontSize={12} color="dark">
                {account.name}
              </Ellipsis>
            </Box>
          </Box>
          <Box flex="10%">
            <AccountSyncStatusIndicator accountId={account.id} account={account} />
          </Box>
          <Balance flex="35%" account={account} />
          <Countervalue flex="15%" account={account} range={range} />
          <Delta flex="10%" account={account} range={range} />
        </GenericBox>
      </ContextMenuItem>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(AccountRowItem)
