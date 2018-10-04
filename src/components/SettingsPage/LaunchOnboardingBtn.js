// @flow

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import Track from 'analytics/Track'
import Button from 'components/base/Button/index'
import { relaunchOnboarding } from 'reducers/onboarding'

const mapDispatchToProps = {
  relaunchOnboarding,
}

type Props = {
  relaunchOnboarding: boolean => void,
  t: T,
}

class LaunchOnboardingBtn extends PureComponent<Props> {
  handleLaunchOnboarding = () => {
    this.props.relaunchOnboarding(true)
  }
  render() {
    const { t } = this.props
    return (
      <Fragment>
        <Track onUpdate event={'Launch Onboarding from Settings'} />
        <Button primary small onClick={this.handleLaunchOnboarding}>
          {t('common.launch')}
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
