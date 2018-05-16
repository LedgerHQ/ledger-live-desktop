// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import IconLedgerNano from 'icons/onboarding/LedgerNano'
import IconLedgerBlue from 'icons/onboarding/LedgerBlue'
import { Title, Description, Inner } from '../helperComponents'

import type { StepProps } from '..'

export default (props: StepProps) => {
  const { nextStep, t } = props

  return (
    <Box sticky alignItems="center" justifyContent="center">
      <Box align="center">
        <Title>{t('onboarding:selectDevice.title')}</Title>
        <Description style={{ maxWidth: 714 }}>{t('onboarding:selectDevice.desc')}</Description>
        <Box>
          <Inner>
            <DeviceContainer onClick={() => nextStep()}>
              <DeviceIcon>
                <IconLedgerNano />
              </DeviceIcon>
              <BlockTitle pb={3}>{t('onboarding:selectDevice.ledgerNanoCard.title')}</BlockTitle>
              <BlockDescription>
                {t('onboarding:selectDevice.ledgerNanoCard.desc')}
              </BlockDescription>
            </DeviceContainer>
            <DeviceContainer>
              <DeviceIcon>
                <IconLedgerBlue />
              </DeviceIcon>
              <BlockTitle pb={3}>{t('onboarding:selectDevice.ledgerBlueCard.title')}</BlockTitle>
              <BlockDescription>
                {t('onboarding:selectDevice.ledgerBlueCard.desc')}
              </BlockDescription>
            </DeviceContainer>
          </Inner>
        </Box>
      </Box>
    </Box>
  )
}

const DeviceContainer = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`
  width: 218px;
  height: 204px;
  border: 1px solid #d8d8d8;
  &:hover,
  &:focus {
    opacity: 0.5;
    cursor: pointer;
  }
`
const DeviceIcon = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
  color: 'graphite',
})`
  width: 55px;
  min-height: 80px;
`
export const BlockDescription = styled(Box).attrs({
  ff: 'Open Sans|Regular',
  fontSize: 4,
  textAlign: 'center',
  color: 'grey',
})``
export const BlockTitle = styled(Box).attrs({
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  textAlign: 'center',
})``
