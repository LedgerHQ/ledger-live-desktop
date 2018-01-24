// @flow

import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import moment from 'moment'

import type { MapStateToProps } from 'react-redux'
import type { Account, AccountData } from 'types/common'

import { format } from 'helpers/btc'

import { getAccountById, getAccountData } from 'reducers/accounts'

import Box, { Card } from 'components/base/Box'
import Text from 'components/base/Text'
import QRCode from 'components/base/QRCode'
import CopyToClipboard from 'components/base/CopyToClipboard'

type Props = {
  account: Account,
  accountData: AccountData,
}

const mapStateToProps: MapStateToProps<*, *, *> = (state, props) => ({
  account: getAccountById(state, props.match.params.id),
  accountData: getAccountData(state, props.match.params.id),
})

const AddressBox = styled(Box).attrs({
  borderWidth: 1,
  borderColor: 'mouse',
  bg: 'cream',
  p: 2,
})`
  text-align: center;
  word-break: break-all;
  border-radius: 3px;
  user-select: text;
`

const Action = styled(Box).attrs({
  color: 'mouse',
  fontSize: 0,
})`
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  text-transform: uppercase;

  &:hover {
    color: ${p => p.theme.colors.gray};
  }
`

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
                <Card title="Balance" style={{ height: 415 }}>
                  {format(accountData.balance)}
                </Card>
              </Box>

              <Box style={{ width: 300 }}>
                <Card title="Receive" flow={3}>
                  <Box align="center">
                    <QRCode size={150} data={accountData.address} />
                  </Box>
                  <Box align="center" flow={2}>
                    <Text fontSize={1}>{'Current address'}</Text>
                    <AddressBox>{accountData.address}</AddressBox>
                  </Box>
                  <Box horizontal>
                    <CopyToClipboard
                      data={accountData.address}
                      render={copy => (
                        <Action flex={1} onClick={copy}>
                          {'Copy'}
                        </Action>
                      )}
                    />
                    <Action flex={1}>{'Print'}</Action>
                    <Action flex={1}>{'Share'}</Action>
                  </Box>
                </Card>
              </Box>
            </Box>
            <Card title="Last operations">
              {accountData.transactions.map(tx => (
                <Box horizontal key={tx.hash}>
                  <Box grow>{moment(tx.time * 1e3).format('LLL')}</Box>
                  <Box>{format(tx.balance)}</Box>
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
