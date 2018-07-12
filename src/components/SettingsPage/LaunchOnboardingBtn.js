// @flow

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { saveSettings } from 'actions/settings'
import Track from 'analytics/Track'
import Onboarding from 'components/Onboarding'
import Button from 'components/base/Button/index'
import { relaunchOnboarding } from 'reducers/onboarding'

const mapDispatchToProps = {
  saveSettings,
  relaunchOnboarding,
}

type Props = {
  saveSettings: Function,
  relaunchOnboarding: Function,
}

class LaunchOnboardingBtn extends PureComponent<Props> {
  handleLaunchOnboarding = () => {
    this.props.saveSettings({ hasCompletedOnboarding: false })
    this.props.relaunchOnboarding({ onboardingRelaunched: true })
    return <Onboarding />
  }
  render() {
    return (
      <Fragment>
        <Track onUpdate event={'Launch Onboarding from Settings'} />
        <Button primary onClick={this.handleLaunchOnboarding}>
          Launch
        </Button>
      </Fragment>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(LaunchOnboardingBtn)
