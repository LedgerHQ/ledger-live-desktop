// @flow

import React from 'react'
import { colors } from 'styles/theme'

import type { T } from 'types/common'
import type { OnboardingState } from 'reducers/onboarding'

import FakeLink from 'components/base/FakeLink'
import IconCross from 'icons/Cross'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import TranslatedError from 'components/TranslatedError'
import Track from 'analytics/Track'
import { track } from 'analytics/segment'

import { OnboardingFooterWrapper } from '../../helperComponents'

export function GenuineCheckUnavailableFooter({
  prevStep,
  nextStep,
  t,
  onboarding,
}: {
  prevStep: () => void,
  nextStep: () => void,
  t: T,
  onboarding: OnboardingState,
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
          event="Skip Genuine Check"
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
    <Box align="center" flow={1} color={colors.alertRed}>
      <FakeLink
        ff="Open Sans|Regular"
        fontSize={4}
        underline
        onClick={() => {
          handleOpenGenuineCheckModal(),
            track('Genuine Check Unavailable Retry', {
              flowType: onboarding.flowType,
              deviceType: onboarding.isLedgerNano ? 'Nano S' : 'Blue',
            })
        }}
      >
        {t('app:common.retry')}
      </FakeLink>
      <Box horizontal justify="center">
        <Box justifyContent="center">
          <IconCross size={12} />
        </Box>
        <Box ff="Open Sans|Regular" style={{ maxWidth: 150 }} fontSize={2} ml={1}>
          <TranslatedError error={onboarding.genuine.genuineCheckUnavailable} />
        </Box>
      </Box>
    </Box>
  )
}
