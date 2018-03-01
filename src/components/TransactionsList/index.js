// @flow

import React, { Component } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { translate } from 'react-i18next'
import get from 'lodash/get'
import noop from 'lodash/noop'
import isEqual from 'lodash/isEqual'
import { getIconByCoinType } from '@ledgerhq/currencies/react'

import type { Transaction as TransactionType, T } from 'types/common'

import Box from 'components/base/Box'
import Defer from 'components/base/Defer'
import FormattedVal from 'components/base/FormattedVal'
import Text from 'components/base/Text'
import ConfirmationCheck from './ConfirmationCheck'

const DATE_COL_SIZE = 80
const ACCOUNT_COL_SIZE = 150
const AMOUNT_COL_SIZE = 150
const CONFIRMATION_COL_SIZE = 30

const Cap = styled(Text).attrs({
  fontSize: 2,
  color: 'graphite',
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
  color: 'graphite',
})``

const HeaderCol = ({ size, children, ...props }: { size?: number, children?: any }) => (
  <Cell size={size} {...props}>
    <Cap>{children}</Cap>
  </Cell>
)

HeaderCol.defaultProps = {
  size: undefined,
  children: undefined,
}

const TransactionRaw = styled(Box).attrs({
  horizontal: true,
  alignItems: 'center',
})`
  border-bottom: 1px solid ${p => p.theme.colors.fog};
  height: 68px;

  &:last-child {
    border-bottom: 0;
  }
`

const Cell = styled(Box).attrs({
  px: 4,
  horizontal: true,
  alignItems: 'center',
})`
  width: ${p => (p.size ? `${p.size}px` : '')};
`

const Transaction = ({
  t,
  onAccountClick,
  tx,
  withAccounts,
  minConfirmations,
}: {
  t: T,
  onAccountClick?: Function,
  tx: TransactionType,
  withAccounts?: boolean,
  minConfirmations: number,
}) => {
  const time = moment(tx.receivedAt)
  const Icon = getIconByCoinType(get(tx, 'account.currency.coinType'))
  return (
    <TransactionRaw>
      <Cell size={DATE_COL_SIZE} justifyContent="space-between">
        <Box>
          <Day>{time.format('DD MMM')}</Day>
          <Hour>{time.format('HH:mm')}</Hour>
        </Box>
      </Cell>
      {withAccounts &&
        tx.account && (
          <Cell
            size={ACCOUNT_COL_SIZE}
            horizontal
            flow={2}
            style={{ cursor: 'pointer' }}
            onClick={() => onAccountClick && onAccountClick(tx.account)}
          >
            <Box
              alignItems="center"
              justifyContent="center"
              style={{ color: tx.account.currency.color }}
            >
              {Icon && <Icon size={16} />}
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
          display: 'block',
        }}
      >
        <Box ff="Open Sans" fontSize={3} color="graphite">
          {tx.balance > 0 ? t('transactionsList:from') : t('transactionsList:to')}
        </Box>
        <Box
          color="dark"
          ff="Open Sans"
          fontSize={3}
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            display: 'block',
          }}
        >
          {tx.address}
        </Box>
      </Cell>
      <Cell size={AMOUNT_COL_SIZE} justifyContent="flex-end">
        <FormattedVal
          val={tx.balance}
          unit={get(tx, 'account.unit')}
          showCode
          fontSize={4}
          alwaysShowSign
        />
      </Cell>
      <Cell size={CONFIRMATION_COL_SIZE} px={0} align="center" justify="center">
        <ConfirmationCheck minConfirmations={minConfirmations} confirmations={tx.confirmations} />
      </Cell>
    </TransactionRaw>
  )
}

Transaction.defaultProps = {
  onAccountClick: noop,
  withAccounts: false,
}

type Props = {
  t: T,
  onAccountClick?: Function,
  transactions: Array<TransactionType>,
  withAccounts?: boolean,
  minConfirmations: number,
}

class TransactionsList extends Component<Props> {
  static defaultProps = {
    onAccountClick: noop,
    withAccounts: false,
    minConfirmations: 2,
  }

  shouldComponentUpdate(nextProps: Props) {
    if (this._hashCache === null) {
      return true
    }

    return !isEqual(this._hashCache, this.getHashCache(nextProps.transactions))
  }

  getHashCache = (transactions: Array<TransactionType>) => transactions.map(t => t.hash)

  _hashCache = null

  render() {
    const { transactions, withAccounts, onAccountClick, minConfirmations, t } = this.props

    this._hashCache = this.getHashCache(transactions)

    return (
      <Box flow={1}>
        <Box horizontal pt={4}>
          <HeaderCol size={DATE_COL_SIZE}>{t('transactionsList:date')}</HeaderCol>
          {withAccounts && (
            <HeaderCol size={ACCOUNT_COL_SIZE}>{t('transactionsList:account')}</HeaderCol>
          )}
          <HeaderCol grow>{t('transactionsList:address')}</HeaderCol>
          <HeaderCol size={AMOUNT_COL_SIZE} justifyContent="flex-end">
            {t('transactionsList:amount')}
          </HeaderCol>
          <HeaderCol size={CONFIRMATION_COL_SIZE} px={0} />
        </Box>
        <Defer>
          <Box>
            {transactions.map(trans => (
              <Transaction
                t={t}
                key={`{${trans.hash}-${trans.account ? trans.account.id : ''}`}
                withAccounts={withAccounts}
                onAccountClick={onAccountClick}
                minConfirmations={minConfirmations}
                tx={trans}
              />
            ))}
          </Box>
        </Defer>
      </Box>
    )
  }
}

export default translate()(TransactionsList)
