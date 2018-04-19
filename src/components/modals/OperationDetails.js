// @flow

import React from 'react'
import { shell } from 'electron'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import moment from 'moment'

import type { T } from 'types/common'

import { MODAL_OPERATION_DETAILS } from 'config/constants'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Bar from 'components/base/Bar'
import FormattedVal from 'components/base/FormattedVal'
import Modal, { ModalBody, ModalTitle, ModalFooter, ModalContent } from 'components/base/Modal'

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

const OperationDetails = ({ t }: { t: T }) => (
  <Modal
    name={MODAL_OPERATION_DETAILS}
    render={({ data, onClose }) => {
      const { marketColor, operation, account, type } = data

      const { name, unit, currency, minConfirmations } = account
      const { id, amount, confirmations, date, from, to } = operation

      const isConfirmed = confirmations >= minConfirmations

      return (
        <ModalBody onClose={onClose}>
          <ModalTitle>Operation details</ModalTitle>
          <ModalContent flow={4}>
            <Box alignItems="center" mt={3}>
              <ConfirmationCheck
                marketColor={marketColor}
                confirmations={confirmations}
                minConfirmations={minConfirmations}
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
                    ticker={currency.units[0].code}
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
                  {isConfirmed
                    ? t('operationDetails:confirmed')
                    : t('operationDetails:notConfirmed')}
                </Box>
                <Box>({confirmations})</Box>
              </ColRight>
            </Line>
            <B />
            <Line>
              <ColLeft>From</ColLeft>
              <ColRight>
                {from.map((v, i) => (
                  <CanSelect
                    key={i} // eslint-disable-line react/no-array-index-key
                  >
                    {v}
                  </CanSelect>
                ))}
              </ColRight>
            </Line>
            <B />
            <Line>
              <ColLeft>To</ColLeft>
              <ColRight>
                {to.map((v, i) => (
                  <CanSelect
                    key={i} // eslint-disable-line react/no-array-index-key
                  >
                    {v}
                  </CanSelect>
                ))}
              </ColRight>
            </Line>
            <B />
            <Line>
              <ColLeft>Identifier</ColLeft>
              <ColRight>
                <CanSelect>{id}</CanSelect>
              </ColRight>
            </Line>
          </ModalContent>
          <ModalFooter horizontal justify="flex-end" flow={2}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              primary
              onClick={() => shell.openExternal(`https://testnet.blockchain.info/tx/${id}`)}
            >
              View operation
            </Button>
          </ModalFooter>
        </ModalBody>
      )
    }}
  />
)

export default translate()(OperationDetails)
