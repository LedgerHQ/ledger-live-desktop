// @flow

import styled from 'styled-components'
import { radii } from 'styles/theme'

import Box from 'components/base/Box'

export const OnboardingFooter = styled(Box).attrs({
  px: 5,
  py: 3,
})`
  border-top: 2px solid ${p => p.theme.colors.lightGrey};
  border-bottom-left-radius: ${radii[1]}px;
  border-bottom-right-radius: ${radii[1]}px;
`
