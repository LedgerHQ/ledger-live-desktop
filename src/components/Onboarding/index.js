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

import Box from 'components/base/Box'

import OnboardingBreadcrumb from './OnboardingBreadcrumb'
import InitStep from './steps/Init'
import UserChoice from './steps/UserChoice'

const STEPS = {
  init: InitStep,
  userChoice: UserChoice,
}

const mapStateToProps = state => ({
  hasCompletedOnboarding: state.settings.hasCompletedOnboarding,
  onboarding: state.onboarding,
})

const mapDispatchToProps = {
  saveSettings,
  nextStep,
  prevStep,
  jumpStep,
}

type Props = {
  t: T,
  hasCompletedOnboarding: boolean,
  saveSettings: Function,
  onboarding: OnboardingState,
  prevStep: Function,
  nextStep: Function,
  jumpStep: Function,
}

export type StepProps = {
  t: T,
  prevStep: Function,
  nextStep: Function,
  jumpStep: Function,
  finish: Function,
}

class Onboarding extends PureComponent<Props> {
  finish = () => this.props.saveSettings({ hasCompletedOnboarding: true })

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
    }

    return (
      <Container>
        {step.options.showBreadcrumb && <OnboardingBreadcrumb />}
        <StepComponent {...stepProps} />
      </Container>
    )
  }
}

const Container = styled(Box).attrs({
  bg: 'white',
})`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
`

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(Onboarding)
