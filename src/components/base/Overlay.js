// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'

const Overlay = styled(({ sticky, ...props }) => <Box sticky {...props} />)`
  background-color: ${p => p.theme.colors.night};
  position: fixed;
`

export default Overlay
