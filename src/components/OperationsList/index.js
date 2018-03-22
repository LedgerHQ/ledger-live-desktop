// @flow

import React, { Component } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { getIconByCoinType } from '@ledgerhq/currencies/react'
import { getDefaultUnitByCoinType } from '@ledgerhq/currencies'

import get from 'lodash/get'
import noop from 'lodash/noop'
import isEqual from 'lodash/isEqual'

import type { Account, Operation as OperationType, T } from 'types/common'

import { MODAL_OPERATION_DETAILS } from 'constants'

import { getCounterValue } from 'reducers/settings'
import { openModal } from 'reducers/modals'

import IconAngleDown from 'icons/AngleDown'

import Box, { Card } from 'components/base/Box'
import Defer from 'components/base/Defer'
import FormattedVal from 'components/base/FormattedVal'
import Text from 'components/base/Text'
import ConfirmationCheck from './ConfirmationCheck'

const DATE_COL_SIZE = 100
const ACCOUNT_COL_SIZE = 150
const AMOUNT_COL_SIZE = 150
const CONFIRMATION_COL_SIZE = 44

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
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

const AddressEllipsis = styled.div`
  display: block;
  flex-shrink: 1;
  min-width: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Address = ({ value }: { value: string }) => {
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

const Operation = ({
  account,
  counterValue,
  counterValues,
  minConfirmations,
  onAccountClick,
  onOperationClick,
  t,
  tx,
  withAccount,
}: {
  account: Account,
  counterValue: string,
  counterValues: Object | null,
  minConfirmations: number,
  onAccountClick: Function,
  onOperationClick: Function,
  t: T,
  tx: OperationType,
  withAccount?: boolean,
}) => {
  const { unit } = account
  const time = moment(tx.receivedAt)
  const Icon = getIconByCoinType(account.currency.coinType)
  const type = tx.amount > 0 ? 'from' : 'to'
  const cValue = counterValues
    ? counterValues[time.format('YYYY-MM-DD')] * (tx.amount / 10 ** unit.magnitude)
    : null

  return (
    <OperationRaw
      onClick={() =>
        onOperationClick({ operation: tx, account, type, counterValue: cValue, fiat: counterValue })
      }
    >
      <Cell size={CONFIRMATION_COL_SIZE} align="center" justify="flex-start">
        <ConfirmationCheck
          type={type}
          minConfirmations={minConfirmations}
          confirmations={tx.confirmations}
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
        <Address value={tx.address} />
      </Cell>
      <Cell size={AMOUNT_COL_SIZE}>
        <Box alignItems="flex-end">
          <FormattedVal
            val={tx.amount}
            unit={unit}
            showCode
            fontSize={4}
            alwaysShowSign
            color={tx.amount < 0 ? 'smoke' : 'positiveGreen'}
          />
          {cValue && (
            <FormattedVal
              val={cValue}
              fiat={counterValue}
              showCode
              fontSize={3}
              alwaysShowSign
              color="grey"
            />
          )}
        </Box>
      </Cell>
    </OperationRaw>
  )
}

Operation.defaultProps = {
  onAccountClick: noop,
  onOperationClick: noop,
  withAccount: false,
}

const mapStateToProps = state => ({
  counterValue: getCounterValue(state),
  counterValues: state.counterValues,
})

const mapDispatchToProps = {
  openModal,
}

type Props = {
  account: Account,
  canShowMore: boolean,
  counterValue: string,
  counterValues: Object,
  onAccountClick?: Function,
  openModal: Function,
  operations: OperationType[],
  t: T,
  title?: string,
  withAccount?: boolean,
}

export class OperationsList extends Component<Props> {
  static defaultProps = {
    account: null,
    onAccountClick: noop,
    withAccount: false,
    canShowMore: false,
  }

  shouldComponentUpdate(nextProps: Props) {
    if (this.props.account !== nextProps.account) {
      return true
    }

    if (this.props.withAccount !== nextProps.withAccount) {
      return true
    }

    if (this.props.canShowMore !== nextProps.canShowMore) {
      return true
    }

    if (this._hashCache === null) {
      return true
    }

    return !isEqual(this._hashCache, this.getHashCache(nextProps.operations))
  }

  getHashCache = (operations: OperationType[]) => operations.map(t => t.id)

  handleClickOperation = (data: Object) => this.props.openModal(MODAL_OPERATION_DETAILS, data)

  _hashCache = null

  render() {
    const {
      account,
      canShowMore,
      counterValue,
      counterValues,
      onAccountClick,
      operations,
      t,
      title,
      withAccount,
    } = this.props

    this._hashCache = this.getHashCache(operations)

    return (
      <Defer>
        <Box>
          <Card flow={1} title={title} p={0}>
            <Box>
              {operations.map(tx => {
                const acc = account || tx.account
                const unit = getDefaultUnitByCoinType(acc.coinType)
                const cValues = get(counterValues, `${unit.code}-${counterValue}.byDate`, null)

                return (
                  <Operation
                    account={acc}
                    counterValue={counterValue}
                    counterValues={cValues}
                    key={`${tx.id}${acc ? `-${acc.id}` : ''}`}
                    minConfirmations={acc.settings.minConfirmations}
                    onAccountClick={onAccountClick}
                    onOperationClick={this.handleClickOperation}
                    t={t}
                    tx={tx}
                    withAccount={withAccount}
                  />
                )
              })}
            </Box>
          </Card>
          {canShowMore && (
            <ShowMore>
              <span>{t('operationsList:showMore')}</span>
              <IconAngleDown size={12} />
            </ShowMore>
          )}
        </Box>
      </Defer>
    )
  }
}

export default compose(translate(), connect(mapStateToProps, mapDispatchToProps))(OperationsList)
