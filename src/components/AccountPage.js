// @flow

import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { formatCurrencyUnit } from 'ledger-wallet-common/lib/data/currency'

import type { MapStateToProps } from 'react-redux'
import type { Account, AccountData } from 'types/common'

import { getAccountById, getAccountData } from 'reducers/accounts'

import Box, { Card } from 'components/base/Box'
import Text from 'components/base/Text'

type Props = {
  account: Account,
  accountData: AccountData,
}

const mapStateToProps: MapStateToProps<*, *, *> = (state, props) => ({
  account: getAccountById(state, props.match.params.id),
  accountData: getAccountData(state, props.match.params.id),
})

function formatBTC(v) {
  return formatCurrencyUnit(
    {
      name: 'bitcoin',
      code: 'BTC',
      symbol: 'b',
      magnitude: 8,
    },
    v,
    true,
    true,
  )
}

class AccountPage extends PureComponent<Props> {
  render() {
    const { account, accountData } = this.props

    return (
      <Box p={3} flow={3}>
        <Box>
          <Text fontSize={4}>{`${account.name} account`}</Text>
        </Box>
        {accountData && (
          <Fragment>
            <Box horizontal flow={3}>
              <Box flex={1}>
                <Card title="Balance">{formatBTC(accountData.balance)}</Card>
              </Box>
              <Box flex={1}>
                <Card title="Receive" />
              </Box>
            </Box>
            <Card title="Last operations">
              {accountData.transactions.map(tr => (
                <Box horizontal key={tr.hash}>
                  <Box grow>{'-'}</Box>
                  <Box>{formatBTC(tr.balance)}</Box>
                </Box>
              ))}
            </Card>
          </Fragment>
        )}
      </Box>
    )
  }
}

export default connect(mapStateToProps)(AccountPage)
