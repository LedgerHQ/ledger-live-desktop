// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
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
        <Description>{t('onboarding:analytics.desc')}</Description>

        <Box mt={5}>
          <Container>
            <Box justify="center">
              <Box horizontal>
                <AnalyticsTitle>{t('onboarding:analytics.shareDiagnostics.title')}</AnalyticsTitle>
              </Box>
              <AnalyticsText>{t('onboarding:analytics.shareDiagnostics.desc')}</AnalyticsText>
            </Box>
            <Box alignItems="center" horizontal mx={5}>
              <CheckBox isChecked={false} />
            </Box>
          </Container>
          <Container>
            <Box justify="center">
              <Box horizontal>
                <AnalyticsTitle>{t('onboarding:analytics.shareDiagnostics.title')}</AnalyticsTitle>
              </Box>
              <AnalyticsText>{t('onboarding:analytics.shareDiagnostics.desc')}</AnalyticsText>
            </Box>
            <Box alignItems="center" horizontal mx={5}>
              <CheckBox isChecked={false} />
            </Box>
          </Container>
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
  fontSize: 3,
  textAlign: 'left',
  color: 'smoke',
})`
  max-width: 450px;
`
export const AnalyticsTitle = styled(Box).attrs({
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  textAlign: 'left',
})`
  margin-bottom: 5px;
`
const Container = styled(Box).attrs({
  horizontal: true,
  p: 5,
})`
  max-height: 90px;
  width: 620px;
`
