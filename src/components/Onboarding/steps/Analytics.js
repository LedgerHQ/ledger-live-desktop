// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { saveSettings } from 'actions/settings'
import Box from 'components/base/Box'
import Switch from 'components/base/Switch'
import FakeLink from 'components/base/FakeLink'
import TrackPage from 'analytics/TrackPage'
import Track from 'analytics/Track'
import { openModal } from 'reducers/modals'
import { MODAL_SHARE_ANALYTICS, MODAL_TECHNICAL_DATA } from 'config/constants'
import ShareAnalytics from '../../modals/ShareAnalytics'
import TechnicalData from '../../modals/TechnicalData'
import { Title, Description, FixedTopContainer, StepContainerInner } from '../helperComponents'
import OnboardingFooter from '../OnboardingFooter'

import type { StepProps } from '..'

const mapDispatchToProps = { saveSettings, openModal }

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
  handleShareAnalyticsModal = () => {
    this.props.openModal(MODAL_SHARE_ANALYTICS)
  }
  handleTechnicalDataModal = () => {
    this.props.openModal(MODAL_TECHNICAL_DATA)
  }
  render() {
    const { nextStep, t, onboarding } = this.props
    const { analyticsToggle, sentryLogsToggle } = this.state

    return (
      <FixedTopContainer>
        <TrackPage
          category="Onboarding"
          name="Analytics"
          flowType={onboarding.flowType}
          deviceType={onboarding.isLedgerNano ? 'Nano S' : 'Blue'}
        />
        <StepContainerInner>
          <Title>{t('onboarding:analytics.title')}</Title>
          <Description>{t('onboarding:analytics.desc')}</Description>
          <Box mt={5}>
            <Container>
              <Box>
                <Box horizontal mb={1}>
                  <AnalyticsTitle>{t('onboarding:analytics.technicalData.title')}</AnalyticsTitle>
                  <LearnMoreWrapper>
                    <FakeLink
                      underline
                      fontSize={3}
                      color="smoke"
                      ml={2}
                      onClick={this.handleTechnicalDataModal}
                    >
                      {t('app:common.learnMore')}
                    </FakeLink>
                  </LearnMoreWrapper>
                </Box>
                <TechnicalData />
                <AnalyticsText>{t('onboarding:analytics.technicalData.desc')}</AnalyticsText>
                <MandatoryText>
                  {t('onboarding:analytics.technicalData.mandatoryText')}
                </MandatoryText>
              </Box>
              <Box justifyContent="center">
                <Switch disabled isChecked />
              </Box>
            </Container>
            <Container>
              <Box>
                <Box horizontal mb={1}>
                  <AnalyticsTitle>{t('onboarding:analytics.shareAnalytics.title')}</AnalyticsTitle>
                  <LearnMoreWrapper>
                    <FakeLink
                      style={{ textDecoration: 'underline' }}
                      fontSize={3}
                      color="smoke"
                      ml={2}
                      onClick={this.handleShareAnalyticsModal}
                    >
                      {t('app:common.learnMore')}
                    </FakeLink>
                  </LearnMoreWrapper>
                  <ShareAnalytics />
                </Box>
                <AnalyticsText>{t('onboarding:analytics.shareAnalytics.desc')}</AnalyticsText>
              </Box>
              <Box justifyContent="center">
                <Track
                  onUpdate
                  event={
                    analyticsToggle
                      ? 'Analytics Enabled Onboarding'
                      : 'Analytics Disabled Onboarding'
                  }
                />
                <Switch isChecked={analyticsToggle} onChange={this.handleAnalyticsToggle} />
              </Box>
            </Container>
            <Container>
              <Box>
                <Box mb={1}>
                  <AnalyticsTitle>{t('onboarding:analytics.sentryLogs.title')}</AnalyticsTitle>
                </Box>
                <AnalyticsText>{t('onboarding:analytics.sentryLogs.desc')}</AnalyticsText>
              </Box>
              <Box justifyContent="center">
                <Track
                  onUpdate
                  event={
                    sentryLogsToggle
                      ? 'Sentry Logs Enabled Onboarding'
                      : 'Sentry Logs Disabled Onboarding'
                  }
                />
                <Switch isChecked={sentryLogsToggle} onChange={this.handleSentryLogsToggle} />
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

const MandatoryText = styled(Box).attrs({
  ff: 'Open Sans|Regular',
  fontSize: 2,
  textAlign: 'left',
  color: 'grey',
  mt: 1,
})``
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
})``
const Container = styled(Box).attrs({
  horizontal: true,
  p: 3,
})`
  width: 550px;
  justify-content: space-between;
`
const LearnMoreWrapper = styled(Box).attrs({})`
  ${FakeLink}:hover {
    color: ${p => p.theme.colors.wallet};
  }
`
