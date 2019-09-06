// @flow

import React, { PureComponent } from 'react'
import { openModal } from 'reducers/modals'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types/account'
import { connect } from 'react-redux'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'
import IconStar from 'icons/Star'
import IconAccountSettings from 'icons/AccountSettings'
import ContextMenuItem from './ContextMenuItem'
import { MODAL_RECEIVE, MODAL_SEND, MODAL_SETTINGS_ACCOUNT } from '../../config/constants'
import { toggleStarAction } from '../../actions/settings'

type Props = {
  account: TokenAccount | Account,
  parentAccount: ?Account,
  leftClick?: boolean,
  children: any,
  openModal: Function,
  toggleStarAction: Function,
  withStar?: boolean,
}

const mapDispatchToProps = {
  openModal,
  toggleStarAction,
}

class AccountContextMenu extends PureComponent<Props> {
  getContextMenuItems = () => {
    const { openModal, account, parentAccount, withStar, toggleStarAction } = this.props
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

    if (withStar) {
      items.push({
        label: 'accounts.contextMenu.star',
        Icon: IconStar,
        callback: () => toggleStarAction(account.id),
      })
    }

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
    const { leftClick, children } = this.props
    return (
      <ContextMenuItem leftClick={leftClick} items={this.getContextMenuItems()}>
        {children}
      </ContextMenuItem>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(AccountContextMenu)
