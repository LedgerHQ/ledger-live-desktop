// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { hasCompletedOnboardingSelector } from 'reducers/settings'
import Onboarding from './Onboarding'

type Props = {
  hasCompletedOnboarding: boolean,
  children: *,
}

class OnboardingOrElse extends PureComponent<Props> {
  render() {
    const { hasCompletedOnboarding, children } = this.props
    if (hasCompletedOnboarding) {
      return children
    }
    return <Onboarding />
  }
}

export default connect(
  createStructuredSelector({
    hasCompletedOnboarding: hasCompletedOnboardingSelector,
  }),
)(OnboardingOrElse)
