// @flow

import React, { useRef, useCallback, useMemo, useState } from 'react'
import { BigNumber } from 'bignumber.js'
import styled from 'styled-components'
import { Trans, translate } from 'react-i18next'
import last from 'lodash/last'
import type { Account, Transaction, TransactionStatus } from '@ledgerhq/live-common/lib/types'
import InputCurrency from 'components/base/InputCurrency'
import Select from 'components/base/Select'
import Box from 'components/base/Box'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import invariant from 'invariant'
import GenericContainer from './GenericContainer'

type Props = {
  account: Account,
  transaction: Transaction,
  onChange: Transaction => void,
  status: TransactionStatus,
}

const InputRight = styled(Box).attrs(() => ({
  ff: 'Inter',
  color: 'palette.text.shade80',
  fontSize: 4,
  justifyContent: 'center',
  pr: 3,
}))``

const fallbackFeeItems = [
  {
    label: 'standard',
    value: 'standard',
    blockCount: 0,
    feePerByte: BigNumber(0),
  },
  {
    label: 'custom',
    value: 'custom',
    blockCount: 0,
    feePerByte: BigNumber(0),
  },
]

const FeesField = ({ transaction, account, onChange, status }: Props) => {
  invariant(transaction.family === 'bitcoin', 'FeeField: bitcoin family expected')

  const bridge = getAccountBridge(account)
  const { feePerByte, networkInfo } = transaction
  const inputRef = useRef()

  const feeItems = useMemo(
    () =>
      networkInfo
        ? [
            ...networkInfo.feeItems.items.map(fee => ({
              label: fee.speed,
              value: fee.speed,
              feePerByte: fee.feePerByte,
            })),
            fallbackFeeItems[1],
          ]
        : fallbackFeeItems,
    [networkInfo],
  )

  const [selectedItem, setSelectedItem] = useState(last(feeItems))
  const selectedValue =
    !feePerByte || selectedItem.label === 'custom'
      ? last(feeItems)
      : selectedItem.feePerByte.eq(feePerByte) && !!selectedItem.label
      ? selectedItem
      : feeItems.find(f => f.feePerByte.eq(feePerByte)) || last(feeItems)
  const { units } = account.currency
  const satoshi = units[units.length - 1]

  const onSelectChange = useCallback(
    (item: any) => {
      setSelectedItem(item)
      if (item.label === 'custom' && inputRef.current) {
        inputRef.current.select()
        return
      }
      onChange(bridge.updateTransaction(transaction, { feePerByte: item.feePerByte }))
    },
    [onChange, transaction, bridge, setSelectedItem, inputRef],
  )

  const onInputChange = feePerByte => onSelectChange({ feePerByte })
  const { errors } = status
  const { feePerByte: feePerByteError } = errors
  const showError = networkInfo && feePerByteError

  return (
    <GenericContainer>
      <Box horizontal flow={5}>
        <Select
          menuPlacement="top"
          width={156}
          options={feeItems}
          onChange={onSelectChange}
          renderOption={({ label }) => <Trans i18nKey={`fees.${label}`} />}
          renderValue={({ data: { label } }) => <Trans i18nKey={`fees.${label}`} />}
          value={selectedValue}
        />
        <InputCurrency
          defaultUnit={satoshi}
          units={units}
          ref={inputRef}
          containerProps={{ grow: true }}
          value={feePerByte}
          onChange={onInputChange}
          loading={!feePerByte}
          error={showError && feePerByteError}
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
