// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { getDeviceModel } from '@ledgerhq/devices'

import { saveSettings } from 'actions/settings'
import Box from 'components/base/Box'
import Switch from 'components/base/Switch'
import FakeLink from 'components/base/FakeLink'
import { Trans } from 'react-i18next'
import TrackPage from 'analytics/TrackPage'
import Track from 'analytics/Track'
import { openModal } from 'reducers/modals'
import { MODAL_SHARE_ANALYTICS, MODAL_TECHNICAL_DATA } from 'config/constants'
import { openURL } from 'helpers/linking'
import { urls } from 'config/urls'
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
  analyticsToggle: true,
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

  onClickTerms = () => openURL(urls.terms)
  onClickPrivacy = () => openURL(urls.privacyPolicy)

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

    const model = getDeviceModel(onboarding.deviceModelId || 'nanoS')

    return (
      <FixedTopContainer>
        <TrackPage
          category="Onboarding"
          name="Analytics"
          flowType={onboarding.flowType}
          deviceType={model.productName}
        />
        <StepContainerInner>
          <Title data-e2e="onboarding_title">{t('onboarding.analytics.title')}</Title>
          <Description>{t('onboarding.analytics.desc')}</Description>
          <Box mt={5}>
            <Container>
              <Box>
                <Box horizontal mb={1}>
                  <AnalyticsTitle data-e2e="analytics_techData">
                    {t('onboarding.analytics.technicalData.title')}
                  </AnalyticsTitle>
                  <LearnMoreWrapper>
                    <FakeLink
                      underline
                      fontSize={3}
                      color="palette.text.shade80"
                      ml={2}
                      onClick={this.handleTechnicalDataModal}
                      data-e2e="analytics_techData_Link"
                    >
                      {t('common.learnMore')}
                    </FakeLink>
                  </LearnMoreWrapper>
                </Box>
                <TechnicalData />
                <AnalyticsText>{t('onboarding.analytics.technicalData.desc')}</AnalyticsText>
                <MandatoryText>
                  {t('onboarding.analytics.technicalData.mandatoryText')}
                </MandatoryText>
              </Box>
              <Box justifyContent="center">
                <Switch disabled isChecked />
              </Box>
            </Container>
            <Container>
              <Box>
                <Box horizontal mb={1}>
                  <AnalyticsTitle data-e2e="analytics_shareAnalytics">
                    {t('onboarding.analytics.shareAnalytics.title')}
                  </AnalyticsTitle>
                  <LearnMoreWrapper>
                    <FakeLink
                      style={{ textDecoration: 'underline' }}
                      fontSize={3}
                      color="palette.text.shade80"
                      ml={2}
                      onClick={this.handleShareAnalyticsModal}
                      data-e2e="analytics_shareAnalytics_Link"
                    >
                      {t('common.learnMore')}
                    </FakeLink>
                  </LearnMoreWrapper>
                  <ShareAnalytics />
                </Box>
                <AnalyticsText>{t('onboarding.analytics.shareAnalytics.desc')}</AnalyticsText>
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
                  <AnalyticsTitle data-e2e="analytics_reportBugs">
                    {t('onboarding.analytics.sentryLogs.title')}
                  </AnalyticsTitle>
                </Box>
                <AnalyticsText>{t('onboarding.analytics.sentryLogs.desc')}</AnalyticsText>
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
            <Container>
              <Box>
                <Box mb={1}>
                  <AnalyticsTitle data-e2e="analytics_terms">
                    {t('onboarding.analytics.terms.title')}
                  </AnalyticsTitle>
                </Box>
                <AnalyticsText>
                  <div>
                    <Trans i18nKey="onboarding.analytics.terms.desc">
                      {'Accept the '}
                      <HoveredLink onClick={this.onClickTerms}>{'terms of license'}</HoveredLink>
                      {'and'}
                      <HoveredLink onClick={this.onClickPrivacy}>{'privacy'}</HoveredLink>
                      {'.'}
                    </Trans>
                  </div>
                </AnalyticsText>
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

const MandatoryText = styled(Box).attrs(() => ({
  ff: 'Inter|Regular',
  fontSize: 2,
  textAlign: 'left',
  color: 'palette.text.shade60',
  mt: 1,
}))``
export const AnalyticsText = styled(Box).attrs(() => ({
  ff: 'Inter|Regular',
  fontSize: 3,
  textAlign: 'left',
  color: 'palette.text.shade80',
}))`
  max-width: 400px;
`
export const AnalyticsTitle = styled(Box).attrs(() => ({
  ff: 'Inter|SemiBold',
  fontSize: 4,
  textAlign: 'left',
}))``
const Container = styled(Box).attrs(() => ({
  horizontal: true,
  p: 3,
}))`
  width: 550px;
  justify-content: space-between;
`
const LearnMoreWrapper = styled(Box)`
  ${FakeLink}:hover {
    color: ${p => p.theme.colors.wallet};
  }
`

const HoveredLink = styled.span`
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: ${p => p.theme.colors.wallet};
  }
`
