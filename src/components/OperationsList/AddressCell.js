// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import type { Operation } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'

const Address = ({ value }: { value: string }) => {
  if (!value) {
    return <Box />
  }

  const quarter = Math.round(value.length / 4)

  // FIXME why not using CSS for this? meaning we might be able to have a left & right which both take 50% & play with overflow & text-align
  const left = value.slice(0, quarter)
  const middle = value.slice(quarter, -quarter)
  const right = value.slice(-quarter)

  return (
    <Box horizontal color="palette.text.shade80" ff="Inter" fontSize={3}>
      <Left>{left}</Left>
      <Middle>{middle}</Middle>
      <Right>{right}</Right>
    </Box>
  )
}

const Left = styled.div`
  overflow: hidden;
  white-space: nowrap;
`

const Right = styled.div`
  overflow: hidden;
  white-space: nowrap;
  direction: rtl;
`

const Middle = styled.div`
  display: block;
  flex-shrink: 1;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 1em;
`

const Cell = styled(Box).attrs(() => ({
  px: 4,
  horizontal: true,
  alignItems: 'center',
}))`
  width: 150px;
`

type Props = {
  operation: Operation,
}

class AddressCell extends PureComponent<Props> {
  render() {
    const { operation } = this.props

    return (
      <Cell grow shrink style={{ display: 'block' }}>
        <Address
          value={
            operation.type === 'IN' || operation.type === 'REVEAL'
              ? operation.senders[0]
              : operation.recipients[0]
          }
        />
      </Cell>
    )
  }
}

export default AddressCell
