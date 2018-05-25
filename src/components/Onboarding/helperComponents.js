// @flow
import React from 'react'
import styled from 'styled-components'
import { radii } from 'styles/theme'

import Box from 'components/base/Box'
import IconWarning from 'icons/onboarding/Warning'

// GENERAL
export const Title = styled(Box).attrs({
  width: 267,
  height: 27,
  ff: 'Museo Sans|Regular',
  fontSize: 7,
  color: 'dark',
})``

export const Description = styled(Box).attrs({
  ff: 'Museo Sans|Light',
  fontSize: 5,
  lineHeight: 1.5,
  textAlign: 'center',
  color: 'grey',
})`
  margin: 10px auto 25px;
  max-width: 550px;
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
export function OptionRow({ step }: { step: StepType }) {
  const { icon, desc } = step
  return (
    <Box horizontal m={2}>
      <Box justify="center">{icon}</Box>
      <Box ff="Open Sans|Regular" justify="center" fontSize={4} style={{ paddingLeft: 10 }} shrink>
        <OptionRowDesc>{desc}</OptionRowDesc>
      </Box>
    </Box>
  )
}
export const OptionRowDesc = styled(Box).attrs({
  ff: 'Open Sans|Regular',
  fontSize: 4,
  textAlign: 'left',
  lineHeight: 1.69,
  color: 'smoke',
  shrink: 1,
})``

export const IconOptionRow = styled(Box).attrs({
  ff: 'Rubik|Regular',
  fontSize: 14,
  color: 'wallet',
})``

export function DisclaimerBox({ disclaimerNotes, ...p }: { disclaimerNotes: any }) {
  return (
    <Box
      shrink
      grow
      flow={4}
      style={{
        minWidth: 680,
        backgroundColor: '#ea2e490c',
        border: 'dashed 1px #ea2e49b3',
      }}
      {...p}
    >
      <Box
        m={3}
        style={{
          position: 'relative',
        }}
      >
        <Box
          style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
          }}
        >
          <IconWarning />
        </Box>
        {disclaimerNotes.map(note => <OptionRow key={note.key} step={note} />)}
      </Box>
    </Box>
  )
}
