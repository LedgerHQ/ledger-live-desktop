// @flow

import React from 'react'
import styled, { keyframes } from 'styled-components'

import Box from 'components/base/Box'
import IconLoader from 'icons/Loader'

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const Container = styled(Box)`
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  animation: ${rotate} 1.5s linear infinite;
`

export default function Spinner({ size, ...props }: { size: number }) {
  return (
    <Container size={size} {...props}>
      <IconLoader size={size} />
    </Container>
  )
}
