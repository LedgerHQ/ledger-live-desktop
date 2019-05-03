// @flow

import React, { PureComponent } from 'react'
import type { Account, PortfolioRange } from '@ledgerhq/live-common/lib/types'
import Bar from 'components/base/Bar'
import { connect } from 'react-redux'
import Box, { Card } from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'
import { openModal } from 'reducers/modals'
import AccountCardHeader from './Header'
import AccountCardBody from './Body'
import IconSend from '../../../icons/Send'
import { MODAL_RECEIVE, MODAL_SEND, MODAL_SETTINGS_ACCOUNT } from '../../../config/constants'
import IconReceive from '../../../icons/Receive'
import IconAccountSettings from '../../../icons/AccountSettings'
import ContextMenuItem from '../../ContextMenu/ContextMenuItem'

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
          style={{ cursor: 'pointer', display: hidden && 'none' }}
          p={20}
          onClick={this.onClick}
          data-e2e="dashboard_AccountCardWrapper"
        >
          <Box flow={4}>
            <AccountCardHeader account={account} />
            <Bar size={1} color="fog" />
            <Box justifyContent="center">
              <FormattedVal
                alwaysShowSign={false}
                animateTicker={false}
                ellipsis
                color="dark"
                unit={account.unit}
                showCode
                val={account.balance}
              />
            </Box>
          </Box>
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
