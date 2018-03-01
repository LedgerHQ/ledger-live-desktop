// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'

const UpTriangle = styled.div`
  width: 0;
  height: 0;
  border-left: ${p => p.size}px solid transparent;
  border-right: ${p => p.size}px solid transparent;
  border-bottom: ${p => p.size}px solid ${p => p.theme.colors[p.color]};
`

const DownTriangle = styled.div`
  width: 0;
  height: 0;
  border-left: ${p => p.size}px solid transparent;
  border-right: ${p => p.size}px solid transparent;
  border-top: ${p => p.size}px solid ${p => p.theme.colors[p.color]};
`

const Triangles = ({ size, color }: { size?: number, color?: string }) => (
  <Box flow={1}>
    <UpTriangle size={size} color={color} />
    <DownTriangle size={size} color={color} />
  </Box>
)

Triangles.defaultProps = { size: 5, color: 'fog' }

export default Triangles
