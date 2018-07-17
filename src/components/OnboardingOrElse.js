// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { hasCompletedOnboardingSelector } from 'reducers/settings'
import { onboardingRelaunchedSelector } from 'reducers/onboarding'
import Onboarding from './Onboarding'

type Props = {
  hasCompletedOnboarding: boolean,
  onboardingRelaunched: boolean,
  children: *,
}

class OnboardingOrElse extends PureComponent<Props> {
  render() {
    const { hasCompletedOnboarding, onboardingRelaunched, children } = this.props
    if (!hasCompletedOnboarding || onboardingRelaunched) {
      return <Onboarding />
    }
    return children
  }
}

export default connect(
  createStructuredSelector({
    hasCompletedOnboarding: hasCompletedOnboardingSelector,
    onboardingRelaunched: onboardingRelaunchedSelector,
  }),
)(OnboardingOrElse)
