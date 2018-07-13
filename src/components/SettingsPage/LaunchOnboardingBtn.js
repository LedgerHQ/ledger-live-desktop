// @flow

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { saveSettings } from 'actions/settings'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import type { SettingsState } from 'reducers/settings'
import type { OnboardingState } from 'reducers/onboarding'
import Track from 'analytics/Track'
import Onboarding from 'components/Onboarding'
import Button from 'components/base/Button/index'
import { relaunchOnboarding } from 'reducers/onboarding'

const mapDispatchToProps = {
  saveSettings,
  relaunchOnboarding,
}

type Props = {
  saveSettings: ($Shape<SettingsState>) => void,
  relaunchOnboarding: ($Shape<OnboardingState>) => void,
  t: T,
}

class LaunchOnboardingBtn extends PureComponent<Props> {
  handleLaunchOnboarding = () => {
    this.props.saveSettings({ hasCompletedOnboarding: false })
    this.props.relaunchOnboarding({ onboardingRelaunched: true })
    return <Onboarding />
  }
  render() {
    const { t } = this.props
    return (
      <Fragment>
        <Track onUpdate event={'Launch Onboarding from Settings'} />
        <Button primary small onClick={this.handleLaunchOnboarding}>
          {t('app:common.launch')}
        </Button>
      </Fragment>
    )
  }
}

export default translate()(
  connect(
    null,
    mapDispatchToProps,
  )(LaunchOnboardingBtn),
)
