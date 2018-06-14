// @flow
import React from 'react'
import styled from 'styled-components'
import { radii } from 'styles/theme'

import Box from 'components/base/Box'
import IconSensitiveOperationShield from 'icons/illustrations/SensitiveOperationShield'

// GENERAL
export const Title = styled(Box).attrs({
  ff: 'Museo Sans|Regular',
  fontSize: 7,
  color: 'dark',
})`
  max-width: 550px;
  text-align: center;
`

export const Description = styled(Box).attrs({
  ff: 'Museo Sans|Light',
  fontSize: 5,
  lineHeight: 1.5,
  textAlign: 'center',
  color: 'grey',
})`
  margin: 10px auto 25px;
  max-width: 570px;
`
export const Inner = styled(Box).attrs({
  horizontal: true,
  grow: true,
  flow: 4,
})``

export const FixedTopContainer = styled(Box).attrs({
  sticky: true,
  mt: 170,
  backgroundColor: 'red',
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
export function OptionRow({ step }: { step: StepType }) {
  const { icon, desc } = step
  return (
    <Box horizontal m={'7px'} style={{ minWidth: 420 }}>
      <Box justify="center">{icon}</Box>
      <Box justify="center" shrink>
        <OptionRowDesc>{desc}</OptionRowDesc>
      </Box>
    </Box>
  )
}
export const OptionRowDesc = styled(Box).attrs({
  ff: 'Open Sans|Regular',
  fontSize: 4,
  textAlign: 'left',
  color: 'smoke',
  grow: true,
  pl: 2,
})``

export const IconOptionRow = styled(Box).attrs({
  ff: 'Rubik|Regular',
  fontSize: 14,
  color: 'wallet',
})``

export function DisclaimerBox({ disclaimerNotes, ...p }: { disclaimerNotes: any }) {
  return (
    <DisclaimerBoxContainer {...p}>
      <Box m={3} relative>
        <DisclaimerBoxIconContainer>
          <IconSensitiveOperationShield />
        </DisclaimerBoxIconContainer>
        {disclaimerNotes.map(note => <OptionRow key={note.key} step={note} />)}
      </Box>
    </DisclaimerBoxContainer>
  )
}

const DisclaimerBoxContainer = styled(Box).attrs({
  shrink: 1,
  grow: true,
  borderRadius: '4px',
  bg: '#f9f9f980',
})`
  min-width: 620px;
  border: 1px dashed ${p => p.theme.colors.fog};
`
const DisclaimerBoxIconContainer = styled(Box).attrs({
  color: p => p.theme.colors.alertRed,
})`
  position: absolute;
  top: 0;
  right: 0;
`
