// @flow
import React from 'react'
import styled from 'styled-components'

import NanoS from './NanoS'
import NanoX from './NanoX'
import Blue from './Blue'

type TypeProps = {
  type: 'nanoS' | 'nanoX' | 'blue',
}

export type ScreenTypes =
  | 'validation'
  | 'home'
  | 'pin'
  | 'empty'
  | 'bootloaderMode'
  | 'bootloader'
  | 'recovery'
  | 'update'

export type Props = {
  wire?: 'wired' | 'disconnecting' | 'connecting',
  action?: 'left' | 'accept',
  screen?: ScreenTypes,
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
