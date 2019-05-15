// @flow
import React from 'react'
import styled from 'styled-components'

import NanoS from './NanoS'
import NanoX from './NanoX'
import Blue from './Blue'

type TypeProps = {
  type: 'nanoS' | 'nanoX' | 'blue',
}

export type Props = {
  wire?: 'wired' | 'disconnecting' | 'connecting',
  action?: 'left' | 'accept',
  screen?: 'validation' | 'home' | 'pin' | 'empty' | 'update' | 'recoveryMode' | 'recovery',
  width?: number,
  error?: ?Error,
}

export const Wrapper = styled.div`
  position: relative;
`

const Interactions = ({ type = 'nanoS', ...rest }: TypeProps & Props) =>
  type === 'blue' ? (
    <Blue {...rest} />
  ) : type === 'nanoX' ? (
    <NanoX {...rest} />
  ) : (
    <NanoS {...rest} />
  )

export default Interactions
