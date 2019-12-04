// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import IconHelp from 'icons/Help'

import Label from './Label'
import { rgba } from '../../styles/helpers'

const Wrapper = styled(Label).attrs(() => ({
  ff: 'Inter|SemiBold',
  color: 'wallet',
  fontSize: 4,
  align: 'center',
}))`
  display: flex;
  cursor: pointer;

  &:hover {
    color: ${p => rgba(p.theme.colors.wallet, 0.9)};
  }
`

type Props = { onClick: ?() => void, label?: React$Node, children?: React$Node, style?: * }

// can add more dynamic options if needed
export function LinkHelp({ onClick, label, children, style }: Props) {
  return (
    <Wrapper onClick={onClick} style={style}>
      <Box mr={1}>
        <IconHelp size={12} />
      </Box>
      <span>{label || children}</span>
    </Wrapper>
  )
}

export default LinkHelp
