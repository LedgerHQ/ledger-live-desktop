// @flow

import styled from 'styled-components'

import Box from 'components/base/Box'

const Bar = styled(Box)`
  background: ${p => p.theme.colors[p.color]};
  height: ${p => p.size || 1}px;
`

export default Bar
