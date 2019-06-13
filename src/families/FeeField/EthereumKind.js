// @flow

import React, { useEffect, useMemo, useRef, useCallback } from 'react'
import { Trans } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import noop from 'lodash/noop'
import type { Account } from '@ledgerhq/live-common/lib/types'
import type { Fees } from '@ledgerhq/live-common/lib/api/Fees'
import {
  inferDynamicRange,
  reverseRangeIndex,
  projectRangeIndex,
} from '@ledgerhq/live-common/lib/range'
import { getAccountBridge } from 'bridge'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import CurrencyUnitValue from 'components/CurrencyUnitValue'
import Slider from 'components/Slider'
import WithFeesAPI from 'components/WithFeesAPI'
import GenericContainer from './GenericContainer'

type Props = {
  account: Account,
  transaction: *,
  onChange: (*) => void,
}

const GasSlider = React.memo(({ defaultGas, value, onChange }: *) => {
  const range = useMemo(() => inferDynamicRange(defaultGas), [defaultGas])
  const index = reverseRangeIndex(range, value)
  const setValueIndex = useCallback(i => onChange(projectRangeIndex(range, i)), [range, onChange])
  return <Slider value={index} onChange={setValueIndex} steps={range.steps} />
})

const fallbackGasPrice = BigNumber(10000000000)

const FeesField = ({ fees, account, transaction, onChange }: Props & { fees?: Fees }) => {
  const bridge = getAccountBridge(account)
  const gasPrice = bridge.getTransactionExtra(account, transaction, 'gasPrice')
  const { units } = account.currency
  const unit = units.length > 1 ? units[1] : units[0]
  const serverGas = fees && fees.gas_price ? BigNumber(fees.gas_price) : null
  const defaultGas = serverGas || fallbackGasPrice
  const value = gasPrice || defaultGas

  const onChangeF = useCallback(
    value => {
      onChange(bridge.editTransactionExtra(account, transaction, 'gasPrice', value))
    },
    [bridge, account, transaction],
  )
  const latestOnChange = useRef(onChangeF)
  useEffect(() => {
    latestOnChange.current = onChangeF
  }, [onChangeF])

  // as soon as a serverGas is fetched, we set it in the tx
  useEffect(() => {
    if (!gasPrice && serverGas) {
      latestOnChange.current(serverGas)
    }
  }, [account, transaction, gasPrice, serverGas])

  // If after 5s, there is still no gasPrice set, we'll set in the tx the default gas
  useEffect(() => {
    if (gasPrice) return noop
    const timeout = setTimeout(() => {
      if (!gasPrice) {
        latestOnChange.current(defaultGas)
      }
    }, 5000)
    return () => clearTimeout(timeout)
  }, [gasPrice])

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
        <GasSlider defaultGas={defaultGas} value={value} onChange={onChangeF} />
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
