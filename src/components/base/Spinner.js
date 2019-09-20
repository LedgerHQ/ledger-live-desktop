// @flow

import React from 'react'
import styled, { keyframes, css } from 'styled-components'

import Box from 'components/base/Box'
import IconLoader from 'icons/Loader'

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
`

export const Rotating = styled(Box)`
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  animation: ${p =>
    p.isRotating === false
      ? 'none'
      : css`
          ${rotate} 1s linear infinite
        `};
  transition: 100ms linear transform;
`

export default function Spinner({ size, ...props }: { size: number }) {
  return (
    <Rotating size={size} {...props}>
      <IconLoader size={size} />
    </Rotating>
  )
}
