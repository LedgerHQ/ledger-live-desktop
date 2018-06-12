// @flow

import React, { Fragment } from 'react'
import uniq from 'lodash/uniq'
import { connect } from 'react-redux'
import { shell } from 'electron'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import moment from 'moment'
import { getOperationAmountNumber } from '@ledgerhq/live-common/lib/helpers/operation'
import { getAccountOperationExplorer } from '@ledgerhq/live-common/lib/explorers'

import type { Account, Operation } from '@ledgerhq/live-common/lib/types'
import type { T, CurrencySettings } from 'types/common'

import { MODAL_OPERATION_DETAILS } from 'config/constants'
import { getMarketColor } from 'styles/helpers'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Bar from 'components/base/Bar'
import FormattedVal from 'components/base/FormattedVal'
import Modal, { ModalBody, ModalTitle, ModalFooter, ModalContent } from 'components/base/Modal'

import { createStructuredSelector, createSelector } from 'reselect'
import { accountSelector } from 'reducers/accounts'
import { currencySettingsForAccountSelector, marketIndicatorSelector } from 'reducers/settings'

import CounterValue from 'components/CounterValue'
import ConfirmationCheck from 'components/OperationsList/ConfirmationCheck'

const Line = styled(Box).attrs({
  horizontal: true,
})``

const ColLeft = styled(Box).attrs({
  color: 'smoke',
  ff: 'Open Sans',
  fontSize: 4,
})`
  width: 95px;
`
const ColRight = styled(Box).attrs({
  fontSize: 4,
  ff: 'Open Sans',
  color: 'dark',
  shrink: true,
})`
  word-break: break-all;
`

const CanSelect = styled.div`
  user-select: text;
`

const B = styled(Bar).attrs({
  color: 'lightGrey',
  size: 1,
})``

const operationSelector = createSelector(
  accountSelector,
  (_, { operationId }) => operationId,
  (account, operationId) => {
    if (!account) return null
    const operation = account.operations.find(op => op.id === operationId)
    return operation
  },
)

const mapStateToProps = createStructuredSelector({
  marketIndicator: marketIndicatorSelector,
  account: accountSelector,
  operation: operationSelector,
  currencySettings: createSelector(
    state => state,
    accountSelector,
    (state, account) => (account ? currencySettingsForAccountSelector(state, { account }) : null),
  ),
})

type Props = {
  t: T,
  operation: ?Operation,
  account: ?Account,
  currencySettings: ?CurrencySettings,
  onClose: () => void,
  marketIndicator: *,
}

const OperationDetails = connect(mapStateToProps)((props: Props) => {
  const { t, onClose, operation, account, currencySettings, marketIndicator } = props
  if (!operation || !account || !currencySettings) return null
  const { hash, date, senders, recipients, type, fee } = operation
  const { name, unit, currency } = account
  const amount = getOperationAmountNumber(operation)
  const isNegative = operation.type === 'OUT'
  const marketColor = getMarketColor({
    marketIndicator,
    isNegative,
  })
  const confirmations = operation.blockHeight ? account.blockHeight - operation.blockHeight : 0
  const isConfirmed = confirmations >= currencySettings.confirmationsNb

  const url = getAccountOperationExplorer(account, operation)
  const uniqSenders = uniq(senders)

  return (
    <ModalBody onClose={onClose}>
      <ModalTitle>Operation details</ModalTitle>
      <ModalContent flow={4}>
        <Box alignItems="center" mt={3}>
          <ConfirmationCheck
            marketColor={marketColor}
            isConfirmed={isConfirmed}
            style={{
              transform: 'scale(2)',
            }}
            t={t}
            type={type}
            withTooltip={false}
          />
          <Box mt={5} alignItems="center">
            <Box>
              <FormattedVal unit={unit} alwaysShowSign showCode val={amount} fontSize={8} />
            </Box>
            <Box mt={1}>
              <CounterValue
                color="grey"
                fontSize={5}
                date={date}
                currency={currency}
                value={amount}
              />
            </Box>
          </Box>
        </Box>
        <Line mt={4}>
          <ColLeft>Acccount</ColLeft>
          <ColRight>{name}</ColRight>
        </Line>
        <B />
        <Line>
          <ColLeft>Date</ColLeft>
          <ColRight>{moment(date).format('LLL')}</ColRight>
        </Line>
        <B />
        <Line>
          <ColLeft>Status</ColLeft>
          <ColRight color={isConfirmed ? 'positiveGreen' : null} horizontal flow={1}>
            <Box>
              {isConfirmed ? t('operationDetails:confirmed') : t('operationDetails:notConfirmed')}
            </Box>
            <Box>{`(${confirmations})`}</Box>
          </ColRight>
        </Line>
        <B />
        {fee ? (
          <Fragment>
            <Line>
              <ColLeft>Fees</ColLeft>
              <ColRight>
                <FormattedVal unit={unit} showCode val={fee} color="dark" />
              </ColRight>
            </Line>
            <B />
          </Fragment>
        ) : null}
        <Line>
          <ColLeft>From</ColLeft>
          <ColRight>{uniqSenders.map(v => <CanSelect key={v}>{v}</CanSelect>)}</ColRight>
        </Line>
        <B />
        <Line>
          <ColLeft>To</ColLeft>
          <ColRight>{recipients.map(v => <CanSelect key={v}> {v} </CanSelect>)}</ColRight>
        </Line>
        <B />
        <Line>
          <ColLeft>Identifier</ColLeft>
          <ColRight>
            <CanSelect>{hash}</CanSelect>
          </ColRight>
        </Line>
      </ModalContent>
      <ModalFooter horizontal justify="flex-end" flow={2}>
        <Button onClick={onClose}>Cancel</Button>
        {url ? (
          <Button primary onClick={() => shell.openExternal(url)}>
            View operation
          </Button>
        ) : null}
      </ModalFooter>
    </ModalBody>
  )
})

type ModalRenderProps = {
  data: {
    account: string,
    operation: string,
  },
  onClose: Function,
}

const OperationDetailsWrapper = ({ t }: { t: T }) => (
  <Modal
    name={MODAL_OPERATION_DETAILS}
    render={(props: ModalRenderProps) => {
      const { data, onClose } = props
      return <OperationDetails t={t} {...data} onClose={onClose} />
    }}
  />
)

export default translate()(OperationDetailsWrapper)
