// @flow

import React, { Component } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { translate } from 'react-i18next'
import get from 'lodash/get'
import noop from 'lodash/noop'
import isEqual from 'lodash/isEqual'
import { getIconByCoinType } from '@ledgerhq/currencies/react'

import type { Account, Operation as OperationType, T } from 'types/common'

import IconAngleDown from 'icons/AngleDown'
import Box, { Card } from 'components/base/Box'
import Defer from 'components/base/Defer'
import FormattedVal from 'components/base/FormattedVal'
import Text from 'components/base/Text'
import ConfirmationCheck from './ConfirmationCheck'

const DATE_COL_SIZE = 80
const ACCOUNT_COL_SIZE = 150
const AMOUNT_COL_SIZE = 150
const CONFIRMATION_COL_SIZE = 44

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

const OperationRaw = styled(Box).attrs({
  horizontal: true,
  alignItems: 'center',
})`
  cursor: pointer;
  border-bottom: 1px solid ${p => p.theme.colors.fog};
  height: 68px;

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    background: ${p => p.theme.colors.lightGrey};
  }
`

const Cell = styled(Box).attrs({
  px: 4,
  horizontal: true,
  alignItems: 'center',
})`
  width: ${p => (p.size ? `${p.size}px` : '')};
`

const ShowMore = styled(Box).attrs({
  horizontal: true,
  flow: 1,
  ff: 'Open Sans|SemiBold',
  fontSize: 3,
  justify: 'center',
  align: 'center',
  p: 4,
  color: 'wallet',
})`
  border-top: 1px solid ${p => p.theme.colors.fog};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

const Operation = ({
  account,
  t,
  onAccountClick,
  tx,
  withAccount,
  minConfirmations,
}: {
  account: Account | null,
  t: T,
  onAccountClick?: Function,
  tx: OperationType,
  withAccount?: boolean,
  minConfirmations: number,
}) => {
  const acc = account || tx.account
  const time = moment(tx.receivedAt)
  const Icon = getIconByCoinType(get(tx, 'account.currency.coinType'))
  return (
    <OperationRaw>
      <Cell size={DATE_COL_SIZE} justifyContent="space-between">
        <Box>
          <Day>{time.format('DD MMM')}</Day>
          <Hour>{time.format('HH:mm')}</Hour>
        </Box>
      </Cell>
      {withAccount &&
        acc && (
          <Cell
            size={ACCOUNT_COL_SIZE}
            horizontal
            flow={2}
            style={{ cursor: 'pointer' }}
            onClick={() => onAccountClick && onAccountClick(acc)}
          >
            <Box alignItems="center" justifyContent="center" style={{ color: acc.currency.color }}>
              {Icon && <Icon size={16} />}
            </Box>
            <Box ff="Open Sans|SemiBold" fontSize={4} color="dark">
              {acc.name}
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
          {tx.amount > 0 ? t('operationsList:from') : t('operationsList:to')}
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
        <FormattedVal val={tx.amount} unit={acc && acc.unit} showCode fontSize={4} alwaysShowSign />
      </Cell>
      <Cell size={CONFIRMATION_COL_SIZE} px={0} align="center" justify="flex-start">
        <ConfirmationCheck
          minConfirmations={minConfirmations}
          confirmations={tx.confirmations}
          t={t}
        />
      </Cell>
    </OperationRaw>
  )
}

Operation.defaultProps = {
  onAccountClick: noop,
  withAccount: false,
}

type Props = {
  account: Account | null,
  canShowMore: boolean,
  minConfirmations: number,
  onAccountClick?: Function,
  operations: OperationType[],
  t: T,
  title?: string,
  withAccount?: boolean,
}

class OperationsList extends Component<Props> {
  static defaultProps = {
    account: null,
    onAccountClick: noop,
    withAccount: false,
    minConfirmations: 2,
    canShowMore: false,
  }

  shouldComponentUpdate(nextProps: Props) {
    if (this.props.canShowMore !== nextProps.canShowMore) {
      return true
    }

    if (this.props.minConfirmations !== nextProps.minConfirmations) {
      return true
    }

    if (this._hashCache === null) {
      return true
    }

    return !isEqual(this._hashCache, this.getHashCache(nextProps.operations))
  }

  getHashCache = (operations: OperationType[]) => operations.map(t => t.hash)

  _hashCache = null

  render() {
    const {
      account,
      canShowMore,
      minConfirmations,
      onAccountClick,
      operations,
      t,
      title,
      withAccount,
    } = this.props

    this._hashCache = this.getHashCache(operations)

    return (
      <Defer>
        <Card flow={1} title={title} p={0}>
          <Box horizontal pt={4}>
            <HeaderCol size={DATE_COL_SIZE}>{t('operationsList:date')}</HeaderCol>
            {withAccount && (
              <HeaderCol size={ACCOUNT_COL_SIZE}>{t('operationsList:account')}</HeaderCol>
            )}
            <HeaderCol grow>{t('operationsList:address')}</HeaderCol>
            <HeaderCol size={AMOUNT_COL_SIZE} justifyContent="flex-end">
              {t('operationsList:amount')}
            </HeaderCol>
            <HeaderCol size={CONFIRMATION_COL_SIZE} px={0} />
          </Box>

          <Box>
            {operations.map(tx => (
              <Operation
                account={account}
                t={t}
                key={`{${tx.hash}${tx.account ? `-${tx.account.id}` : ''}`}
                withAccount={withAccount}
                onAccountClick={onAccountClick}
                minConfirmations={minConfirmations}
                tx={tx}
              />
            ))}
          </Box>

          {canShowMore && (
            <ShowMore>
              <span>{t('operationsList:showMore')}</span>
              <IconAngleDown width={8} height={8} />
            </ShowMore>
          )}
        </Card>
      </Defer>
    )
  }
}

export default translate()(OperationsList)
