// @flow

import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'

import type { MapStateToProps } from 'react-redux'
import type { Account, AccountData } from 'types/common'

import { formatBTC } from 'helpers/format'

import { getAccountById, getAccountData } from 'reducers/accounts'

import TransactionsList from 'components/TransactionsList'
import Box, { Card } from 'components/base/Box'
import Text from 'components/base/Text'
import ReceiveBox from 'components/ReceiveBox'

type Props = {
  account: Account,
  accountData: AccountData,
}

const mapStateToProps: MapStateToProps<*, *, *> = (state, props) => ({
  account: getAccountById(state, props.match.params.id),
  accountData: getAccountData(state, props.match.params.id),
})

class AccountPage extends PureComponent<Props> {
  render() {
    const { account, accountData } = this.props

    return (
      <Box flow={3}>
        <Box>
          <Text fontSize={4}>{`${account.name} account`}</Text>
        </Box>
        {accountData && (
          <Fragment>
            <Box horizontal flow={3}>
              <Box grow>
                <Card title="Balance" style={{ height: 435 }} align="center" justify="center">
                  <Text fontSize={5}>{formatBTC(accountData.balance)}</Text>
                </Card>
              </Box>

              <Box style={{ width: 300 }}>
                <Card title="Receive" flow={3}>
                  <ReceiveBox address={accountData.address} />
                </Card>
              </Box>
            </Box>
            <Card title="Last operations">
              <TransactionsList transactions={accountData.transactions} />
            </Card>
          </Fragment>
        )}
      </Box>
    )
  }
}

export default connect(mapStateToProps)(AccountPage)
