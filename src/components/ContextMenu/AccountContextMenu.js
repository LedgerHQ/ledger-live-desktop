// @flow

import React, { PureComponent } from 'react'
import { openModal } from 'reducers/modals'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types/account'
import { connect } from 'react-redux'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'
import IconAccountSettings from 'icons/AccountSettings'
import ContextMenuItem from './ContextMenuItem'
import { MODAL_RECEIVE, MODAL_SEND, MODAL_SETTINGS_ACCOUNT } from '../../config/constants'

type Props = {
  account: TokenAccount | Account,
  parentAccount: ?Account,
  children: any,
  openModal: Function,
}

const mapDispatchToProps = {
  openModal,
}

class AccountContextMenu extends PureComponent<Props> {
  getContextMenuItems = () => {
    const { openModal, account, parentAccount } = this.props
    const items = [
      {
        label: 'accounts.contextMenu.send',
        Icon: IconSend,
        callback: () => openModal(MODAL_SEND, { account, parentAccount }),
      },
      {
        label: 'accounts.contextMenu.receive',
        Icon: IconReceive,
        callback: () => openModal(MODAL_RECEIVE, { account, parentAccount }),
      },
    ]

    if (account.type === 'Account') {
      items.push({
        label: 'accounts.contextMenu.edit',
        Icon: IconAccountSettings,
        callback: () => openModal(MODAL_SETTINGS_ACCOUNT, { account }),
      })
    }

    return items
  }

  render() {
    return (
      <ContextMenuItem items={this.getContextMenuItems()}>{this.props.children}</ContextMenuItem>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(AccountContextMenu)
