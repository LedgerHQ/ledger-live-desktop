/* eslint-disable react/no-unused-prop-types */
// @flow

import React from 'react'
import styled from 'styled-components'
import type { Currency, Unit } from '@ledgerhq/live-common/lib/types/currencies'
import { getCurrencyColor } from '@ledgerhq/live-common/lib/currencies'
import { connect } from 'react-redux'
import { BigNumber } from 'bignumber.js'
import { colors } from 'styles/theme'
import type { State } from 'reducers'
import IconActivity from 'icons/Activity'
import Box from 'components/base/Box'
import CurrencyUnitValue from 'components/CurrencyUnitValue'
import {
  counterValueCurrencySelector,
  exchangeSettingsForPairSelector,
  intermediaryCurrency,
} from 'reducers/settings'
import CounterValues from 'helpers/countervalues'

type OwnProps = {
  unit?: Unit,
  from: Currency,
  to?: Currency,
  withActivityCurrencyColor?: boolean,
  withActivityColor?: string,
  withEquality?: boolean,
  date?: Date,
  color?: string,
  fontSize?: number,
  placeholder?: React$Node,
}

type Props = OwnProps & {
  effectiveUnit: Unit,
  counterValueCurrency: Currency,
  counterValue: ?BigNumber,
  value: BigNumber,
}

const PriceWrapper = styled(Box).attrs({
  ff: 'Rubik',
  horizontal: true,
})`
  line-height: 1.2;
  white-space: pre;
`

const Price = ({
  effectiveUnit,
  value,
  counterValue,
  counterValueCurrency,
  from,
  withActivityCurrencyColor,
  withActivityColor,
  withEquality,
  placeholder,
  color,
  fontSize,
}: Props) => {
  if (!counterValue || counterValue.isZero()) return placeholder || null

  const activityColor = withActivityColor
    ? colors[withActivityColor]
    : !withActivityCurrencyColor
    ? color
      ? colors[color]
      : undefined
    : getCurrencyColor(from)

  const subMagnitude = counterValue.lt(1) ? 1 : 0

  return (
    <PriceWrapper color={color} fontSize={fontSize}>
      <IconActivity size={12} style={{ color: activityColor }} />
      {' '}
      {!withEquality ? null : (
        <>
          <CurrencyUnitValue value={value} unit={effectiveUnit} showCode />
          {' = '}
        </>
      )}
      <CurrencyUnitValue
        unit={counterValueCurrency.units[0]}
        value={counterValue}
        disableRounding={!!subMagnitude}
        subMagnitude={subMagnitude}
        showCode
      />
    </PriceWrapper>
  )
}

const mapStateToProps = (state: State, props: OwnProps) => {
  const { unit, from, to, date } = props
  const effectiveUnit = unit || from.units[0]
  const value = new BigNumber(10 ** effectiveUnit.magnitude)
  const counterValueCurrency = to || counterValueCurrencySelector(state)
  const intermediary = intermediaryCurrency(from, counterValueCurrency)
  const fromExchange = exchangeSettingsForPairSelector(state, { from, to: intermediary })
  let counterValue
  if (from && to && intermediary.ticker !== from.ticker) {
    counterValue = CounterValues.calculateSelector(state, {
      from,
      to,
      exchange: fromExchange,
      value,
      date,
      disableRounding: true,
    })
  } else {
    const toExchange = exchangeSettingsForPairSelector(state, {
      from: intermediary,
      to: counterValueCurrency,
    })
    counterValue = CounterValues.calculateWithIntermediarySelector(state, {
      from,
      fromExchange,
      intermediary,
      toExchange,
      to: counterValueCurrency,
      value,
      date,
      disableRounding: true,
    })
  }

  return {
    counterValueCurrency,
    counterValue,
    value,
    effectiveUnit,
  }
}

const PriceOut: React$ComponentType<OwnProps> = connect(mapStateToProps)(Price)

export default PriceOut
