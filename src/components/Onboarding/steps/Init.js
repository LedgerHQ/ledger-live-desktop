// @flow

import React from 'react'
import styled from 'styled-components'
import { shell } from 'electron'

import Box from 'components/base/Box'
import IconUser from 'icons/User'
import { Title, Description, Inner } from '../helperComponents'

import type { StepProps } from '..'

export default (props: StepProps) => {
  const { nextStep, jumpStep } = props
  const handleOpenLink = (url: string) => () => shell.openExternal(url)
  /* TODO: all titles, descriptions to be wrapped in a translation tag once defined */
  return (
    <Box sticky alignItems="center" justifyContent="center">
      <Box align="center">
        <Title>This is the title of the screen. 1 line is the maximum</Title>
        <Description>
          This is a long text, please replace it with the final wording once it’s done.
          <br />
          Lorem ipsum dolor amet ledger lorem dolor ipsum amet
        </Description>
        <Box style={{ paddingBottom: 10 }}>
          <Inner>
            <DeviceContainer onClick={() => nextStep()}>
              {/* colors are temp, we don't have icons now */}
              <DeviceIcon style={{ color: '#66be54' }}>
                <IconUser size={24} />
              </DeviceIcon>
              <TrackChoiceTitle>Clean Nano S setup</TrackChoiceTitle>
              <Description>Please replace it with the final wording once it’s done.</Description>
            </DeviceContainer>
            <DeviceContainer onClick={() => jumpStep('choosePIN')}>
              <DeviceIcon style={{ color: '#66be54' }}>
                <IconUser size={24} />
              </DeviceIcon>
              <TrackChoiceTitle>Existing seed + Clean setup</TrackChoiceTitle>
              <Description>Please replace it with the final wording once it’s done.</Description>
            </DeviceContainer>
          </Inner>
        </Box>
        <Box>
          <Inner>
            <DeviceContainer onClick={() => nextStep()}>
              <DeviceIcon style={{ color: '#6490f1' }}>
                <IconUser size={24} />
              </DeviceIcon>
              <TrackChoiceTitle>Migrate accounts</TrackChoiceTitle>
              <Description>Please replace it with the final wording once it’s done.</Description>
            </DeviceContainer>
            <DeviceContainer onClick={handleOpenLink('https://www.ledger.fr/')}>
              <DeviceIcon style={{ color: '#ea2e41' }}>
                <IconUser size={24} />
              </DeviceIcon>
              <TrackChoiceTitle>Not a user, but would love to</TrackChoiceTitle>
              <Description>Please replace it with the final wording once it’s done.</Description>
            </DeviceContainer>
          </Inner>
        </Box>
      </Box>
    </Box>
  )
}

const DeviceContainer = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`
  width: 218px;
  height: 204px;
  border: 1px solid #d8d8d8;
`
const DeviceIcon = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  color: 'graphite',
})`
  width: 55px;
  padding: 10px;
`
export const TrackChoiceTitle = styled(Box).attrs({
  width: 152,
  height: 27,
  ff: 'Museo Sans|Regular',
  fontSize: 5,
  color: 'dark',
})``
