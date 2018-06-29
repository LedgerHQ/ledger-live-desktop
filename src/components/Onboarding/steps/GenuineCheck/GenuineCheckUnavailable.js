// @flow

import React from 'react'
import { colors } from 'styles/theme'

import type { T } from 'types/common'
import type { OnboardingState } from 'reducers/onboarding'

import FakeLink from 'components/base/FakeLink'
import IconExclamationCircle from 'icons/ExclamationCircle'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import TranslatedError from 'components/TranslatedError'
import { track } from 'analytics/segment'

import { OnboardingFooterWrapper } from '../../helperComponents'

export function GenuineCheckUnavailableFooter({
  prevStep,
  nextStep,
  t,
}: {
  prevStep: () => void,
  nextStep: () => void,
  t: T,
}) {
  return (
    <OnboardingFooterWrapper>
      <Button padded outlineGrey onClick={() => prevStep()}>
        {t('app:common.back')}
      </Button>
      <Box horizontal ml="auto">
        <Button
          padded
          disabled={false}
          event="Onboarding Skip Genuine Check"
          onClick={() => nextStep()}
          mx={2}
        >
          {t('app:common.skipThisStep')}
        </Button>
        <Button padded onClick={nextStep} disabled primary>
          {t('app:common.continue')}
        </Button>
      </Box>
    </OnboardingFooterWrapper>
  )
}

export function GenuineCheckUnavailableMessage({
  handleOpenGenuineCheckModal,
  onboarding,
  t,
}: {
  handleOpenGenuineCheckModal: () => void,
  t: T,
  onboarding: OnboardingState,
}) {
  return (
    <Box
      horizontal
      align="center"
      flow={2}
      color={colors.alertRed}
      ff="Open Sans|SemiBold"
      fontSize={4}
    >
      <IconExclamationCircle size={16} />
      <span>
        <TranslatedError error={onboarding.genuine.genuineCheckUnavailable} />
      </span>
      <FakeLink
        color="alertRed"
        ff="Open Sans|SemiBold"
        fontSize={4}
        underline
        onClick={() => {
          handleOpenGenuineCheckModal()
          track('Genuine Check Retry', {
            flowType: onboarding.flowType,
            deviceType: onboarding.isLedgerNano ? 'Nano S' : 'Blue',
          })
        }}
      >
        {t('app:common.retry')}
      </FakeLink>
    </Box>
  )
}
