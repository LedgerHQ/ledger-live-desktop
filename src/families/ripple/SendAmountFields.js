// @flow

import React, { useCallback } from 'react'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import type { Account, Transaction, TransactionStatus } from '@ledgerhq/live-common/lib/types'
import { getAccountUnit } from '@ledgerhq/live-common/lib/account'
import styled from 'styled-components'
import InputCurrency from 'components/base/InputCurrency'
import Box from 'components/base/Box'
import invariant from 'invariant'
import GenericContainer from 'components/FeesContainer'

type Props = {
  account: Account,
  transaction: Transaction,
  status: TransactionStatus,
  onChange: Transaction => void,
}

const InputRight = styled(Box).attrs(() => ({
  ff: 'Inter',
  color: 'palette.text.shade80',
  fontSize: 4,
  justifyContent: 'center',
  pr: 3,
}))``

function FeesField({ account, transaction, onChange, status }: Props) {
  invariant(transaction.family === 'ripple', 'FeeField: ripple family expected')

  const bridge = getAccountBridge(account)

  const onChangeFee = useCallback(fee => onChange(bridge.updateTransaction(transaction, { fee })), [
    transaction,
    onChange,
    bridge,
  ])

  const { errors } = status
  const { fee: feeError } = errors
  const { fee } = transaction
  const defaultUnit = getAccountUnit(account)

  return (
    <GenericContainer>
      <InputCurrency
        defaultUnit={defaultUnit}
        renderRight={<InputRight>{defaultUnit.code}</InputRight>}
        containerProps={{ grow: true }}
        loading={!feeError && !fee}
        error={feeError}
        value={fee}
        onChange={onChangeFee}
      />
    </GenericContainer>
  )
}

export default {
  component: FeesField,
  fields: ['fee'],
}
