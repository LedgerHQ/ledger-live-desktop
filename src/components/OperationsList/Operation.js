// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { createStructuredSelector } from 'reselect'
import noop from 'lodash/noop'
import { getCryptoCurrencyIcon } from '@ledgerhq/live-common/lib/react'
import { getOperationAmountNumber } from '@ledgerhq/live-common/lib/helpers/operation'

import type { Account, Operation } from '@ledgerhq/live-common/lib/types'

import type { T, CurrencySettings } from 'types/common'

import { currencySettingsForAccountSelector, marketIndicatorSelector } from 'reducers/settings'
import { rgba, getMarketColor } from 'styles/helpers'

import Box from 'components/base/Box'
import CounterValue from 'components/CounterValue'
import FormattedVal from 'components/base/FormattedVal'

import OperationDate from './OperationDate'
import ConfirmationCheck from './ConfirmationCheck'

const mapStateToProps = createStructuredSelector({
  currencySettings: currencySettingsForAccountSelector,
  marketIndicator: marketIndicatorSelector,
})

const DATE_COL_SIZE = 100
const ACCOUNT_COL_SIZE = 150
const AMOUNT_COL_SIZE = 150
const CONFIRMATION_COL_SIZE = 44

const OperationRow = styled(Box).attrs({
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
  currencySettings: CurrencySettings,
  onAccountClick: (account: Account) => void,
  onOperationClick: ({ operation: Operation, account: Account, marketColor: string }) => void,
  marketIndicator: string,
  t: T,
  op: Operation, // FIXME rename it operation
  withAccount: boolean,
}

class OperationComponent extends PureComponent<Props> {
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
    const Icon = getCryptoCurrencyIcon(account.currency)
    const amount = getOperationAmountNumber(op)
    const isNegative = amount < 0
    const isOptimistic = op.blockHeight === null
    const isConfirmed =
      (op.blockHeight ? account.blockHeight - op.blockHeight : 0) > currencySettings.confirmationsNb

    const marketColor = getMarketColor({
      marketIndicator,
      isNegative,
    })

    // FIXME each cell in a component

    return (
      <OperationRow
        style={{ opacity: isOptimistic ? 0.5 : 1 }}
        onClick={() => {
          // FIXME why passing down marketColor !? we should retrieve from store / ..
          // it should just be onOperationClick(operation)
          onOperationClick({ operation: op, account, marketColor })
        }}
      >
        <Cell size={CONFIRMATION_COL_SIZE} align="center" justify="flex-start">
          <ConfirmationCheck
            type={op.type}
            isConfirmed={isConfirmed}
            marketColor={marketColor}
            t={t}
          />
        </Cell>
        <Cell size={DATE_COL_SIZE} justifyContent="space-between" px={3}>
          <Box>
            <Box ff="Open Sans|SemiBold" fontSize={3} color="smoke">
              {t(`operationsList:${op.type}`)}
            </Box>
            <OperationDate date={op.date} />
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
          <Address value={op.type === 'IN' ? op.senders[0] : op.recipients[0]} />
        </Cell>
        <Cell size={AMOUNT_COL_SIZE} justify="flex-end">
          <Box alignItems="flex-end">
            <FormattedVal
              val={amount}
              unit={unit}
              showCode
              fontSize={4}
              alwaysShowSign
              color={amount < 0 ? 'smoke' : undefined}
            />
            <CounterValue
              color="grey"
              fontSize={3}
              date={op.date}
              currency={currency}
              value={amount}
            />
          </Box>
        </Cell>
      </OperationRow>
    )
  }
}

export default connect(mapStateToProps)(OperationComponent)
