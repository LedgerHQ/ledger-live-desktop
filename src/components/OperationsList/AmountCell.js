// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { getOperationAmountNumber } from '@ledgerhq/live-common/lib/operation'
import type { Currency, Unit, Operation } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'
import CounterValue from 'components/CounterValue'
import FormattedVal from 'components/base/FormattedVal'

const Cell = styled(Box).attrs({
  px: 4,
  horizontal: false,
  alignItems: 'flex-end',
})`
  width: 150px;
  text-align: right;
`

type Props = {
  operation: Operation,
  currency: Currency,
  unit: Unit,
}

class AmountCell extends PureComponent<Props> {
  render() {
    const { currency, unit, operation } = this.props
    const amount = getOperationAmountNumber(operation)
    return (
      <Cell>
        <FormattedVal
          val={amount}
          unit={unit}
          showCode
          fontSize={4}
          alwaysShowSign
          color={amount.isNegative() ? 'smoke' : undefined}
        />
        <CounterValue
          color="grey"
          fontSize={3}
          alwaysShowSign
          date={operation.date}
          currency={currency}
          value={amount}
        />
      </Cell>
    )
  }
}

export default AmountCell
