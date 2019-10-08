// @flow

import React from 'react'
import { getDeviceModel } from '@ledgerhq/devices'

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
      <Button outlineGrey onClick={() => prevStep()}>
        {t('common.back')}
      </Button>
      <Box horizontal ml="auto">
        <Button
          outline
          outlineColor="alertRed"
          disabled={false}
          event="Onboarding Skip Genuine Check"
          onClick={() => nextStep()}
          mx={2}
        >
          {t('common.skipThisStep')}
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
  const model = getDeviceModel(onboarding.deviceModelId || 'nanoS')

  return (
    <Box
      horizontal
      align="center"
      flow={2}
      color={colors.alertRed}
      ff="Inter|SemiBold"
      fontSize={4}
    >
      <IconExclamationCircle size={16} />
      <span>
        <TranslatedError error={onboarding.genuine.genuineCheckUnavailable} />
      </span>
      <FakeLink
        color="alertRed"
        ff="Inter|SemiBold"
        fontSize={4}
        underline
        onClick={() => {
          handleOpenGenuineCheckModal()
          track('Genuine Check Retry', {
            flowType: onboarding.flowType,
            deviceType: model.productName,
          })
        }}
      >
        {t('common.retry')}
      </FakeLink>
    </Box>
  )
}
