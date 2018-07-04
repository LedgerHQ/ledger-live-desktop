// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import styled from 'styled-components'

import type { T } from 'types/common'
import type { OnboardingState } from 'reducers/onboarding'
import type { SettingsState } from 'reducers/settings'

import { MODAL_DISCLAIMER, MODAL_DISCLAIMER_DELAY } from 'config/constants'
import { saveSettings } from 'actions/settings'
import { openModal } from 'reducers/modals'
import {
  nextStep,
  prevStep,
  jumpStep,
  updateGenuineCheck,
  isLedgerNano,
  flowType,
} from 'reducers/onboarding'
import { getCurrentDevice } from 'reducers/devices'

import { unlock } from 'reducers/application'

import Box from 'components/base/Box'

import Start from './steps/Start'
import InitStep from './steps/Init'
import NoDeviceStep from './steps/NoDevice'
import OnboardingBreadcrumb from './OnboardingBreadcrumb'
import SelectDevice from './steps/SelectDevice'
import SelectPIN from './steps/SelectPIN/index'
import WriteSeed from './steps/WriteSeed/index'
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
  noDevice: NoDeviceStep,
}

const mapStateToProps = state => ({
  hasCompletedOnboarding: state.settings.hasCompletedOnboarding,
  onboarding: state.onboarding,
  settings: state.settings,
  getCurrentDevice: getCurrentDevice(state),
})

const mapDispatchToProps = {
  saveSettings,
  nextStep,
  prevStep,
  jumpStep,
  unlock,
  openModal,
}

type Props = {
  t: T,
  hasCompletedOnboarding: boolean,
  saveSettings: Function,
  onboarding: OnboardingState,
  settings: SettingsState,
  prevStep: Function,
  nextStep: Function,
  jumpStep: Function,
  getCurrentDevice: Function,
  unlock: Function,
  openModal: string => void,
}

export type StepProps = {
  t: T,
  onboarding: OnboardingState,
  settings: SettingsState,
  prevStep: Function,
  nextStep: Function,
  jumpStep: Function,
  finish: Function,
  saveSettings: Function,
  savePassword: Function,
  getDeviceInfo: Function,
  updateGenuineCheck: Function,
  openModal: Function,
  isLedgerNano: Function,
  flowType: Function,
}

class Onboarding extends PureComponent<Props> {
  getDeviceInfo = () => this.props.getCurrentDevice
  finish = () => {
    this.props.saveSettings({ hasCompletedOnboarding: true })
    setTimeout(() => {
      this.props.openModal(MODAL_DISCLAIMER)
    }, MODAL_DISCLAIMER_DELAY)
  }
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
    const {
      hasCompletedOnboarding,
      onboarding,
      prevStep,
      nextStep,
      jumpStep,
      settings,
      t,
    } = this.props
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
      settings,
      updateGenuineCheck,
      openModal,
      isLedgerNano,
      flowType,
      prevStep,
      nextStep,
      jumpStep,
      finish: this.finish,
      savePassword: this.savePassword,
      getDeviceInfo: this.getDeviceInfo,
      saveSettings,
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

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(Onboarding)
