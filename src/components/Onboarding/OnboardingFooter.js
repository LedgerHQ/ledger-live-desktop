// @flow

import React from 'react'

import type { T } from 'types/common'

import Button from 'components/base/Button'
import { OnboardingFooterWrapper } from './helperComponents'

type Props = {
  t: T,
  nextStep: () => void,
  prevStep: () => void,
  isContinueDisabled?: boolean,
}

const OnboardingFooter = ({
  t,
  nextStep,
  prevStep,
  isContinueDisabled,

  ...props
}: Props) => (
  <OnboardingFooterWrapper {...props}>
    <Button outlineGrey onClick={() => prevStep()}>
      {t('app:common.back')}
    </Button>
    <Button disabled={isContinueDisabled} primary onClick={() => nextStep()} ml="auto">
      {t('app:common.continue')}
    </Button>
  </OnboardingFooterWrapper>
)
export default OnboardingFooter
