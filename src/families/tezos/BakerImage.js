// @flow
import React from 'react'
import styled from 'styled-components'
import type { Baker } from '@ledgerhq/live-common/lib/families/tezos/bakers'
import Box from 'components/base/Box'

const Circle = styled(Box).attrs(props => ({
  style: {
    width: props.size,
    height: props.size,
  },
}))`
  border-radius: 50%;
  overflow: hidden;
`

const Img = styled.img.attrs(props => ({
  style: {
    width: props.size,
    height: props.size,
  },
}))``

type Props = {
  size?: number,
  baker: ?Baker,
}

const BakerImage = ({ size = 24, baker }: Props) => (
  <Circle size={size}>
    <Img
      src={baker ? baker.logoURL : null} // TODO: Fallback for custom validator
      alt={baker ? baker.name : 'Custom validator'}
      size={size}
    />
  </Circle>
)

export default BakerImage
