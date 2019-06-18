// @flow
import React from 'react'
import styled from 'styled-components'
import { radii } from 'styles/theme'

import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'
import IconSensitiveOperationShield from 'icons/SensitiveOperationShield'

// GENERAL
export const Title = styled(Box).attrs({
  ff: 'Museo Sans|Regular',
  fontSize: 7,
  color: 'dark',
})`
  max-width: 550px;
  text-align: center;
`

export const StepContainerInner = styled(GrowScroll).attrs({ pb: 6, align: 'center' })``

export const Description = styled(Box).attrs({
  ff: 'Museo Sans|Regular',
  fontSize: 5,
  lineHeight: 1.5,
  textAlign: 'center',
  color: 'grey',
})`
  margin: 10px auto 25px;
  max-width: 640px;
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

export const OnboardingFooterWrapper = styled(Box).attrs({
  px: 5,
  py: 3,
  horizontal: true,
})`
  border-top: 2px solid ${p => p.theme.colors.lightFog};
  border-bottom-left-radius: ${radii[1]}px;
  border-bottom-right-radius: ${radii[1]}px;
`

// INSTRUCTION LIST
type StepType = {
  icon: any,
  desc: any,
}
export function OptionRow({ step, ...p }: { step: StepType }) {
  const { icon, desc } = step
  return (
    <Box horizontal m="7px" style={{ minWidth: 420 }}>
      <Box {...p}>{icon}</Box>
      <Box justify="center" shrink>
        <OptionRowDesc>{desc}</OptionRowDesc>
      </Box>
    </Box>
  )
}
export function BulletRow({ step, ...p }: { step: StepType }) {
  const { icon, desc } = step
  return (
    <Box horizontal my="7px">
      <Box {...p} mr="7px">
        {icon}
      </Box>
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
        {disclaimerNotes.map(note => (
          <OptionRow justify="center" key={note.key} step={note} />
        ))}
      </Box>
    </DisclaimerBoxContainer>
  )
}

// Not enough styled as a warning
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

// GENUINE CHECK
export const GenuineCheckCardWrapper = styled(Box).attrs({
  horizontal: true,
  alignItems: 'center',
  p: 5,
  borderRadius: '4px',
  justify: 'flex-start',
})`
  width: 580px;
  transition: all ease-in-out 0.2s;
  color: ${p => (p.isDisabled ? p.theme.colors.grey : p.theme.colors.black)};
  border: ${p =>
    `1px ${p.isDisabled ? 'dashed' : 'solid'} ${
      p.isError ? p.theme.colors.alertRed : p.theme.colors.fog
    }`};
  pointer-events: ${p => (p.isDisabled ? 'none' : 'auto')};
  background-color: ${p => (p.isDisabled ? p.theme.colors.lightGrey : p.theme.colors.white)};
  opacity: ${p => (p.isDisabled ? 0.7 : 1)};
  &:hover {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.05);
  }
  align-items: center;
  > :nth-child(3) {
    flex-grow: 1;
    justify-content: flex-end;
  }
`
