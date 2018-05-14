// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import IconAnalytics from 'icons/LockScreen'
import CheckBox from 'components/base/CheckBox'
import { Title, Description, OnboardingFooter } from '../helperComponents'

import type { StepProps } from '..'

export default (props: StepProps) => {
  const { nextStep, prevStep } = props
  return (
    <Box sticky alignItems="center" justifyContent="center">
      <Box align="center">
        <Title>This is ANALYTICS screen. 1 line is the maximum</Title>
        <Description>
          This is a long text, please replace it with the final wording once it’s done.
          <br />
          Lorem ipsum dolor amet ledger lorem dolor ipsum amet
        </Description>
        <DeviceIcon>
          <IconAnalytics size={136} />
        </DeviceIcon>
        <Box horizontal flow={2} align="center">
          <CheckBox isChecked />
          <AnalyticsText>
            This is a long text, please replace it with the final wording once it’s done.
            <br />
            Lorem ipsum dolor amet ledger lorem dolor ipsum amet
          </AnalyticsText>
        </Box>
        <Box horizontal flow={2} align="center">
          <CheckBox isChecked={false} />
          <AnalyticsText>
            This is a long text, please replace it with the final wording once it’s done.
            <br />
            Lorem ipsum dolor amet ledger lorem dolor ipsum amet
          </AnalyticsText>
        </Box>
      </Box>
      <OnboardingFooter horizontal align="center" justify="flex-end" flow={2}>
        <Button small outline onClick={() => prevStep()}>
          Go Back
        </Button>
        <Button small primary onClick={() => nextStep()}>
          Continue
        </Button>
      </OnboardingFooter>
    </Box>
  )
}

export const AnalyticsText = styled(Box).attrs({
  ff: 'Open Sans|Regular',
  fontSize: 4,
  textAlign: 'left',
  color: 'smoke',
})`
  margin: 10px auto 25px;
  padding-left: 10px;
`
const DeviceIcon = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  color: 'graphite',
})`
  width: 55px;
`
