// @flow

import React, { PureComponent } from 'react'
import { openURL } from 'helpers/linking'
import { i } from 'helpers/staticPath'

import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'
import LedgerLiveLogo from 'components/base/LedgerLiveLogo'
import TrackPage from 'analytics/TrackPage'
import { urls } from 'config/urls'
import IconCart from 'icons/Cart'
import IconTruck from 'icons/Truck'
import IconInfoCircle from 'icons/InfoCircle'
import Button from '../../base/Button/index'
import { Title, OnboardingFooterWrapper } from '../helperComponents'
import { OptionFlowCard } from './Init'

import type { StepProps } from '..'

class NoDevice extends PureComponent<StepProps, *> {
  render() {
    const { t, prevStep } = this.props

    const optionCards = [
      {
        key: 'buyNew',
        icon: <IconCart size={20} />,
        title: t('onboarding.noDevice.buyNew.title'),
        onClick: () => {
          openURL(urls.noDeviceBuyNew)
        },
      },
      {
        key: 'trackOrder',
        icon: <IconTruck size={20} />,
        title: t('onboarding.noDevice.trackOrder.title'),
        onClick: () => {
          openURL(urls.noDeviceTrackOrder)
        },
      },
      {
        key: 'learnMore',
        icon: <IconInfoCircle size={20} />,
        title: t('onboarding.noDevice.learnMore.title'),
        onClick: () => {
          openURL(urls.noDeviceLearnMore)
        },
      },
    ]

    return (
      <Box sticky>
        <GrowScroll pb={7} pt={130}>
          <TrackPage category="Onboarding" name="No Device" />
          <Box grow alignItems="center">
            <LedgerLiveLogo
              width="64px"
              height="64px"
              icon={
                <img
                  src={i('ledgerlive-logo.svg')}
                  alt=""
                  draggable="false"
                  width={40}
                  height={40}
                />
              }
            />
            <Box m={5} style={{ maxWidth: 480 }}>
              <Title>{t('onboarding.noDevice.title')}</Title>
            </Box>
            <Box pt={4} flow={4}>
              {optionCards.map(card => (
                <OptionFlowCard key={card.key} card={card} />
              ))}
            </Box>
          </Box>
        </GrowScroll>
        <OnboardingFooterWrapper>
          <Button outlineGrey onClick={() => prevStep()} mr="auto">
            {t('common.back')}
          </Button>
        </OnboardingFooterWrapper>
      </Box>
    )
  }
}

export default NoDevice
