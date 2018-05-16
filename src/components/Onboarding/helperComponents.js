// @flow
import React from 'react'
import styled from 'styled-components'
import { radii } from 'styles/theme'

import Box from 'components/base/Box'

// GENERAL
export const Title = styled(Box).attrs({
  width: 267,
  height: 27,
  ff: 'Museo Sans|Regular',
  fontSize: 7,
  color: 'dark',
})``

export const Description = styled(Box).attrs({
  width: 714,
  height: 48,
  ff: 'Museo Sans|Light',
  fontSize: 5,
  lineHeight: 1.5,
  textAlign: 'center',
  color: 'grey',
})`
  margin: 10px auto 25px;
`
export const Inner = styled(Box).attrs({
  horizontal: true,
  grow: true,
  flow: 4,
})``

// FOOTER
export const OnboardingFooter = styled(Box).attrs({
  px: 5,
  py: 3,
})`
  border-top: 2px solid ${p => p.theme.colors.lightGrey};
  border-bottom-left-radius: ${radii[1]}px;
  border-bottom-right-radius: ${radii[1]}px;
`

// INSTRUCTION LIST
type StepType = {
  icon: any,
  desc: string,
}
export function InstructionStep({ step }: { step: StepType }) {
  const { icon, desc } = step
  return (
    <Box horizontal>
      <Box justify="center" color="grey" style={{ width: 26 }}>
        {icon}
      </Box>
      <Box ff="Open Sans|Regular" justify="center" fontSize={4} style={{ paddingLeft: 10 }} shrink>
        <InstructionStepDesc>{desc}</InstructionStepDesc>
      </Box>
    </Box>
  )
}
export const InstructionStepDesc = styled(Box).attrs({
  ff: 'Open Sans|Regular',
  fontSize: 4,
  textAlign: 'left',
  lineHeight: 1.69,
  color: 'smoke',
  shrink: 1,
})``

export const IconInstructionStep = styled(Box).attrs({
  width: 26,
  height: 26,
  ff: 'Rubik|Regular',
  textAlign: 'center',
  fontSize: 3,
  color: 'wallet',
})`
  border-radius: 100%;
  background: #6490f126;
  line-height: 2;
`
