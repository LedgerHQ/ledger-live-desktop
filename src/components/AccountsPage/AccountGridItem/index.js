// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import type { Account, PortfolioRange } from '@ledgerhq/live-common/lib/types'
import { connect } from 'react-redux'
import Box from 'components/base/Box'
import { openModal } from 'reducers/modals'
import AccountCardHeader from './Header'
import AccountCardBody from './Body'
import IconSend from '../../../icons/Send'
import { MODAL_RECEIVE, MODAL_SEND, MODAL_SETTINGS_ACCOUNT } from '../../../config/constants'
import IconReceive from '../../../icons/Receive'
import IconAccountSettings from '../../../icons/AccountSettings'
import ContextMenuItem from '../../ContextMenu/ContextMenuItem'

const Card = styled(Box).attrs({ bg: 'white', p: 3, boxShadow: 0, borderRadius: 1 })`
  cursor: pointer;
  border: 1px solid transparent;
  :hover {
    border-color: ${p => p.theme.colors.fog};
  }
`

type Props = {
  hidden?: boolean,
  account: Account,
  onClick: Account => void,
  range: PortfolioRange,
  openModal: Function,
}

const mapDispatchToProps = {
  openModal,
}

class AccountCard extends PureComponent<Props> {
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
    const { account, range, hidden, ...props } = this.props
    return (
      <ContextMenuItem items={this.contextMenuItems}>
        <Card
          {...props}
          style={{ display: hidden && 'none' }}
          p={20}
          onClick={this.onClick}
          data-e2e="dashboard_AccountCardWrapper"
        >
          <AccountCardHeader account={account} />
          <AccountCardBody account={account} range={range} />
        </Card>
      </ContextMenuItem>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(AccountCard)
