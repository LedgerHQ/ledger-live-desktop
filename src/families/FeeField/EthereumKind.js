// @flow

import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import styled from 'styled-components'
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
import IconExclamationCircle from 'icons/ExclamationCircle'
import GenericContainer from './GenericContainer'
import TranslatedError from '../../components/TranslatedError'

type Props = {
  account: Account,
  transaction: *,
  onChange: (*) => void,
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

const fallbackGasPrice = BigNumber(10000000000)

const handledErrors = ['NotEnoughGas']

const FeesField = ({ fees, account, transaction, onChange }: Props & { fees?: Fees }) => {
  const bridge = getAccountBridge(account)
  const [error, setError] = useState(null)
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
    [bridge, account, transaction, onChange],
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
  }, [gasPrice, defaultGas])

  useEffect(() => {
    let ignored = false
    bridge.checkValidTransaction(account, transaction).then(
      () => {
        if (ignored) return
        setError(null)
      },
      error => {
        if (ignored) return
        setError(handledErrors.includes(error.name) ? error : null)
      },
    )
    return () => {
      ignored = true
    }
  }, [bridge, account, transaction])

  return (
    <GenericContainer
      header={
        <div style={{ fontFamily: 'Inter', textAlign: 'right' }}>
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
        <GasSlider error={error} defaultGas={defaultGas} value={value} onChange={onChangeF} />
      </Box>
      <Box
        ff="Inter|SemiBold"
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
          <Box color="alertRed" ff="Inter|Regular" fontSize={4} textAlign="center">
            <TranslatedError error={error} />
          </Box>
        </Error>
      )}
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
