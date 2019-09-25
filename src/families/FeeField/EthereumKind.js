// @flow

import React, { useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { BigNumber } from 'bignumber.js'
import { Trans } from 'react-i18next'
import type { Account, Transaction, TransactionStatus } from '@ledgerhq/live-common/lib/types'
import {
  inferDynamicRange,
  reverseRangeIndex,
  projectRangeIndex,
} from '@ledgerhq/live-common/lib/range'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import CurrencyUnitValue from 'components/CurrencyUnitValue'
import Slider from 'components/Slider'
import invariant from 'invariant'
import IconExclamationCircle from 'icons/ExclamationCircle'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import GenericContainer from './GenericContainer'
import TranslatedError from '../../components/TranslatedError'

type Props = {
  account: Account,
  transaction: Transaction,
  status: TransactionStatus,
  onChange: Transaction => void,
}

const Error = styled.div`
  align-items: center;
  color: ${p => p.theme.colors.alertRed};
  display: flex;
  > :first-child {
    margin-right: 5px;
  }
`

const GasSlider = React.memo(({ defaultGas, value, onChange, error }: *) => {
  const range = useMemo(() => inferDynamicRange(defaultGas), [defaultGas])
  const index = reverseRangeIndex(range, value)
  const setValueIndex = useCallback(i => onChange(projectRangeIndex(range, i)), [range, onChange])
  return <Slider error={error} value={index} onChange={setValueIndex} steps={range.steps} />
})

const fallbackGasPrice = BigNumber(10e9)

const FeesField = ({ onChange, account, transaction, status }: Props) => {
  invariant(transaction.family === 'ethereum', 'FeeField: ethereum family expected')

  const bridge = getAccountBridge(account)
  const defaultGasPrice = transaction.networkInfo
    ? transaction.networkInfo.gasPrice
    : fallbackGasPrice
  const gasPrice = transaction.gasPrice || defaultGasPrice
  const { units } = account.currency
  const unit = units.length > 1 ? units[1] : units[0]

  const error = null // TODO we need to introduce gasLimitError (or error per field...)

  // TODO^^^ use for errors?
  status

  const onGasPriceChange = useCallback(
    gasPrice => {
      onChange(bridge.updateTransaction(transaction, { gasPrice }))
    },
    [onChange, transaction, bridge],
  )

  return (
    <GenericContainer
      header={
        <div style={{ fontFamily: 'Rubik', textAlign: 'right' }}>
          <Text color="#999" fontSize={4}>
            <CurrencyUnitValue value={gasPrice} unit={unit} />
          </Text>{' '}
          <Text color="#767676" fontSize={4}>
            {unit.code}
          </Text>
        </div>
      }
    >
      <Box flex={1} pt={2}>
        <GasSlider
          error={error}
          defaultGas={defaultGasPrice}
          value={gasPrice}
          onChange={onGasPriceChange}
        />
      </Box>
      <Box
        ff="Open Sans|SemiBold"
        fontSize="11px"
        horizontal
        justifyContent="space-between"
        color="gray"
      >
        <Text>
          <Trans i18nKey="fees.slow" />
        </Text>
        <Text>
          <Trans i18nKey="fees.fast" />
        </Text>
      </Box>
      {error && (
        <Error>
          <IconExclamationCircle size={12} />
          <Box color="alertRed" ff="Open Sans|Regular" fontSize={4} textAlign="center">
            <TranslatedError error={error} />
          </Box>
        </Error>
      )}
    </GenericContainer>
  )
}

export default FeesField
