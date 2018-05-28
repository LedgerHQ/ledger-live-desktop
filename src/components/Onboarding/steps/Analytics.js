// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { saveSettings } from 'actions/settings'

import Box from 'components/base/Box'
import CheckBox from 'components/base/CheckBox'
import { Title, Description } from '../helperComponents'
import OnboardingFooter from '../OnboardingFooter'

import type { StepProps } from '..'

const mapDispatchToProps = { saveSettings }

type State = {
  analyticsToggle: boolean,
  termsConditionsToggle: boolean,
}
class Analytics extends PureComponent<StepProps, State> {
  state = {
    analyticsToggle: false,
    termsConditionsToggle: false,
  }

  handleAnalyticsToggle = isChecked => {
    console.log('what is isChecked?: ', isChecked)
    // if (isChecked) {
    this.setState({ analyticsToggle: !this.state.analyticsToggle })
    this.props.saveSettings({
      shareAnalytics: isChecked,
    })
    // } else {
    // this.props.saveSettings({
    //   shareAnalytics: false,
    // })
    // }
  }
  handleTermsToggle = isChecked => {
    this.setState({ termsConditionsToggle: !this.state.termsConditionsToggle })
  }
  render() {
    const { nextStep, prevStep, t, saveSettings } = this.props
    console.log('what is saveSettings!!??: ', saveSettings)
    const { analyticsToggle, termsConditionsToggle } = this.state

    console.log('what is analyticsToggle: ', analyticsToggle)
    return (
      <Box sticky pt={150}>
        <Box grow alignItems="center">
          <Title>{t('onboarding:analytics.title')}</Title>
          <Description>{t('onboarding:analytics.desc')}</Description>

          <Box mt={5}>
            <Container>
              <Box justify="center" style={{ width: 450 }}>
                <Box horizontal>
                  <AnalyticsTitle>{t('onboarding:analytics.shareAnalytics.title')}</AnalyticsTitle>
                </Box>
                <AnalyticsText>{t('onboarding:analytics.shareAnalytics.desc')}</AnalyticsText>
              </Box>
              <Box alignItems="center" horizontal mx={5}>
                <CheckBox isChecked={analyticsToggle} onChange={this.handleAnalyticsToggle} />
              </Box>
            </Container>
            <Container>
              <Box justify="center" style={{ width: 450 }}>
                <Box horizontal>
                  <AnalyticsTitle>{t('onboarding:analytics.termsConditions.title')}</AnalyticsTitle>
                </Box>
                <AnalyticsText>{t('onboarding:analytics.termsConditions.desc')}</AnalyticsText>
              </Box>
              <Box alignItems="center" horizontal mx={5}>
                <CheckBox isChecked={termsConditionsToggle} onChange={this.handleTermsToggle} />
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
          isContinueDisabled={!termsConditionsToggle}
        />
      </Box>
    )
  }
}

export default connect(null, mapDispatchToProps)(Analytics)

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
