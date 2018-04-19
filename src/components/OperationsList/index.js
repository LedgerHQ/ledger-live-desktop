// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { getIconByCoinType } from '@ledgerhq/currencies/react'
import {
  groupAccountOperationsByDay,
  groupAccountsOperationsByDay,
} from '@ledgerhq/wallet-common/lib/helpers/account'
import type { Account, Operation as OperationType } from '@ledgerhq/wallet-common/lib/types'

import noop from 'lodash/noop'
import keyBy from 'lodash/keyBy'

import { getMarketColor, rgba } from 'styles/helpers'

import type { Settings, T } from 'types/common'

import { MODAL_OPERATION_DETAILS } from 'config/constants'

import { openModal } from 'reducers/modals'

import IconAngleDown from 'icons/AngleDown'

import Box, { Card } from 'components/base/Box'
import CounterValue from 'components/CounterValue'
import FormattedVal from 'components/base/FormattedVal'
import Text from 'components/base/Text'
import Defer from 'components/base/Defer'

import ConfirmationCheck from './ConfirmationCheck'

const DATE_COL_SIZE = 100
const ACCOUNT_COL_SIZE = 150
const AMOUNT_COL_SIZE = 150
const CONFIRMATION_COL_SIZE = 44

const calendarOpts = {
  sameDay: 'LL – [Today]',
  nextDay: 'LL – [Tomorrow]',
  lastDay: 'LL – [Yesterday]',
  lastWeek: 'LL',
  sameElse: 'LL',
}

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
    background: ${p => rgba(p.theme.colors.wallet, 0.04)};
  }
`

const Cell = styled(Box).attrs({
  px: 4,
  horizontal: true,
  alignItems: 'center',
})`
  width: ${p => (p.size ? `${p.size}px` : '')};
  overflow: ${p => (p.noOverflow ? 'hidden' : '')};
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
  minConfirmations,
  onAccountClick,
  onOperationClick,
  t,
  op,
  withAccount,
  marketIndicator,
}: {
  account: Account,
  minConfirmations: number,
  onAccountClick: Function,
  onOperationClick: Function,
  t: T,
  op: OperationType,
  withAccount?: boolean,
  marketIndicator: string,
}) => {
  const { unit, currency } = account
  const time = moment(op.date)
  const Icon = getIconByCoinType(account.currency.coinType)
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
          confirmations={op.confirmations}
          marketColor={marketColor}
          minConfirmations={minConfirmations}
          t={t}
          type={type}
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
            ticker={currency.units[0].code}
            value={op.amount}
          />
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
  settings: state.settings,
})

const mapDispatchToProps = {
  openModal,
}

type Props = {
  account: Account,
  accounts: Account[],
  canShowMore: boolean,
  onAccountClick?: Function,
  openModal: Function,
  t: T,
  withAccount?: boolean,
  nbToShow: number,
  title?: string,
  settings: Settings,
}

export class OperationsList extends PureComponent<Props> {
  static defaultProps = {
    onAccountClick: noop,
    withAccount: false,
    canShowMore: false,
    nbToShow: 20,
  }

  handleClickOperation = (data: Object) => this.props.openModal(MODAL_OPERATION_DETAILS, data)

  render() {
    const {
      account,
      accounts,
      canShowMore,
      nbToShow,
      onAccountClick,
      settings,
      t,
      title,
      withAccount,
    } = this.props

    if (!account && !accounts) {
      console.warn('Preventing render OperationsList because not received account or accounts') // eslint-disable-line no-console
      return null
    }
    const groupedOperations = accounts
      ? groupAccountsOperationsByDay(accounts, nbToShow)
      : groupAccountOperationsByDay(account, nbToShow)

    const accountsMap = accounts ? keyBy(accounts, 'id') : { [account.id]: account }

    return (
      <Defer>
        <Box flow={4}>
          {title && (
            <Text color="dark" ff="Museo Sans" fontSize={6}>
              {title}
            </Text>
          )}
          {groupedOperations.map(group => {
            const d = moment(group.day)
            return (
              <Box flow={2} key={group.day.toISOString()}>
                <Box ff="Open Sans|SemiBold" fontSize={4} color="grey">
                  {d.calendar(null, calendarOpts)}
                </Box>
                <Card p={0}>
                  {group.data.map(op => {
                    const account = accountsMap[op.accountId]
                    if (!account) {
                      return null
                    }
                    return (
                      <Operation
                        account={account}
                        key={`${account.id}-${op.hash}`}
                        marketIndicator={settings.marketIndicator}
                        minConfirmations={account.minConfirmations}
                        onAccountClick={onAccountClick}
                        onOperationClick={this.handleClickOperation}
                        op={op}
                        t={t}
                        withAccount={withAccount}
                      />
                    )
                  })}
                </Card>
              </Box>
            )
          })}
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
