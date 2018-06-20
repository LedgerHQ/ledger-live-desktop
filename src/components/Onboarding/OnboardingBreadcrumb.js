// @flow

import React from 'react'
import { connect } from 'react-redux'
import findIndex from 'lodash/findIndex'
import { translate } from 'react-i18next'

import type { OnboardingState } from 'reducers/onboarding'

import Breadcrumb from 'components/Breadcrumb'

const mapStateToProps = state => ({
  onboarding: state.onboarding,
})

type Props = {
  onboarding: OnboardingState,
  t: *,
}

function OnboardingBreadcrumb(props: Props) {
  const { onboarding, t } = props
  const { stepName, genuine } = onboarding

  const filteredSteps = onboarding.steps
    .filter(step => !step.external)
    .map(step => ({ ...step, label: t(step.label) })) // TODO: translate

  const stepIndex = findIndex(filteredSteps, s => s.name === stepName)
  const genuineStepIndex = findIndex(filteredSteps, s => s.name === 'genuineCheck')

  return (
    <Breadcrumb
      stepsErrors={genuine.isGenuineFail ? [genuineStepIndex] : undefined}
      currentStep={stepIndex}
      items={filteredSteps}
    />
  )
}

export default translate()(connect(mapStateToProps)(OnboardingBreadcrumb))
