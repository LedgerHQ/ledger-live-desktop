// @flow

import React, { Fragment } from 'react'
import { i } from 'helpers/staticPath'

import type { T } from 'types/common'
import type { OnboardingState } from 'reducers/onboarding'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import TrackPage from 'analytics/TrackPage'

import { Title, Description, OnboardingFooterWrapper } from '../../helperComponents'

export function GenuineCheckErrorPage({
  redoGenuineCheck,
  contactSupport,
  onboarding,
  t,
}: {
  redoGenuineCheck: () => void,
  contactSupport: () => void,
  onboarding: OnboardingState,
  t: T,
}) {
  return (
    <Box sticky pt={50}>
      <TrackPage
        category="Onboarding"
        name="Genuine Check Error Page"
        flowType={onboarding.flowType}
        deviceType={onboarding.isLedgerNano ? 'Nano S' : 'Blue'}
      />
      <Box grow alignItems="center" justifyContent="center">
        {onboarding.isLedgerNano ? (
          <Fragment>
            <Title>{t('onboarding:genuineCheck.errorPage.ledgerNano.title')}</Title>
            <Description>{t('onboarding:genuineCheck.errorPage.ledgerNano.desc')}</Description>
            <Box mt={5} mr={7}>
              <img alt="" src={i('nano-error-onb.svg')} />
            </Box>
          </Fragment>
        ) : (
          <Fragment>
            <Title>{t('onboarding:genuineCheck.errorPage.ledgerBlue.title')}</Title>
            <Description pb={5}>
              {t('onboarding:genuineCheck.errorPage.ledgerBlue.desc')}
            </Description>
            <Box alignItems="center">
              <img alt="" src={i('blue-error-onb.svg')} />
            </Box>
          </Fragment>
        )}
      </Box>
      <OnboardingFooterWrapper>
        <Button padded outlineGrey onClick={() => redoGenuineCheck()}>
          {t('app:common.back')}
        </Button>
        <Button padded danger onClick={() => contactSupport()} ml="auto">
          {t('onboarding:genuineCheck.buttons.contactSupport')}
        </Button>
      </OnboardingFooterWrapper>
    </Box>
  )
}
