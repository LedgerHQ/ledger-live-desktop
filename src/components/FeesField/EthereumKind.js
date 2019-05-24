// @flow

import React, { useEffect, useMemo, useRef, useCallback } from 'react'
import { Trans } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import noop from 'lodash/noop'
import type { Account } from '@ledgerhq/live-common/lib/types'
import {
  inferDynamicRange,
  reverseRangeIndex,
  projectRangeIndex,
} from '@ledgerhq/live-common/lib/range'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import CurrencyUnitValue from 'components/CurrencyUnitValue'
import Slider from 'components/Slider'
import type { Fees } from '@ledgerhq/live-common/lib/api/Fees'
import WithFeesAPI from '../WithFeesAPI'
import GenericContainer from './GenericContainer'

type Props = {
  account: Account,
  gasPrice: ?BigNumber,
  onChange: BigNumber => void,
}

const GasSlider = React.memo(({ defaultGas, value, onChange }: *) => {
  const range = useMemo(() => inferDynamicRange(defaultGas), [defaultGas])
  const index = reverseRangeIndex(range, value)
  const setValueIndex = useCallback(i => onChange(projectRangeIndex(range, i)), [range, onChange])
  return <Slider value={index} onChange={setValueIndex} steps={range.steps} />
})

const fallbackGasPrice = BigNumber(0.01 * 10000000000)

const FeesField = ({ fees, account, gasPrice, onChange }: Props & { fees?: Fees }) => {
  const { units } = account.currency
  const unit = units.length > 1 ? units[1] : units[0]
  const serverGas = fees && fees.gas_price ? BigNumber(fees.gas_price) : null
  const defaultGas = serverGas || fallbackGasPrice
  const value = gasPrice || defaultGas

  // as soon as a serverGas is fetched, we set it in the tx
  useEffect(
    () => {
      if (!gasPrice && serverGas) {
        onChange(serverGas)
      }
    },
    [gasPrice, serverGas, onChange],
  )

  const latestOnChange = useRef(onChange)
  latestOnChange.current = onChange

  // If after 5s, there is still no gasPrice set, we'll set in the tx the default gas
  useEffect(
    () => {
      if (gasPrice) return noop
      const timeout = setTimeout(() => {
        if (!gasPrice) {
          latestOnChange.current(defaultGas)
        }
      }, 5000)
      return () => clearTimeout(timeout)
    },
    [gasPrice],
  )

  return (
    <GenericContainer
      header={
        <div style={{ fontFamily: 'Rubik', textAlign: 'right' }}>
          <Text color="#999" fontSize={4}>
            <CurrencyUnitValue value={value} unit={unit} />
          </Text>{' '}
          <Text color="#767676" fontSize={4}>
            {unit.code}
          </Text>
        </div>
      }
    >
      <Box flex={1} pt={2}>
        <GasSlider defaultGas={defaultGas} value={value} onChange={onChange} />
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
    </GenericContainer>
  )
}

export default (props: Props) => (
  <WithFeesAPI
    currency={props.account.currency}
    renderError={error => <FeesField {...props} error={error} />}
    renderLoading={() => <FeesField {...props} />}
    render={fees => <FeesField {...props} fees={fees} />}
  />
)
