// @flow

import React, { useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { BigNumber } from 'bignumber.js'
import { Trans } from 'react-i18next'
import type { Unit } from '@ledgerhq/live-common/lib/types'
import {
  inferDynamicRange,
  reverseRangeIndex,
  projectRangeIndex,
} from '@ledgerhq/live-common/lib/range'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import CurrencyUnitValue from 'components/CurrencyUnitValue'
import Slider from 'components/Slider'
import IconExclamationCircle from 'icons/ExclamationCircle'
import GenericContainer from './GenericContainer'
import TranslatedError from '../../components/TranslatedError'

type Props = {
  value: BigNumber,
  onChange: BigNumber => void,
  unit: Unit,
  error: Error,
  defaultValue: BigNumber,
}

const Error = styled.div`
  align-items: center;
  color: ${p => p.theme.colors.alertRed};
  display: flex;
  > :first-child {
    margin-right: 5px;
  }
`

export function useDynamicRange({
  value,
  defaultValue,
  onChange,
}: {
  value: BigNumber,
  defaultValue: BigNumber,
  onChange: BigNumber => void,
}) {
  const range = useMemo(() => inferDynamicRange(defaultValue), [defaultValue])
  const index = reverseRangeIndex(range, value)
  const setValueIndex = useCallback((i: number) => onChange(projectRangeIndex(range, i)), [
    range,
    onChange,
  ])
  const constraintValue = projectRangeIndex(range, index)
  return { range, index, constraintValue, setValueIndex }
}

const FeeSliderField = ({ value, onChange, unit, error, defaultValue }: Props) => {
  const { range, index, constraintValue, setValueIndex } = useDynamicRange({
    value,
    defaultValue,
    onChange,
  })

  return (
    <GenericContainer
      header={
        <div style={{ fontFamily: 'Inter', textAlign: 'right' }}>
          <Text color="#999" fontSize={4}>
            <CurrencyUnitValue value={constraintValue} unit={unit} />
          </Text>{' '}
          <Text color="#767676" fontSize={4}>
            {unit.code}
          </Text>
        </div>
      }
    >
      <Box flex={1} pt={2}>
        <Slider error={error} value={index} onChange={setValueIndex} steps={range.steps} />
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

export default FeeSliderField
