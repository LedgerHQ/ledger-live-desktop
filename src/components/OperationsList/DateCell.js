// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import type { Operation } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import Box from 'components/base/Box'
import OperationDate from './OperationDate'

const Cell = styled(Box).attrs({
  px: 3,
  horizontal: false,
})`
  width: 120px;
`

type Props = {
  t: T,
  operation: Operation,
}

class DateCell extends PureComponent<Props> {
  static defaultProps = {
    withAccount: false,
  }

  render() {
    const { t, operation } = this.props
    return (
      <Cell>
        <Box ff="Open Sans|SemiBold" fontSize={3} color="smoke">
          {t(`app:operation.type.${operation.type}`)}
        </Box>
        <OperationDate date={operation.date} />
      </Cell>
    )
  }
}

export default DateCell
