// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { createStructuredSelector } from 'reselect'
import moment from 'moment'
import noop from 'lodash/noop'
import { getCryptoCurrencyIcon } from '@ledgerhq/live-common/lib/react'

import type { Account, Operation as OperationType } from '@ledgerhq/live-common/lib/types'

import type { T } from 'types/common'

import { currencySettingsForAccountSelector, marketIndicatorSelector } from 'reducers/settings'
import { rgba, getMarketColor } from 'styles/helpers'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import CounterValue from 'components/CounterValue'
import FormattedVal from 'components/base/FormattedVal'

import ConfirmationCheck from './ConfirmationCheck'

const mapStateToProps = createStructuredSelector({
  currencySettings: currencySettingsForAccountSelector,
  marketIndicator: marketIndicatorSelector,
})

const DATE_COL_SIZE = 100
const ACCOUNT_COL_SIZE = 150
const AMOUNT_COL_SIZE = 150
const CONFIRMATION_COL_SIZE = 44

const OperationRaw = styled(Box).attrs({
  horizontal: true,
  alignItems: 'center',
})`
  cursor: pointer;
  border-bottom: 1px solid ${p => p.theme.colors.lightGrey};
  height: 68px;

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    background: ${p => rgba(p.theme.colors.wallet, 0.04)};
  }
`

const Address = ({ value }: { value: string }) => {
  if (!value) {
    return <Box />
  }

  const addrSize = value.length / 2

  const left = value.slice(0, 10)
  const right = value.slice(-addrSize)
  const middle = value.slice(10, -addrSize)

  return (
    <Box horizontal color="smoke" ff="Open Sans" fontSize={3}>
      <div>{left}</div>
      <AddressEllipsis>{middle}</AddressEllipsis>
      <div>{right}</div>
    </Box>
  )
}

const AddressEllipsis = styled.div`
  display: block;
  flex-shrink: 1;
  min-width: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  color: 'grey',
})``

const Cell = styled(Box).attrs({
  px: 4,
  horizontal: true,
  alignItems: 'center',
})`
  width: ${p => (p.size ? `${p.size}px` : '')};
  overflow: ${p => (p.noOverflow ? 'hidden' : '')};
`

type Props = {
  account: Account,
  currencySettings: *,
  onAccountClick: Function,
  onOperationClick: Function,
  marketIndicator: string,
  t: T,
  op: OperationType,
  withAccount: boolean,
}

class Operation extends PureComponent<Props> {
  static defaultProps = {
    onAccountClick: noop,
    onOperationClick: noop,
    withAccount: false,
  }

  render() {
    const {
      account,
      currencySettings,
      onAccountClick,
      onOperationClick,
      t,
      op,
      withAccount,
      marketIndicator,
    } = this.props
    const { unit, currency } = account
    const time = moment(op.date)
    const Icon = getCryptoCurrencyIcon(account.currency)
    const isNegative = op.amount < 0
    const type = !isNegative ? 'from' : 'to'

    const marketColor = getMarketColor({
      marketIndicator,
      isNegative,
    })

    return (
      <OperationRaw onClick={() => onOperationClick({ operation: op, account, type, marketColor })}>
        <Cell size={CONFIRMATION_COL_SIZE} align="center" justify="flex-start">
          <ConfirmationCheck
            type={type}
            minConfirmations={currencySettings.minConfirmations}
            confirmations={account.blockHeight - op.blockHeight}
            marketColor={marketColor}
            t={t}
          />
        </Cell>
        <Cell size={DATE_COL_SIZE} justifyContent="space-between" px={3}>
          <Box>
            <Box ff="Open Sans|SemiBold" fontSize={3} color="smoke">
              {t(`operationsList:${type}`)}
            </Box>
            <Hour>{time.format('HH:mm')}</Hour>
          </Box>
        </Cell>
        {withAccount &&
          account && (
            <Cell
              noOverflow
              size={ACCOUNT_COL_SIZE}
              horizontal
              flow={2}
              style={{ cursor: 'pointer' }}
              onClick={e => {
                e.stopPropagation()
                onAccountClick(account)
              }}
            >
              <Box
                alignItems="center"
                justifyContent="center"
                style={{ color: account.currency.color }}
              >
                {Icon && <Icon size={16} />}
              </Box>
              <Box ff="Open Sans|SemiBold" fontSize={3} color="dark">
                {account.name}
              </Box>
            </Cell>
          )}
        <Cell grow shrink style={{ display: 'block' }}>
          <Address value={op.address} />
        </Cell>
        <Cell size={AMOUNT_COL_SIZE} justify="flex-end">
          <Box alignItems="flex-end">
            <FormattedVal
              val={op.amount}
              unit={unit}
              showCode
              fontSize={4}
              alwaysShowSign
              color={op.amount < 0 ? 'smoke' : undefined}
            />
            <CounterValue
              color="grey"
              fontSize={3}
              date={time.toDate()}
              currency={currency}
              value={op.amount}
              exchange={currencySettings.exchange}
            />
          </Box>
        </Cell>
      </OperationRaw>
    )
  }
}

export default connect(mapStateToProps)(Operation)
