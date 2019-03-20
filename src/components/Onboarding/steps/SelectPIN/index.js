// @flow

import React from 'react'
import { getDeviceModel } from '@ledgerhq/devices'

import Box from 'components/base/Box'
import TrackPage from 'analytics/TrackPage'
import type { DeviceModelId } from '@ledgerhq/devices'

import GrowScroll from 'components/base/GrowScroll'
import { Title, FixedTopContainer } from '../../helperComponents'
import OnboardingFooter from '../../OnboardingFooter'
import SelectPINnano from './SelectPINnano'
import SelectPINblue from './SelectPINblue'
import SelectPINnanoX from './SelectPINnanoX'
import SelectPINrestoreNano from './SelectPINrestoreNano'
import SelectPINRestoreNanoX from './SelectPINRestoreNanoX'
import SelectPINrestoreBlue from './SelectPINrestoreBlue'
import type { StepProps } from '../..'

const SelectPin = ({ modelId, restore = false }: { modelId: DeviceModelId, restore?: boolean }) => {
  switch (modelId) {
    case 'nanoX':
      return restore ? <SelectPINRestoreNanoX /> : <SelectPINnanoX />
    case 'blue':
      return restore ? <SelectPINrestoreBlue /> : <SelectPINblue />
    default:
      return restore ? <SelectPINrestoreNano /> : <SelectPINnano />
  }
}

export default (props: StepProps) => {
  const { nextStep, prevStep, t, onboarding } = props

  const model = getDeviceModel(onboarding.deviceModelId || 'nanoS')

  return (
    <FixedTopContainer>
      <GrowScroll pb={7}>
        <TrackPage
          category="Onboarding"
          name="Choose PIN"
          flowType={onboarding.flowType}
          deviceType={model.productName}
        />
        {onboarding.flowType === 'restoreDevice' ? (
          <Box grow alignItems="center">
            <Title>{t('onboarding.selectPIN.restore.title')}</Title>
            <Box align="center" mt={7}>
              <SelectPin modelId={model.id} restore />
            </Box>
          </Box>
        ) : (
          <Box grow alignItems="center">
            <Title>{t('onboarding.selectPIN.initialize.title')}</Title>
            <Box align="center" mt={7}>
              <SelectPin modelId={model.id} />
            </Box>
          </Box>
        )}
      </GrowScroll>
      <OnboardingFooter horizontal flow={2} t={t} nextStep={nextStep} prevStep={prevStep} />
    </FixedTopContainer>
  )
}
