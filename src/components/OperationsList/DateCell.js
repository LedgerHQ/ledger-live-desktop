// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import type { Operation } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import Box from 'components/base/Box'
import OperationDate from './OperationDate'

const Cell = styled(Box).attrs(() => ({
  px: 3,
  horizontal: false,
}))`
  width: ${p => (p.compact ? 90 : 120)}px;
`

type Props = {
  t: T,
  operation: Operation,
  text?: string,
  compact?: boolean,
}

class DateCell extends PureComponent<Props> {
  static defaultProps = {
    withAccount: false,
  }

  render() {
    const { t, operation, compact, text } = this.props
    const ellipsis = {
      display: 'block',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    }

    return (
      <Cell compact={compact}>
        <Box ff="Inter|SemiBold" fontSize={3} color="palette.text.shade80" style={ellipsis}>
          {text || t(`operation.type.${operation.type}`)}
        </Box>
        <OperationDate date={operation.date} />
      </Cell>
    )
  }
}

export default DateCell
