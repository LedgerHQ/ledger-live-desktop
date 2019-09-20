// @flow

import React from 'react'
import styled from 'styled-components'

import { rgba } from 'styles/helpers'

import Box from 'components/base/Box'

const Overlay = styled(({ sticky, ...props }) => <Box sticky {...props} />)`
  background-color: ${p => rgba(p.theme.colors.palette.text.shade100, 0.4)};
  position: fixed;
`

export default Overlay
