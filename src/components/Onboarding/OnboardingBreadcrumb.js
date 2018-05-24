// @flow

import React from 'react'
import { connect } from 'react-redux'
import findIndex from 'lodash/findIndex'

import type { OnboardingState } from 'reducers/onboarding'

import Breadcrumb from 'components/Breadcrumb'

const mapStateToProps = state => ({
  onboarding: state.onboarding,
})

type Props = {
  onboarding: OnboardingState,
}

function OnboardingBreadcrumb(props: Props) {
  const { onboarding } = props
  const { stepName, isGenuineFail } = onboarding

  const filteredSteps = onboarding.steps
    .filter(step => !step.external)
    .map(step => ({ ...step, label: step.label })) // TODO: translate

  const stepIndex = findIndex(filteredSteps, s => s.name === stepName)
  const genuineStepIndex = findIndex(filteredSteps, s => s.name === 'genuineCheck')

  return (
    <Breadcrumb
      stepsErrors={isGenuineFail ? [genuineStepIndex] : undefined}
      currentStep={stepIndex}
      items={filteredSteps}
    />
  )
}

export default connect(mapStateToProps)(OnboardingBreadcrumb)
