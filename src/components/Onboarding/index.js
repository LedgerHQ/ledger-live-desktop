// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import styled from 'styled-components'

import type { T } from 'types/common'
import type { OnboardingState } from 'reducers/onboarding'

import { saveSettings } from 'actions/settings'
import { nextStep, prevStep, jumpStep } from 'reducers/onboarding'
import { getCurrentDevice } from 'reducers/devices'

// TODO: re-write it without auto lock, fixed width of the password modal, not dynamic titles
import { unlock } from 'reducers/application'

import Box from 'components/base/Box'

import Start from './steps/Start'
import InitStep from './steps/Init'
import OnboardingBreadcrumb from './OnboardingBreadcrumb'
import SelectDevice from './steps/SelectDevice'
import SelectPIN from './steps/SelectPIN'
import WriteSeed from './steps/WriteSeed'
import GenuineCheck from './steps/GenuineCheck'
import SetPassword from './steps/SetPassword'
import Analytics from './steps/Analytics'
import Finish from './steps/Finish'

const STEPS = {
  init: InitStep,
  selectDevice: SelectDevice,
  selectPIN: SelectPIN,
  writeSeed: WriteSeed,
  genuineCheck: GenuineCheck,
  setPassword: SetPassword,
  analytics: Analytics,
  finish: Finish,
  start: Start,
}

const mapStateToProps = state => ({
  hasCompletedOnboarding: state.settings.hasCompletedOnboarding,
  onboarding: state.onboarding,
  getCurrentDevice: getCurrentDevice(state),
})

const mapDispatchToProps = {
  saveSettings,
  nextStep,
  prevStep,
  jumpStep,
  unlock,
}

type Props = {
  t: T,
  hasCompletedOnboarding: boolean,
  saveSettings: Function,
  onboarding: OnboardingState,
  prevStep: Function,
  nextStep: Function,
  jumpStep: Function,
  getCurrentDevice: Function,
  unlock: Function,
}

export type StepProps = {
  t: T,
  prevStep: Function,
  nextStep: Function,
  jumpStep: Function,
  finish: Function,
  savePassword: Function,
  getDeviceInfo: Function,
}

class Onboarding extends PureComponent<Props> {
  getDeviceInfo = () => this.props.getCurrentDevice
  finish = () => this.props.saveSettings({ hasCompletedOnboarding: true })
  savePassword = hash => {
    this.props.saveSettings({
      password: {
        isEnabled: hash !== undefined,
        value: hash,
      },
    })
    this.props.unlock()
  }

  render() {
    const { hasCompletedOnboarding, onboarding, prevStep, nextStep, jumpStep, t } = this.props
    if (hasCompletedOnboarding) {
      return null
    }

    const StepComponent = STEPS[onboarding.stepName]
    const step = onboarding.steps[onboarding.stepIndex]

    if (!StepComponent || !step) {
      console.warn(`You reached an impossible onboarding step.`) // eslint-disable-line
      return null
    }

    const stepProps: StepProps = {
      t,
      onboarding,
      prevStep,
      nextStep,
      jumpStep,
      finish: this.finish,
      savePassword: this.savePassword,
      getDeviceInfo: this.getDeviceInfo,
    }

    return (
      <Container>
        {step.options.showBreadcrumb && <OnboardingBreadcrumb />}
        <StepContainer>
          <StepComponent {...stepProps} />
        </StepContainer>
      </Container>
    )
  }
}

const Container = styled(Box).attrs({
  bg: 'white',
  p: 60,
})`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 25;
`
const StepContainer = styled(Box).attrs({
  p: 40,
})``
export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(Onboarding)
