// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import IconAnalytics from 'icons/onboarding/Analytics'
import CheckBox from 'components/base/CheckBox'
import { Title, Description } from '../helperComponents'
import OnboardingFooter from '../OnboardingFooter'

import type { StepProps } from '..'

export default (props: StepProps) => {
  const { nextStep, prevStep, t } = props
  return (
    <Box sticky pt={150}>
      <Box grow alignItems="center">
        <Title>{t('onboarding:analytics.title')}</Title>
        <Description style={{ maxWidth: 714 }}>{t('onboarding:analytics.desc')}</Description>
        <DeviceIcon style={{ padding: 15 }}>
          <IconAnalytics />
        </DeviceIcon>
        <Box horizontal flow={2} align="center">
          <CheckBox isChecked={false} />
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
      <OnboardingFooter
        horizontal
        align="center"
        flow={2}
        t={t}
        nextStep={nextStep}
        prevStep={prevStep}
      />
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
