// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { saveSettings } from 'actions/settings'
import Box from 'components/base/Box'
import CheckBox from 'components/base/CheckBox'
import { Title, Description, FixedTopContainer, StepContainerInner } from '../helperComponents'
import OnboardingFooter from '../OnboardingFooter'

import type { StepProps } from '..'

const mapDispatchToProps = { saveSettings }

type State = {
  analyticsToggle: boolean,
  sentryLogsToggle: boolean,
}

const INITIAL_STATE = {
  analyticsToggle: false,
  sentryLogsToggle: true,
}

class Analytics extends PureComponent<StepProps, State> {
  state = INITIAL_STATE

  handleSentryLogsToggle = (isChecked: boolean) => {
    this.setState({ sentryLogsToggle: !this.state.sentryLogsToggle })
    this.props.saveSettings({
      sentryLogs: isChecked,
    })
  }
  handleAnalyticsToggle = (isChecked: boolean) => {
    this.setState({ analyticsToggle: !this.state.analyticsToggle })
    this.props.saveSettings({
      shareAnalytics: isChecked,
    })
  }

  handleNavBack = () => {
    const { savePassword, prevStep } = this.props
    savePassword(undefined)
    prevStep()
  }

  render() {
    const { nextStep, t } = this.props
    const { analyticsToggle, sentryLogsToggle } = this.state

    return (
      <FixedTopContainer>
        <StepContainerInner>
          <Title>{t('onboarding:analytics.title')}</Title>
          <Description>{t('onboarding:analytics.desc')}</Description>
          <Box mt={5}>
            <Container>
              <Box>
                <AnalyticsTitle>{t('onboarding:analytics.sentryLogs.title')}</AnalyticsTitle>
                <AnalyticsText>{t('onboarding:analytics.sentryLogs.desc')}</AnalyticsText>
              </Box>
              <Box justifyContent="center">
                <CheckBox isChecked={sentryLogsToggle} onChange={this.handleSentryLogsToggle} />
              </Box>
            </Container>
            <Container>
              <Box>
                <AnalyticsTitle>{t('onboarding:analytics.shareAnalytics.title')}</AnalyticsTitle>
                <AnalyticsText>{t('onboarding:analytics.shareAnalytics.desc')}</AnalyticsText>
              </Box>
              <Box justifyContent="center">
                <CheckBox isChecked={analyticsToggle} onChange={this.handleAnalyticsToggle} />
              </Box>
            </Container>
          </Box>
        </StepContainerInner>
        <OnboardingFooter
          horizontal
          align="center"
          flow={2}
          t={t}
          nextStep={nextStep}
          prevStep={this.handleNavBack}
        />
      </FixedTopContainer>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(Analytics)

export const AnalyticsText = styled(Box).attrs({
  ff: 'Open Sans|Regular',
  fontSize: 3,
  textAlign: 'left',
  color: 'smoke',
})`
  max-width: 400px;
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
  p: 3,
})`
  width: 550px;
  justify-content: space-between;
`
