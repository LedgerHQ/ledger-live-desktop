// @flow

import React, { PureComponent } from 'react'
import { openModal } from 'reducers/modals'
import { toggleStarAction } from 'actions/settings'
import type { Account } from '@ledgerhq/live-common/lib/types/account'
import { connect } from 'react-redux'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'
import IconStar from 'icons/Star'
import IconAccountSettings from 'icons/AccountSettings'
import ContextMenuItem from './ContextMenuItem'
import { MODAL_RECEIVE, MODAL_SEND, MODAL_SETTINGS_ACCOUNT } from '../../config/constants'

type Props = {
  account: Account,
  children: any,
  toggleStarAction: Function,
  openModal: Function,
}

const mapDispatchToProps = {
  openModal,
  toggleStarAction,
}

class AccountContextMenu extends PureComponent<Props> {
  getContextMenuItems = () => {
    const { openModal, toggleStarAction, account } = this.props
    const items = [
      {
        label: 'accounts.contextMenu.send',
        Icon: IconSend,
        callback: () => openModal(MODAL_SEND, { account }),
      },
      {
        label: 'accounts.contextMenu.receive',
        Icon: IconReceive,
        callback: () => openModal(MODAL_RECEIVE, { account }),
      },
    ]

    if (account.type === 'Account') {
      items.push({
        label: 'accounts.contextMenu.edit',
        Icon: IconAccountSettings,
        callback: () => openModal(MODAL_SETTINGS_ACCOUNT, { account }),
      })
    }

    items.push({
      label: 'accounts.contextMenu.star',
      Icon: IconStar,
      callback: () => toggleStarAction(account.id),
    })

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
