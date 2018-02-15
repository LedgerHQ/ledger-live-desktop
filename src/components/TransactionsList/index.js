// @flow

import React, { Component } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'

import type { Transaction as TransactionType } from 'types/common'

import Box from 'components/base/Box'
import Defer from 'components/base/Defer'
import FormattedVal from 'components/base/FormattedVal'
import Text from 'components/base/Text'

import IconCurrencyBitcoin from 'icons/currencies/Bitcoin'

const DATE_COL_SIZE = 80
const ACCOUNT_COL_SIZE = 150
const AMOUNT_COL_SIZE = 150

const Cap = styled(Text).attrs({
  fontSize: 2,
  color: 'warmGrey',
  ff: 'Museo Sans|Bold',
})`
  text-transform: uppercase;
`

const Day = styled(Text).attrs({
  color: 'dark',
  fontSize: 3,
  ff: 'Open Sans',
})`
  letter-spacing: 0.3px;
  text-transform: uppercase;
`

const Hour = styled(Day).attrs({
  color: 'warmGrey',
})``

const HeaderCol = ({ size, children, ...props }: { size?: number, children: any }) => (
  <Cell size={size} {...props}>
    <Cap>{children}</Cap>
  </Cell>
)

HeaderCol.defaultProps = {
  size: undefined,
}

const TransactionRaw = styled(Box).attrs({
  horizontal: true,
  align: 'center',
})`
  border-bottom: 1px solid ${p => p.theme.colors.argile};
  height: 68px;

  &:last-child {
    border-bottom: 0;
  }
`

const Cell = styled(Box).attrs({
  px: 4,
  horizontal: true,
  align: 'center',
})`
  width: ${p => (p.size ? `${p.size}px` : '')};
`

const Transaction = ({ tx }: { tx: TransactionType }) => {
  const time = moment(tx.received_at)
  return (
    <TransactionRaw>
      <Cell size={DATE_COL_SIZE} justify="space-between">
        <Box>
          <Day>{time.format('DD MMM')}</Day>
          <Hour>{time.format('HH:mm')}</Hour>
        </Box>
      </Cell>
      {tx.account && (
        <Cell size={ACCOUNT_COL_SIZE} horizontal flow={2}>
          <Box align="center" justify="center" style={{ color: '#fcb653' }}>
            <IconCurrencyBitcoin height={16} width={16} />
          </Box>
          <Box ff="Open Sans|SemiBold" fontSize={4} color="dark">
            {tx.account.name}
          </Box>
        </Cell>
      )}
      <Cell
        grow
        shrink
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          display: 'block',
        }}
      >
        <Box ff="Open Sans" fontSize={3} color="lead">
          {tx.balance > 0 ? 'From' : 'To'}
        </Box>
        <Box color="dark" ff="Open Sans" fontSize={3}>
          {tx.balance > 0 ? get(tx, 'inputs.0.address') : get(tx, 'outputs.0.address')}
        </Box>
      </Cell>
      <Cell size={AMOUNT_COL_SIZE} justify="flex-end">
        <FormattedVal val={tx.balance} currency="BTC" showCode fontSize={4} alwaysShowSign />
      </Cell>
    </TransactionRaw>
  )
}

type Props = {
  transactions: Array<TransactionType>,
  withAccounts?: boolean,
}

class TransactionsList extends Component<Props> {
  static defaultProps = {
    withAccounts: false,
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.transactions !== this.props.transactions) {
      this._hashCache = this.getHashCache(nextProps.transactions)
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    return !isEqual(this._hashCache, this.getHashCache(nextProps.transactions))
  }

  getHashCache = (transactions: Array<TransactionType>) => transactions.map(t => t.hash)

  _hashCache = this.getHashCache(this.props.transactions)

  render() {
    const { transactions, withAccounts } = this.props

    return (
      <Box flow={1}>
        <Box horizontal pt={4}>
          <HeaderCol size={DATE_COL_SIZE}>{'Date'}</HeaderCol>
          {withAccounts && <HeaderCol size={ACCOUNT_COL_SIZE}>{'Account'}</HeaderCol>}
          <HeaderCol grow>{'Address'}</HeaderCol>
          <HeaderCol size={AMOUNT_COL_SIZE} justify="flex-end">
            {'Amount'}
          </HeaderCol>
        </Box>
        <Defer>
          <Box>
            {transactions.map(t => (
              <Transaction key={`{${t.hash}-${t.account ? t.account.id : ''}`} tx={t} />
            ))}
          </Box>
        </Defer>
      </Box>
    )
  }
}

export default TransactionsList
