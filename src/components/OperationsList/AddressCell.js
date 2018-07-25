// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import type { Operation } from '@ledgerhq/live-common/lib/types'
import Box from 'components/base/Box'

const Address = ({ value }: { value: string }) => {
  if (!value) {
    return <Box />
  }

  const addrSize = value.length / 2

  // FIXME why not using CSS for this? meaning we might be able to have a left & right which both take 50% & play with overflow & text-align
  const left = value.slice(0, 10)
  const right = value.slice(-addrSize)
  const middle = value.slice(10, -addrSize)

  return (
    <Box horizontal color="smoke" ff="Open Sans" fontSize={3}>
      <div>{left}</div>
      <AddressEllipsis>{middle}</AddressEllipsis>
      <div>{right}</div>
    </Box>
  )
}

const AddressEllipsis = styled.div`
  display: block;
  flex-shrink: 1;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Cell = styled(Box).attrs({
  px: 4,
  horizontal: true,
  alignItems: 'center',
})`
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
        <Address value={operation.type === 'IN' ? operation.senders[0] : operation.recipients[0]} />
      </Cell>
    )
  }
}

export default AddressCell
