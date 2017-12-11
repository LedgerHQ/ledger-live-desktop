// @flow

import React from 'react'
import styled from 'styled-components'
import {
  space,
  borderColor,
  borderWidth,
  fontSize,
  color,
  alignItems,
  justifyContent,
} from 'styled-system'

const spacingScale = [0, 8, 16, 32, 64]

function getSpace(n) {
  return `${spacingScale[n] || n}px`
}

const Box = styled.div`
  ${space};
  ${fontSize};
  ${color};
  ${alignItems};
  ${justifyContent};
  ${borderColor};
  ${borderWidth};

  display: flex;
  flex-shrink: ${p => (p.noShrink === true ? '0' : '')};
  flex-grow: ${p => (p.grow === true ? '1' : p.grow || '')};
  flex-direction: ${p => (p.horizontal ? 'row' : 'column')};

  overflow-y: ${p => (p.scroll === true ? 'auto' : '')};
  position: ${p => (p.relative ? 'relative' : p.sticky ? 'absolute' : '')};

  ${p =>
    p.sticky &&
    `
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    `};

  > * + * {
    margin-top: ${p => (!p.horizontal && p.flow ? getSpace(p.flow) : '')};
    margin-left: ${p => (p.horizontal && p.flow ? getSpace(p.flow) : '')};
  }
`

export const GrowScroll = (props: *) => (
  <Box grow relative>
    <Box sticky scroll {...props} />
  </Box>
)

export default Box
