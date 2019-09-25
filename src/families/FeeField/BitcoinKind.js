// @flow

import React, { useCallback } from 'react'
import { BigNumber } from 'bignumber.js'
import styled from 'styled-components'
import { Trans, translate } from 'react-i18next'
import type { Account, Transaction } from '@ledgerhq/live-common/lib/types'
import InputCurrency from 'components/base/InputCurrency'
import Select from 'components/base/Select'
import Box from 'components/base/Box'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import { FeeNotLoaded, FeeRequired } from '@ledgerhq/errors'
import invariant from 'invariant'
import GenericContainer from './GenericContainer'

type Props = {
  account: Account,
  transaction: Transaction,
  onChange: Transaction => void,
}

const InputRight = styled(Box).attrs({
  ff: 'Rubik',
  color: 'graphite',
  fontSize: 4,
  justifyContent: 'center',
  pr: 3,
})``

const FeesField = ({ transaction, account, onChange }: Props) => {
  invariant(transaction.family === 'bitcoin', 'FeeField: bitcoin family expected')

  const bridge = getAccountBridge(account)
  const { feePerByte, networkInfo } = transaction

  let feeItems = [
    {
      label: 'Standard',
      value: 'standard',
      blockCount: 0,
      feePerByte: BigNumber(0),
    },
  ]

  if (networkInfo) {
    feeItems = networkInfo.feeItems.items.map(fee => ({
      label: fee.speed,
      value: fee.speed,
      feePerByte: fee.feePerByte,
    }))
  }

  const { units } = account.currency
  const satoshi = units[units.length - 1]

  const onSelectChange = useCallback(
    ({ feePerByte }) => {
      onChange(bridge.updateTransaction(transaction, { feePerByte }))
    },
    [onChange, transaction, bridge],
  )

  const onInputChange = feePerByte => onSelectChange({ feePerByte })
  let error = !feePerByte ? new FeeNotLoaded() : feePerByte.isZero() ? new FeeRequired() : null

  return (
    <GenericContainer>
      <Box horizontal flow={5}>
        <Select menuPlacement="top" width={156} options={feeItems} onChange={onSelectChange} />
        <InputCurrency
          defaultUnit={satoshi}
          units={units}
          containerProps={{ grow: true }}
          value={feePerByte}
          onChange={onInputChange}
          loading={!feePerByte}
          error={error}
          renderRight={
            <InputRight>
              <Trans i18nKey="send.steps.amount.unitPerByte" values={{ unit: satoshi.code }} />
            </InputRight>
          }
          allowZero
        />
      </Box>
    </GenericContainer>
  )
}

export default translate()(FeesField)
